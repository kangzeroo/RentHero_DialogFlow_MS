const RENTHERO_QALTA_SETS = require('../dynamodb_tablenames').RENTHERO_QALTA_SETS


// ====================================

exports.reference_items = [
  {
    'TableName': RENTHERO_QALTA_SETS,
    'Item': {
      'AD_ID': 'uuid.v4()',
      'ITEM_ID': '3498sdoafs-asdfu8sdf-3489dsfdsf',
      'TYPE': 'ORIGINAL_QUESTION',
      'TAGS': '45364647467-435647657657-5463645767,98978564678-45243546758-2456465787',
      'PHRASING': 'Can I decorate the walls?',
      'DATETIME': '2018-04-21T20:48:13-04:00',
      'LANDLORD_ID': '389e8943-styr6457-dgrddg'
    }
  },
  {
    'TableName': RENTHERO_QALTA_SETS,
    'Item': {
      'AD_ID': 'uuid.v4()',
      'ITEM_ID': '6849doafs-78dfu8sdf-h89dsfdsdf',
      'TYPE': 'QUESTION',
      'TAGS': '45364647467-435647657657-5463645767,98978564678-45243546758-2456465787',
      'PHRASING': 'Am I allowed to paint the walls or anything?',
      'DATETIME': '2018-04-21T20:48:13-04:00',
      'LANDLORD_ID': '389e8943-styr6457-dgrddg'
    }
  },
  {
    'TableName': RENTHERO_QALTA_SETS,
    'Item': {
      'AD_ID': 'uuid.v4()',
      'ITEM_ID': '4786sdoafs-asdfu8sdf-3489dsfdsf',
      'TYPE': 'ANSWER',
      'TAGS': '45364647467-435647657657-5463645767,98978564678-45243546758-2456465787',
      'PHRASING': 'Yes you can decorate the walls and rooms.',
      'DATETIME': '2018-04-21T20:48:13-04:00',
      'LANDLORD_ID': '389e8943-styr6457-dgrddg'
    }
  },
  {
    'TableName': RENTHERO_QALTA_SETS,
    'Item': {
      'AD_ID': 'uuid.v4()',
      'ITEM_ID': '546467567-3467568979-43566456456',
      'TYPE': 'ESTIMATE',
      'QUESTION_ID': '6849doafs-78dfu8sdf-h89dsfdsdf',
      'ANSWER_ID': '4786sdoafs-asdfu8sdf-3489dsfdsf',
      'TAGS': '45364647467-435647657657-5463645767,98978564678-45243546758-2456465787',
      'DATETIME': '2018-04-21T20:48:13-04:00',
      'LANDLORD_ID': '389e8943-styr6457-dgrddg'
    }
  }
]
