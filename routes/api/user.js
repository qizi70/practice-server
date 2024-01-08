const express = require('express')
const router = express.Router() //创建路由
const userServ = require('../../services/userServices')
const { asyncHandler } = require('../getSendResult')
const { filterGeneralProperty } = require('../../utils/global')

router.get('/getUserInfo', asyncHandler(async (req, res) => {
  const result = await userServ.getUserInfo(req.query.id)

  return {
    result: result ? filterGeneralProperty(result) : {}
  }
}))

router.post('/createUser', asyncHandler(async (req, res) => {
  const result = await userServ.addUser(req.body)
  
  return {
    result: result ? filterGeneralProperty(result) : {}
  }
}))

module.exports = router