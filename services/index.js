const validate = require('validate.js')
const moment = require('moment')

//全局扩展
validate.extend(validate.validators.datetime, {
	/**
	 * 该函数会自动用于日期格式转换
	 * 他会在验证时自动触发，他需要将任何数据转换为时间戳返回
	 * 如果无法转换，返回NaN
	 * @param {Object} value	传入要转换的值
	 * @param {Object} options	针对某个属性的验证配置
	 */
	parse(value, options){
		let formats = ['YYYY-MM-DD HH:mm:ss', 'YYYY-M-D H:m:s', 'x']
		if(options.dateOnly){
			formats = ['YYYY-MM-DD', 'YYYY-M-D', 'x']
		}
		//转换成时间戳
		return +moment.utc(value, formats, true)
	},
	/**
	 * 用于显示错误消息时，使用的显示字符串
	 * @param {Object} value
	 * @param {Object} options
	 */
	format(value, options){
		let format = 'YYYY-MM-DD'
		//如果不是日期格式，就拼接上时间
		if(!options.dateOnly){
			format += ' HH:mm:ss'
		}
		return moment.utc(value).format(format);
	}
})

