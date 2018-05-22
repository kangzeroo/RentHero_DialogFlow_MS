const RENTHERO_COMM_LOGS = require('../dynamodb_tablenames').RENTHERO_COMM_LOGS


// ====================================

exports.reference_items = [
  {
    'TableName': RENTHERO_COMM_LOGS,
    'Item': {
      'MESSAGE_ID': 'uuid.v4()',
      'SESSION_ID': 'STRING_FROM_TWILIO',
      'DATETIME': 43563456456,
      'TIMEZONE': 'UTC-05',
      'MEDIUM': 'SMS',
      'RECEIVER_ID': 'RECEIVER_ID',
      'SENDER_ID': 'SENDER_ID',
      'SENDER_TYPE': 'TENANT',
      'MESSAGE': 'Hello is this still available?'
    }
  },
  {
    'TableName': RENTHERO_COMM_LOGS,
    'Item': {
      'MESSAGE_ID': 'uuid.v4()',
      'SESSION_ID': 'STRING_FROM_TWILIO',
      'DATETIME': 43563456456,
      'TIMEZONE': 'UTC-05',
      'MEDIUM': 'EMAIL',
      'RECEIVER_ID': 'RECEIVER_ID',
      'SENDER_ID': 'SENDER_ID',
      'SENDER_TYPE': 'TENANT',
      'MESSAGE': 'Following up on the same suite'
    }
  },
  {
    'TableName': RENTHERO_COMM_LOGS,
    'Item': {
      'MESSAGE_ID': 'uuid.v4()',
      'SESSION_ID': 'STRING_FROM_TWILIO',
      'DATETIME': 43563456456,
      'TIMEZONE': 'UTC-05',
      'MEDIUM': 'FBMESSENGER',
      'RECEIVER_ID': 'RECEIVER_ID',
      'SENDER_ID': 'SENDER_ID',
      'SENDER_TYPE': 'TENANT',
      'MESSAGE': 'Still available?'
    }
  }
]
