const moment = require('moment')
const query_dynamodb = require('./general_queryable').query_dynamodb
const RENTHERO_QALTA_SETS = require('./schema/dynamodb_tablenames').RENTHERO_QALTA_SETS

exports.queryDynamoDBAnswersForTags = function(tags, ad_id) {
  const p = new Promise((res, rej) => {
    const params = {
      "TableName": RENTHERO_QALTA_SETS,
      "KeyConditionExpression": "#AD_ID = :ad_id",
      "FilterExpression": "contains(#TAGS, :tags) and #TYPE = :type",
      "ExpressionAttributeNames": {
        "#AD_ID": "AD_ID",
        "#TAGS": "TAGS",
        '#TYPE': 'TYPE'
      },
      "ExpressionAttributeValues": {
        ":ad_id": ad_id,
        ":tags": tags[0],
        ":type": 'ANSWER'
      }
    }
    console.log(typeof tags, tags)
    console.log(typeof tags[0], tags[0])
    query_dynamodb(params)
      .then((answers) => {
        console.log(answers)
        const sortedByLatest = answers.map((a) => {
          a.unix = moment(a.DATETIME).unix()
          // console.log(a)
          return a
        }).sort((a, b) => {
          return b.unix - a.unix
        })
        res(sortedByLatest[0].PHRASING)
      }).catch((err) => {
        console.log(err)
        rej(err)
      })
  })
  return p
}
