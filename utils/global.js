
/**
 * @description: 传入对象或数据，剔除固定不需要的属性
 * @param {*} result
 * @return {*}
 */
exports.filterGeneralProperty = function (result){
  const propertyType = Object.prototype.toString

  if(propertyType.call(result) === '[object Array]'){

    return result.map(item => {
      const { createdAt, updatedAt, deletedAt, ...newObj } = item
      return newObj
    })

  }else if(propertyType.call(result) === '[object Object]'){
    const { createdAt, updatedAt, deletedAt, ...newObj } = result
    return newObj
  }

  return result
}

/**
 * @description: 传入对象 和 需要存在的属性字符串，只保留需要的数据
 * @param {Object} obj
 * @param {array} props
 * @return {*}
 */
exports.pick = function (obj, ...props){
	if(!obj || typeof obj !== 'object'){
		return obj
	}
	
	const newObj = {};
	for(const key in obj){
		if(props.includes(key)){
			newObj[key] = obj[key]
		}
	}
	return newObj;
}

/**
 * @description: 传入日期字符串，补0  '2000-1-1' -> '2000-01-01'
 * @param {*} dateString
 * @return {string}
 */
exports.formatDate = function (dateString) {
  if(!dateString) return;

  const arr = dateString.split('-').map(item => {
    if(item.length == 1){
      return item = '0' + item
    }
    return item
  })

  return arr.join('-');
}

/**
 * @description: 根据时间戳和随机数 获取随机id
 * @return {*}
 */
exports.getRandomId = function (){
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

/**
 * @description: 包一层错误类型
 * @param {*} err
 * @return {*}
 */
exports.handleError = function (err){
  if(err instanceof Error){
    return err
  }
  return Error(JSON.stringify(err))
}
