const RENTHERO_USER_REACTIONS = require('../dynamodb_tablenames').RENTHERO_USER_REACTIONS


// ====================================

exports.reference_items = [
  {
    'TableName': RENTHERO_USER_REACTIONS,
    'Item': {
      'MESSAGE_ID': 'uuid.v4()',
      'SESSION_ID': 'STRING_FROM_TWILIO',
      'DATETIME': '2018-03-05-asfsf-dkdfjl',
      'AD_ID': 'asdfsadf--dfsgdfgdgsfdg',
      'IDENTITY_ID': 'us-east-1:ofasdjlfasodf',
      'REACTION_ID': 'asdfasg-dsfg-dsgdgsd-gdfg',
      'REACTION': 'thumbsup'
    }
  },
  {
    'TableName': RENTHERO_USER_REACTIONS,
    'Item': {
      'MESSAGE_ID': 'uuid.v4()',
      'SESSION_ID': 'STRING_FROM_TWILIO',
      'DATETIME': '2018-03-05-asfsf-dkdfjl',
      'AD_ID': 'asdfsadf--dfsgdfgdgsfdg',
      'IDENTITY_ID': 'us-east-1:ofasdjlfasodf',
      'REACTION_ID': 'asdfasg-dsfg-dsgdgsd-gdfg',
      'REACTION': 'thumbsdown'
    }
  }
]
