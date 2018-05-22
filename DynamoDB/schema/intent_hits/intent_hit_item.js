const RENTHERO_INTENTS_HIT = require('../dynamodb_tablenames').RENTHERO_INTENTS_HIT


// ====================================

exports.reference_items = [
  {
    'TableName': RENTHERO_INTENTS_HIT,
    'Item': {
      'ITEM_ID': 'uuid.v4()',
      'SESSION_ID': 'asdfasf-dfgdsgsf-gsfadsf',
      'DATETIME': '2018-04-22T01:02:46.961Z',
      'AD_ID': '3455-dfg-54te-gsdfs',
      'INTENT_ID': 'aosdfas-safsg-dsfgoij',
      'TENANT_ID': 'asjdf43f-fsgsdfjisf-asdfs'
    }
  }
]
