// const saveIntentLog = require('./api/stackdriver/stackdriver_api_dialogflow').saveIntentLog
// const getIntentLog = require('./api/stackdriver/stackdriver_api_dialogflow').getIntentLog
//
// const params = {
//   autoPaginate: true,
//   filter: `
//     resource.type = "api"
//     logName = "projects/dev-landlordai-8221e/logs/intents-hit"
//     timestamp >= "2018-04-17T13:51:33+00:00" AND timestamp <= "2018-06-17T13:51:33+00:00"
//     labels.intent_id = ("INIT---LookAtMeMom" OR "INIT---LookAtMeDad")
//     jsonPayload.ad_id = "ad_id"
//   `
// }
// getIntentLog('intents-hit', params)
//
// // saveIntentLog('identity_id', 'intent_id', 'session_id', 'bot_id', 'ad_id')

const getAdSnapshot = require('./routes/Postgres/Queries/AdQueries').getAdSnapshot

getAdSnapshot('d5cd68d9-fcc4-4abf-84e7-b0c52a8d9dbb')
