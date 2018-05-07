const axios = require('axios')
const uuid = require('uuid')
const saveSessionAndAdIds = require('./Postgres/Queries/AdQueries').saveSessionAndAdIds
const saveDialog = require('../DynamoDB/dialogflow_chat').saveDialog
const mapIntentToDomain = require('../api/knowledge_domains/domain_mapper').mapIntentToDomain
const queryDynamoChatForAds = require('../DynamoDB/comms_chatbot_query').queryDynamoChatForAds
const CLIENT_ACCESS_KEY = require('../credentials/'+process.env.NODE_ENV+'/dialogflow_config').CLIENT_ACCESS_KEY
const DEVELOPER_ACCESS_KEY = require('../credentials/'+process.env.NODE_ENV+'/dialogflow_config').DEVELOPER_ACCESS_KEY
const FCM_MS = require('../credentials/'+process.env.NODE_ENV+'/API_URLs').FCM_MS

exports.init_dialogflow = function(req, res, next) {
  console.log(req.body)
  console.log('--------- init_dialogflow')
  const ad_id = req.body.ad_id
  const session_id = uuid.v4()
  const params = {
    'event': {
      'name': 'renthero-landlord-ai-init',
      'data': {
        'ad_id': ad_id
      }
    },
    'timezone':'America/New_York',
    'lang':'en',
    'sessionId': session_id
  }
  const headers = {
    headers: {
      // be sure to change this from dev to prod agent tokens!
      Authorization: `Bearer ${CLIENT_ACCESS_KEY}`
    }
  }
  saveSessionAndAdIds(session_id, ad_id)
    .then((data) => {
      return axios.post(`https://api.dialogflow.com/api/query?v=20150910`, params, headers)
    })
    .then((data) => {
      // once we have the response, only then do we dispatch an action to Redux
      console.log(data.data)
      console.log(session_id)
      res.json({
        message: data.data.result.fulfillment.speech,
        session_id: session_id
      })
    })
    .catch((err) => {
      // console.log(err)
      res.json({
        message: 'Uh oh! Something wrong happened',
        session_id: session_id
      })
    })
}

exports.send_message = function(req, res, next) {
  console.log('------ SEND MESSAGE -------')
  console.log(req.body)
  const headers = {
    headers: {
      Authorization: `Bearer ${DEVELOPER_ACCESS_KEY}`
    }
  }
  saveDialog(req.body.message, req.body.session_id, req.body.session_id, req.body.ad_id)
    .then((data) => {
      const sentences = req.body.message.split(/[.!?\n\r]/gi)
      console.log(sentences)
      const x = sentences.map((sent) => {
        let params = {
          "contexts": [],
          "lang": "en",
          "query": sent,
          "sessionId": req.body.session_id,
          "timezone": "America/New_York"
        }
        let reply = ''
        let sender = ''
        return axios.post(`https://api.dialogflow.com/api/query?v=20150910`, params, headers)
                      .then((data) => {
                        console.log('------------ response from query -----------')
                        console.log(data.data)
                        reply = data.data.result.fulfillment.speech
                        sender = data.data.result.metadata.intentName ? data.data.result.metadata.intentName : data.data.result.action
                        console.log('PUSH NOTIFICATIONS!!!')
                        let pushNotification = {
                          "session_id": req.body.session_id,
                          "notification": {
                            "body" : reply,
                            "title" : "New Message from RentHero AI"
                          }
                        }
                        return axios.post(`${FCM_MS}/send_notification`, pushNotification, headers)
                      })
                      .then((data) => {
                        // once we have the response, only then do we dispatch an action to Redux
                        console.log('SAVING DIALOGFLOW!!!')
                        return saveDialog(reply, req.body.session_id, sender, req.body.ad_id)
                      })
                      .then((data) => {
                        return Promise.resolve(reply)
                      })
                      .catch((err) => {
                        return Promise.resolve('')
                      })
      })
      return Promise.all(x)
    })
    .then((data) => {
      let sumReply = ''
      data.forEach((reply) => {
        sumReply = `${sumReply} ${reply}`
      })
      res.json({
        message: sumReply
      })
    })
    .catch((err) => {
      // console.log(err)
      console.log(err.response.data)
      res.status(500).send(err)
    })
}

exports.dialogflow_fulfillment_renthero = function(req, res, next) {
  console.log('------ DIALOG FLOW FULFILLMENT -------')
  console.log(req.body)
  console.log(req.body.queryResult.fulfillmentMessages[0].text.text)
  console.log('-------')
  const sessionID = req.body.session.slice(req.body.session.indexOf('/sessions/') + '/sessions/'.length)
  let ad_id = ''
  let reply = ''
  const headers = {
    headers: {
      Authorization: `Bearer ${DEVELOPER_ACCESS_KEY}`
    }
  }
  if (req.body.queryResult.intent) {
    const intentID = req.body.queryResult.intent.name
    const intentName = req.body.queryResult.intent.displayName
    console.log('=====> DIALOG FLOW FULFILLMENT')
    mapIntentToDomain(intentName)
      .then((endpoint) => {
        console.log(endpoint)
        return axios.post(endpoint, req.body, headers)
      })
      .then((answer) => {
        res.json({
          "fulfillmentText": answer.data.fulfillmentText,
          "fulfillmentMessages": answer.data.fulfillmentMessages,
          "outputContexts": answer.data.outputContexts
        })
      })
      .catch((err) => {
        res.json({
          "fulfillmentText": `I think I understand what you are saying, but to be honest I'm pretty confused. Maybe try a different question?`,
          "fulfillmentMessages": [],
          "outputContexts": []
        })
      })
  } else {
    res.json({
      "fulfillmentText": req.body.queryResult.fulfillmentText,
      "fulfillmentMessages": req.body.queryResult.fulfillmentMessages,
      "outputContexts": []
    })
  }
}

exports.get_chatbot_logs_for_ad = function(req, res, next) {
  const info = req.body
  console.log(req.body)
  queryDynamoChatForAds(info.ad_id)
  .then((data) => {
    res.json(data)
  })
  .catch((err) => {
    console.log(err)
    res.status(500).send('Failed to get chatbot logs')
  })
}

/*

// INIT A DIALOGFLOW CHAT

curl \
-H "Authorization: Bearer 4d95f830bb794321a5610ca6fec9f765" \
"https://api.dialogflow.com/v1/query?v=20150910&e=renthero-init"

curl \
-X POST -H "Content-Type: application/json; charset=utf-8" \
-H "Authorization: Bearer 4d95f830bb794321a5610ca6fec9f765" \
"https://api.dialogflow.com/api/query?v=20150910" \
--data "{
'event':{'name': 'renthero-init', 'data': {'ad_id': 'b1b6604e-4142-4903-a391-3850a9a9a465'}},
'timezone':'America/New_York',
'lang':'en',
'sessionId':'3563456-467456dfsg-sdfgsdfg'}"

projects/additionalsuiteinfo/agent/sessions/1321321
*/
