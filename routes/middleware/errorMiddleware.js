// 处理错误的中间件

const sendMsg = require('../getSendResult')
const multer = require('multer')

module.exports = function (err, req, res, next){

  console.log('req.baseUrl: ', req.baseUrl)

  if(err){
    if(err instanceof multer.MulterError){
      //上传文件错误
			res.status(200).send(sendMsg.sendErr(err.message))
			return;
    }

    //发生了错误
		const msg = err instanceof Error ? err.message : err
		
		res.status(500).send(sendMsg.sendErr(msg))
  }else{
    next()
  }
}

