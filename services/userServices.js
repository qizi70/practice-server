const User = require('../models/User.js')
const validate = require('validate.js')
const { pick } = require('../utils/global')

exports.addUser = async (obj) => {
  obj = pick(obj, 'name', 'age', 'address')

  const rule = {
    name: {
      presence: true,
			type: 'string',
			length: {
				minimum: 0,
				maximum: 10
			}
    },
    age: {
			type: 'string',
			length: {
				minimum: 0,
				maximum: 3
			}
    },
    address: {
			type: 'string',
			length: {
				minimum: 0,
				maximum: 200
			}
    }
  }

  try{
    await validate.async(obj, rule)
    const ins = await User.create(obj)
    return ins.toJSON()
  }catch(err){
    return Error(JSON.stringify(err))
  }

}

exports.getUserInfo = async (id) => {
  const res = await User.findByPk(id)
  return res && res.toJSON() || {}
}
