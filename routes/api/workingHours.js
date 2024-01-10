const express = require('express')
const router = express.Router() //创建路由
const workServ = require('../../services/WorkingHoursServices')
const { asyncHandler } = require('../getSendResult')
const { filterGeneralProperty } = require('../../utils/global')


router.post('/addRecords', asyncHandler(async (req, res) => {
  const result = await workServ.addRecords(req.body)
  
  return {
    result: result,
    successed: true,
    msg: '添加成功'
  }
}))

module.exports = router