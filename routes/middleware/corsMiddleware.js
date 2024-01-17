
const allowOrigins = [
	'http://127.0.0.1:5008',
	'null'
]

module.exports = function (req, res, next){
	console.log('req')
	//处理预检请求
	if(req.method === "OPTIONS"){
		res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method'])
		res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'])
	}
	
	res.header('Access-Control-Allow-Credentials', true)
	
	//处理简单请求
	if('origin' in req.headers && allowOrigins.includes(req.headers.origin)){
		res.header('Access-Control-Allow-Origin', req.headers.origin);
	}
	next();
	
}