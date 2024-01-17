// @ts-ignore
const WorkingHours = require('../models/WorkingHours.js')
const validate = require('validate.js')
const moment = require('moment')
const { Op } = require('sequelize')
const { pick, formatDate, getRandomId, handleError } = require('../utils/global')
const { calculateHours } = require('./utils.js')


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

    if(!obj.startTime && obj.endTime && res?.startTime){
      obj.startTime = res.startTime
    }

    if(obj.startTime && !obj.endTime && res?.endTime){
      obj.endTime = res.endTime
    }

    if(obj.startTime && obj.endTime){
      obj.hours = calculateHours(obj.startTime, obj.endTime)
    }

    if(!obj.status){
      obj.status = '1'
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
    return handleError(err)
  }

}

/**
 * @description: 获取当前周的记录
 * @param {*} obj
 * @return {*}
 */
exports.getWeekRecords = async (obj) => {

  const rule = {
    account: {
      presence: true,
      length: {
        minimum: 1,
        message: '账号不能为空'
      }
    }
  }

  await validate.async(obj, rule)
  
  // 设置moment的地区为中国，每周的第一天默认是周一
  moment.locale('zh-cn')

  const startOfWeek = moment().startOf('week').format('YYYY-MM-DD');
  const endOfWeek = moment().endOf('week').format('YYYY-MM-DD');

  try{
    const res = await WorkingHours.findAll({
      where: {
        account: obj.account,
        date: {
          [Op.gte]: startOfWeek,
          [Op.lte]: endOfWeek,
        }
      }
    })
    const data = res.map(item => item.toJSON())

    // 对于当前日期之前的每一天，检查是否存在数据，如果不存在则添加默认数据
    for (let i = 1; i <= 7; i++) {
      const date = moment().startOf('week').add(i - 1, 'days').format('YYYY-MM-DD');
      
      if (!data.find(item => item.date === date)) {
        data.push({
          account: obj.account,
          date: date,
          hours: 0,
          startTime: '',
          endTime: '',
        });
      }
    }

    data.forEach(item => {
      item.id = getRandomId(),
      item.weekStr = moment(item.date, 'YYYY-MM-DD').format('ddd')
    })
    
    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    return data.slice(0, 7);
  }catch(err){
    console.log('err: ', err)
    return handleError(err)
  }
}