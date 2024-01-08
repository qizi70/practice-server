const { Sequelize } = require('sequelize')
const { sqlLogger } = require('../logger')

const sequelize = new Sequelize('global', 'root', '123123', {
	host: 'localhost',
	dialect: 'mysql',
	logging: msg => sqlLogger.debug(msg), // 日志记录
  define: {
    freezeTableName: true, // 强制表名称等于模型名称
    timestamps: true
  },
})

module.exports = sequelize
