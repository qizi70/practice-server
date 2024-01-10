exports.sendErr = function (err = "'getSendResult: 'server internal error", errCode = 500){
	return {
		code: errCode,
		msg: err,
		data: null
	}
}

// 请求接口失败的模版
exports.getErrResult = function (errors = {}, msg = '', code = -1){
	return {
		code,
		msg,
		errors,
		status: 'error',
	}
}

// 请求接口成功的模版
exports.getResult = function (data = [], msg = '', code = 10000){
	return {
		code,
		msg,
		data,
		status: 'success',
	}
}

exports.asyncHandler = (handler) => {
	return async (req, res, next) => {
		try{
			const object = await handler(req, res, next)

			if(object.result instanceof Error){
				// 错误情况
				res.status(400).send(exports.getErrResult(object.result.message))
			}else if(object.successed){
				// 不需要返回date
				res.send(exports.getResult([], object.msg))
			}else if(object.result){
				// 需要返回结果
				res.send(exports.getResult(object.result, object.msg))
			}
		}catch(err){
			next(err)
		}
	}
}
