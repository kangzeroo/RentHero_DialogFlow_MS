const axios = require('axios')
const uuid = require('uuid')
const moment = require('moment')


exports.save_user_reaction = function(req, res, next) {
  console.log(req.body)
  res.json({
    message: 'Success'
  })
}
