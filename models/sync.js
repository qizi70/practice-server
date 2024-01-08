// 同步模型
require('./User')

const sequelize = require('./db')
sequelize.sync({ alter: true })
  .then(() => {
    console.log('所有模型同步完毕');
  })
  .catch(err => {
    console.log('err: ', err)
  })
