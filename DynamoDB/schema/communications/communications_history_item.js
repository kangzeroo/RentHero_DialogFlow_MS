const RENTHERO_COMM_LOGS = require('../dynamodb_tablenames').RENTHERO_COMM_LOGS


// ====================================

exports.reference_items = [
  {
    'TableName': RENTHERO_COMM_LOGS,
    'Item': {
      'MESSAGE_ID': 'uuid.v4()',
      'CHANNEL_ID': 'STRING_FROM_TWILIO',
      'DATETIME': 43563456456,
      'TIMEZONE': 'UTC-05',
      'STAFF_ID': 'CHATBOT_ID' || 'STAFF_ID',
      'MEDIUM': 'SMS',
      'CONTACT_ID': 'TENANT_ID',
      'CHANNEL_ID_DATETIME': 'STRING_FROM_TWILIO+43563456456',
      'MESSAGE': 'Hello is this still available?'
    }
  },
  {
    'TableName': RENTHERO_COMM_LOGS,
    'Item': {
      'MESSAGE_ID': 'uuid.v4()',
      'CHANNEL_ID': 'STRING_FROM_TWILIO',
      'DATETIME': 43563456456,
      'TIMEZONE': 'UTC-05',
      'STAFF_ID': 'CHATBOT_ID' || 'STAFF_ID',
      'MEDIUM': 'EMAIL',
      'CONTACT_ID': 'TENANT_ID',
      'CHANNEL_ID_DATETIME': 'STRING_FROM_TWILIO+43563456456',
      'MESSAGE': 'Following up on the same suite'
    }
  },
  {
    'TableName': RENTHERO_COMM_LOGS,
    'Item': {
      'MESSAGE_ID': 'uuid.v4()',
      'CHANNEL_ID': 'STRING_FROM_TWILIO',
      'DATETIME': 43563456456,
      'TIMEZONE': 'UTC-05',
      'STAFF_ID': 'CHATBOT_ID' || 'STAFF_ID',
      'MEDIUM': 'FBMESSENGER',
      'CONTACT_ID': 'TENANT_ID',
      'CHANNEL_ID_DATETIME': 'STRING_FROM_TWILIO+43563456456',
      'MESSAGE': 'Still available?'
    }
  },
  {
    'TableName': RENTHERO_COMM_LOGS,
    'Item': {
      'MESSAGE_ID': 'uuid.v4()',
      'CHANNEL_ID': 'session_id from DialogFlow',
      'DATETIME': 43563456456,
      'TIMEZONE': 'UTC-05',
      'STAFF_ID': 'CHATBOT_ID',
      'MEDIUM': 'RENTHERO.AI.LANDLORD',
      'CONTACT_ID': 'TENANT_ID',
      'CHANNEL_ID_DATETIME': 'STRING_FROM_TWILIO+43563456456',
      'MESSAGE': 'Still available?'
    }
  }
]
