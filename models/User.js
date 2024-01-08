const sequelize = require('./db')
const { Sequelize, DataTypes } = require('sequelize')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 这里将 'id' 标记为主键  
    autoIncrement: true // id 自增
  },
  name: DataTypes.STRING,
  age: DataTypes.STRING,
  address: DataTypes.STRING,
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
})

module.exports = User