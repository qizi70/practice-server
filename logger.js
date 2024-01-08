const log4js = require('log4js')
const path = require('path')

log4js.configure({
	//设置出口
	appenders: {
		//出口名称
		sql: {
			//定义一个 sql 日志出口
			type: 'datefile',
			filename: path.resolve(__dirname, 'logs', 'sql', 'logging.log'),	//要写入到哪个文件
			maxLogSize: 1024 * 1024 * 10,	//配置文件的最大字节数，
			keepFileExt: true,	//保留文件后缀
			// daysToKeep: 1,		//保留几个配置文件， 0 为不限制
			layout: {
				//设置格式
				type: 'pattern', //自定义的格式
				//%d 设置日期的格式  %p 设置日志的级别  %c 设置日志的分类  %m 设置日志的内容  %n 换行
				pattern: '[%d{yyyy-MM-dd-hh:mm:ss}] [%p] %c: %m%n'	
			}
		},
		//配置默认出口
		default:{
			type: 'stdout', //控制台输出
		}
	},
	//配置分类
	categories: {
		//分类名称
		sql: {
			appenders: ['sql'], //该分类使用出口 sql 的配置写入日志
			level: 'all', 	//分类的级别
		},
		//配置默认分类
		default: {
			appenders: ['default'],
			level: 'all'
		}
	},
})

//在程序退出之前执行这条语句，如果不是正常退出程序的话，会执行完在退出
process.on('exit', () => {
	log4js.shutdown();
})

//设置日志分类
const sqlLogger = log4js.getLogger('sql')
const defaultLogger = log4js.getLogger();

exports.sqlLogger = sqlLogger;
exports.Logger = defaultLogger;
