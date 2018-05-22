const uuid = require('uuid')
const moment = require('moment')
const insertItem = require('./general_insertions').insertItem
const RENTHERO_COMM_LOGS = require('./schema/dynamodb_tablenames').RENTHERO_COMM_LOGS
const RENTHERO_INTENTS_HIT = require('./schema/dynamodb_tablenames').RENTHERO_INTENTS_HIT


// saveDialog(ad_id, session_id, staff_id, contact_id, sender_id, msg, payload)
// exports.saveDialog = function(msg, session_id, staff_id, contact_id, ad_id, payload) {
exports.saveDialog = function(message_id, ad_id, session_id, receiver_id, sender_id, sender_type, msg, payload) {
  const p = new Promise((res, rej) => {
    const timestamp = moment().toISOString()
    const item = {
      'TableName': RENTHERO_COMM_LOGS,
      'Item': {
        'MESSAGE_ID': message_id,
        'AD_ID': ad_id,
        'SESSION_ID': session_id,
        'DATETIME': timestamp,
        'MEDIUM': 'RENTHERO.AI.LANDLORD',
        'RECEIVER_ID': receiver_id,
        'SENDER_ID': sender_id,
        'SENDER_TYPE': sender_type,
        'MESSAGE': msg || 'empty',
        'PAYLOAD': payload ? JSON.stringify(payload) : JSON.stringify({ status: 'no payload' })
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

exports.saveIntentHit = function(identity_id, session_id, intent_id, intent_name, ad_id, prev_message_id, prev_message_text, next_message_id) {
  const p = new Promise((res, rej) => {
    const timestamp = moment().toISOString()
    const item = {
      'TableName': RENTHERO_INTENTS_HIT,
      'Item': {
        'ITEM_ID': uuid.v4(),
        'SESSION_ID': session_id,
        'DATETIME': moment().toISOString(),
        'AD_ID': ad_id,
        'TENANT_ID': identity_id,
        'INTENT_ID': intent_id,
        'INTENT_NAME': intent_name,
        'PREV_MESSAGE_ID': prev_message_id,
        'PREV_MESSAGE_TEXT': prev_message_text,
        'NEXT_MESSAGE_ID': next_message_id
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
