// @ts-ignore
const express = require('express')
const app = express()
// @ts-ignore
const path = require('path')
const cors = require('cors')

//处理跨域
// app.use(require('./middleware/corsMiddleware.js'))
app.use(cors())

//加入之后 会在 req 对象中注入 cookies 属性，用于获取所有请求传递过来的 cookie
//加入之后 会在 res 对象中注入 cookie 方法，用于设置此 cookie
const cookieParser = require('cookie-parser')
app.use(cookieParser())


//用于解析 post 请求
app.use(express.urlencoded({extended: true}))

//处理json
app.use(express.json())


app.use('/api/user', require('./api/user.js'))
app.use('/api/working', require('./api/workingHours.js'))


app.use(require('./middleware/errorMiddleware.js'))

const port = 5008
app.listen(port, () => {
  console.log(`server listen on ${port}`)
})
