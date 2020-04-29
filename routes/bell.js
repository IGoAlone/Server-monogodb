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
var bellSchema = mongoose.Schema(
{  
    latitude:'number',
    longitude:'number',
    road_name:'string'
  
}
);

//cctvSchema인 DB Schema를 bell모델로 컴파일
var bell = mongoose.model('bell',bellSchema);


/* GET users listing. */
router.get('/', async function(req, res, next) {
  const result = await bell.find({});
  res.send(result);
});

module.exports = router;
