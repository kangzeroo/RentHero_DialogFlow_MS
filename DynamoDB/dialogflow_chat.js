const uuid = require('uuid')
const moment = require('moment')
const insertItem = require('./general_insertions').insertItem
const RENTHERO_COMM_LOGS = require('./schema/dynamodb_tablenames').RENTHERO_COMM_LOGS


// saveDialog(ad_id, channel_id, staff_id, contact_id, sender_id, msg, payload)
// exports.saveDialog = function(msg, session_id, staff_id, contact_id, ad_id, payload) {
exports.saveDialog = function(ad_id, channel_id, staff_id, contact_id, sender_id, msg, payload) {
  const p = new Promise((res, rej) => {
    const timestamp = moment().toISOString()
    const item = {
      'TableName': RENTHERO_COMM_LOGS,
      'Item': {
        'MESSAGE_ID': uuid.v4(),
        'AD_ID': ad_id,
        'CHANNEL_ID': channel_id,
        'DATETIME': timestamp,
        'STAFF_ID': staff_id,
        'MEDIUM': 'RENTHERO.AI.LANDLORD',
        'CONTACT_ID': contact_id,
        'MESSAGE': msg || 'empty',
        'PAYLOAD': payload ? JSON.stringify(payload) : JSON.stringify({ status: 'no payload' }),
        'SENDER_ID': sender_id,
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
