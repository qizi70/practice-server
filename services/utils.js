
/**
 * @description: 计算工时
 * @param {*} start 开始时间
 * @param {*} end 结束时间
 * @return {*}
 */
exports.calculateHours = function (start, end) {
  if(!start || !end) return;
  
  // 一个小时的毫秒数
  const oneHour = 60 * 60 * 1000;
  
  // 转化为今天的日期
  const startDate = new Date('1970-01-01T' + start + 'Z');
  const endDate = new Date('1970-01-01T' + end + 'Z');

  if (startDate >= endDate) {
    throw new Error('结束时间需要大于开始时间');
  }
  
  // 计算毫秒数
  let diff = endDate - startDate;

  // 处理中间的12点到1点
  const noonStart = new Date('1970-01-01T12:00:00Z');
  const noonEnd = new Date('1970-01-01T13:00:00Z');
  
  if (startDate < noonEnd && endDate > noonStart) { // 有重合的部分
    // 如果开始时间在这期间，那么从13:00开始计算
    if (startDate >= noonStart && startDate < noonEnd) {
      diff -= (noonEnd - startDate);
    }
    // 如果结束时间在这期间，那么只计算到12:00
    else if (endDate > noonStart && endDate <= noonEnd) {
      diff -= (endDate - noonStart);
    }
    // 如果都不在这期间，那么就把这个时间段减去
    else {
      diff -= oneHour;
    }
  }

  // 计算小时数和分钟数，分钟数换算成小时的小数部分
  const result = diff / oneHour;
  return result.toFixed(1); 
}

/**
 * @description: 通过状态获取 应在岗工时
 * @param {*} status
 * @return {*}
 */
exports.getWorkingHoursByStatus = function (status) {
  /**
   *  1. 正常出勤	8
      2. 上午请假	5.5
      3. 下午请假	2.5
      4. 全天请假	0
      5. 全天加班	0
   */  
  const arr = ['0', '8', '5.5', '2.5']
  return arr[status] || '0'
}
