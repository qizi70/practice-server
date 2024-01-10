// @ts-ignore
const WorkingHours = require('../models/WorkingHours.js')
const validate = require('validate.js')
const moment = require('moment')
const { pick, formatDate } = require('../utils/global')
const { formatDate } = require('../utils/global.js')

/**
 * @description: 添加/修改记录
 * @param {*} obj
 * @return {*}
 */
exports.addRecords = async (obj) => {
  obj = pick(obj, 'account', 'startTime', 'endTime', 'date')

  if(obj.date){
    obj.date = formatDate(obj.date)
  }

  // 自定义一个时间验证器
  validate.validators.time = (value) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      // 如果不满足 HH:mm 的格式, 返回错误信息
      return "must be a valid time format (HH:mm)";
    }
  };
  
  const rule = {
    account: {
      presence: true,
			type: 'string',
			length: {
				minimum: 0,
				maximum: 20
			}
    },
    startTime: {
			time: obj.startTime ? true : false
    },
    endTime: {
      time: obj.endTime ? true : false
    },
    date: {
      presence: true,
      datetime: {
        dateOnly: true,
        earliest: +moment.utc().subtract(100, 'y'),	//最早时间不能超过多少, 服务器用 utc，当前时间减少100年，转换为时间戳
				latest: +moment.utc().subtract(-5, 'y')//最晚时间不能小于多少
      }
    }
  }

  try{
    await validate.async(obj, rule)

    const where = {
      account: obj.account,
      date: obj.date
    }

    // 根据条件查询数据
    const res = await WorkingHours.findOne({ where })

    if(!obj.startTime && obj.endTime && res.startTime){
      obj.startTime = res.startTime
    }

    if(obj.startTime && !obj.endTime && res.endTime){
      obj.endTime = res.endTime
    }

    if(obj.startTime && obj.endTime){
      obj.hours = calculateHours(obj.startTime, obj.endTime)
    }

    if(res){
      const ins = await WorkingHours.update(obj, { where })
      return ins
    }else{
      const ins = await WorkingHours.create(obj)
      return ins.toJSON()
    }
  }catch(err){
    console.log('err: ', err)
    return Error(JSON.stringify(err))
  }

}

/**
 * @description: 计算工时
 * @param {*} start 开始时间
 * @param {*} end 结束时间
 * @return {*}
 */
function calculateHours(start, end) {
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