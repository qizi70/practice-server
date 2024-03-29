const sequelize = require('./db')
const { Sequelize, DataTypes } = require('sequelize')

const WorkingHours = sequelize.define('WorkingHours', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 这里将 'id' 标记为主键  
    autoIncrement: true // id 自增
  },
  account: { // 账号
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  hours: { // 实际工时
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '0',
    comment: '实际工时'
  },
  status: { // 在岗状态
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '1',
    comment: `
    1. 正常出勤	8
    2. 上午请假	5.5
    3. 下午请假	2.5
    4. 全天请假	0
    5. 全天加班	0`
  },
  startTime: { // 开始打卡时间
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  endTime: { // 结束打卡时间
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  date: { // 要修改的日期
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  }
}, {
  paranoid: true, // 增加删除时间列
  // 表设置
  indexes: [
    // 创建一个在account上的非唯一索引
    {
      unique: false,
      fields: ['account']
    },
  ]
})

module.exports = WorkingHours