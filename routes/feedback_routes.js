const axios = require('axios')
const uuid = require('uuid')
const moment = require('moment')
const insertItem = require('../DynamoDB/general_insertions').insertItem
const RENTHERO_USER_REACTIONS = require('../DynamoDB/schema/dynamodb_tablenames').RENTHERO_USER_REACTIONS


exports.save_user_reaction = function(req, res, next) {
  console.log(req.body)

  const timestamp = moment().toISOString()
  const item = {
    'TableName': RENTHERO_USER_REACTIONS,
    'Item': {
      'MESSAGE_ID': req.body.message_id,
      'SESSION_ID': req.body.session_id,
      'DATETIME': moment().toISOString(),
      'AD_ID': req.body.ad_id,
      'IDENTITY_ID': req.body.identity_id,
      'REACTION_ID': uuid.v4(),
      'REACTION': req.body.reaction
    }
  }
  console.log(item)
  insertItem(item)
    .then((data) => {
      // console.log(data)
      res.json({
        message: 'Success'
      })
    })
    .catch((err) => {
      // console.log(err)
      res.status(500).send('An error occurred with this reaction')
    })
}
