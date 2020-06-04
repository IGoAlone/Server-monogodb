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
var storeSchema = new mongoose.Schema(
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
   region : {
     type: String
   },
   jibun : {
     type: String
   },
   post_number : {
     type: String
   },
   startday : {
     type : Number
   },
   name : {
    type: String
  },

}, {collection : 'store'}
);

//cctvSchema인 DB Schema를 Cctv모델로 컴파일
var storeModel = mongoose.model('store',storeSchema);

function calDistance(lat1, lon1, lat2, lon2){
  var theta = lon1 - lon2;
  dist = Math.sin(deg2rad(lat1))*Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) *
  Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
  dist = Math.acos(dist);
  dist = rad2deg(dist);
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
  return Number(dist*1000).toFixed(2);
}

function deg2rad(deg){
  return (deg * Math.PI / 180);
}
function rad2deg(rad){
  return (rad * 180 / Math.PI);
}
/* GET users listing. */
router.get('/', async function(req, res, next) {
  var reqLatitude = req.query.latitude;
  var reqLongitude = req.query.longitude;
  var distanceResult = new Array();
  try {
    const result = await storeModel.find({});
    for(let i = 0; i < result.length; i++){
      if(calDistance(Number(reqLatitude), Number(reqLongitude), result[i].latitude, result[i].longitude) <= 50){
          distanceResult.push(result[i]);
      }
    }
    if(distanceResult.length <= 3) {
      distanceResult.length = []; //배열 초기화
      for(let i = 0; i < result.length; i++){
         
          if(calDistance(Number(reqLatitude), Number(reqLongitude), result[i].latitude, result[i].longitude) <= 100){
            distanceResult.push(result[i]);
          }
      }
    }
    
    console.log(distanceResult);
    res.send(distanceResult);

  }catch(err){
    console.error(err);
  }
});

module.exports = router;
