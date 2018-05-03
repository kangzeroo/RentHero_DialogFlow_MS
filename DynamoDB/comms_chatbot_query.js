const moment = require('moment')
const query_dynamodb = require('./general_queryable').query_dynamodb
const RENTHERO_COMM_LOGS = require('./schema/dynamodb_tablenames').RENTHERO_COMM_LOGS

exports.queryDynamoChatForAds = function(ad_id) {
  const p = new Promise((res, rej) => {
    const params = {
      "TableName": RENTHERO_COMM_LOGS,
      "KeyConditionExpression": "#AD_ID = :ad_id",
      "ExpressionAttributeNames": {
        "#AD_ID": "AD_ID",
      },
      "ExpressionAttributeValues": {
        ":ad_id": ad_id,
      }
    }
    query_dynamodb(params)
      .then((answers) => {
        console.log(answers)
        const sortedByLatest = answers.map((a) => {
          a.unix = moment(a.DATETIME).unix()
          return a
        }).sort((a, b) => {
          return b.unix - a.unix
        })
        console.log(sortedByLatest)
        res(sortedByLatest)
      })
      .catch((err) => {
        console.log(err)
        rej(err)
      })
  })
  return p
}
