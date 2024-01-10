
// 过滤出不需要返回给前端的字段
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

// 返回需要的数据
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