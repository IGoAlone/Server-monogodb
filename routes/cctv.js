var express = require('express');
var router = express.Router();

//몽구스 패키지 얻어오는 부분
var mongoose = require('mongoose');

//몽고디비에 연결
mongoose.connect("mongodb://localhost:27017/igoalone",{useUnifiedTopology:true,useNewUrlParser:true});


var db = mongoose.connection;
//에러났을 때 알리는 부분
db.on('error',console.error.bind(console,'connection error'));
//연결이 열렸을 때 실행되는 부분
db.once('open',function callback(){
    console.log("open");
});

//디비 스키마 만드는 부분
const cctvSchema = new mongoose.Schema(
{  
  latitude: {
    type: Number
   },
   longitude: {
     type: Number 
   },
   road: {
     type: String
   },
   location : {
     type: String
   },
   jibun : {
     type: String
   },
   phone_number : {
     type: String
   },
   day : {
     type : Number
   },

 
}, {collection : 'cctv'}
);

//cctvSchema인 DB Schema를 Cctv모델로 컴파일
const cctvModel = mongoose.model('cctv',cctvSchema);


/* GET users listing. */
router.get('/', async function(req, res, next) {
  var reqLatitude = req.query.latitude;
  console.log(reqLatitude);
  var minLatitude = Number(reqLatitude) - 0.00016;
  var maxLatitude = Number(reqLatitude) + 0.00016;
  console.log(minLatitude, maxLatitude);
  //var reqLongitude = req.params.longitude;
  try {
    const result = await cctvModel.find({latitude : {$gte : minLatitude, $lte: maxLatitude}});
    console.log("hello");
    res.send(result);
  }catch(err){
    console.error(err);
  }
 
});

module.exports = router;
