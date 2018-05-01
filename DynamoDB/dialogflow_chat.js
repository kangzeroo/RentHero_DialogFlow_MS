const uuid = require('uuid')
const moment = require('moment')
const insertItem = require('./general_insertions').insertItem
const RENTHERO_COMM_LOGS = require('./schema/dynamodb_tablenames').RENTHERO_COMM_LOGS

exports.saveDialog = function(msg, session_id, sender_id) {
  const p = new Promise((res, rej) => {
    const timestamp = moment().toISOString()
    const item = {
      'TableName': RENTHERO_COMM_LOGS,
      'Item': {
        'MESSAGE_ID': uuid.v4(),
        'CHANNEL_ID': session_id,
        'DATETIME': timestamp,
        'STAFF_ID': sender_id,
        'MEDIUM': 'RENTHERO.AI.LANDLORD',
        'CONTACT_ID': sender_id,
        'CHANNEL_ID_DATETIME': `${session_id}+${timestamp}`,
        'MESSAGE': msg
      }
    }
    console.log(item)
    insertItem(item)
      .then((data) => {
        // console.log(data)
        res(data)
      })
      .catch((err) => {
        // console.log(err)
        rej(err)
      })
  })
  return p
}
