const axios = require('axios')
const uuid = require('uuid')
const moment = require('moment')
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
  // console.log(req.header)
  const ad_id = req.body.ad_id
  const identity_id = req.body.identityId
  const bot_id = req.body.botId
  let session_id = req.body.session_id || uuid.v4()
  console.log('received identity_id: ', identity_id)
  console.log('received ad_id: ', ad_id)
  console.log('received session_id: ', session_id)
  const headers = {
    headers: {
      // be sure to change this from dev to prod agent tokens!
      Authorization: `Bearer ${CLIENT_ACCESS_KEY}`
    }
  }
  saveSessionAndAdIds(session_id, ad_id, identity_id, bot_id)
    .then((session) => {
      console.log('session_id: ', session)
      session_id = session
      const params = {
        'event': {
          'name': 'renthero-landlord-ai-init',
          'data': {
            'ad_id': ad_id
          }
        },
        'timezone':'America/New_York',
        'lang':'en',
        'sessionId': session,
      }

      return axios.post(`https://api.dialogflow.com/api/query?v=20150910`, params, headers)
    })
    .then((data) => {
      // once we have the response, only then do we dispatch an action to Redux
      console.log(data.data)
      console.log(session_id)
      res.json({
        message: data.data.result.fulfillment.speech,
        payload: data.data.result.fulfillment.data,
        session_id: session_id
      })
    })
    .catch((err) => {
      console.log(err)
      res.json({
        message: 'Uh oh! Something wrong happened',
        session_id: session_id
      })
    })
}

exports.send_message = function(req, res, next) {
  console.log('------ SEND MESSAGE -------')
  console.log(moment().format('LTS'))

  const info = req.body
  // console.log(req.body)
  const headers = {
    headers: {
      Authorization: `Bearer ${DEVELOPER_ACCESS_KEY}`
    }
  }
  let payload = null
  // saveDialog(ad_id, channel_id, staff_id, contact_id, sender_id, msg, payload)
  // saveDialog(req.body.message, req.body.session_id, req.body.session_id, req.body.ad_id)
  saveDialog(info.ad_id, info.session_id, info.bot_id, info.identity_id, info.identity_id, info.message)
    .then((data) => {
      const sentences = req.body.message.split(/[.!?\n\r]/gi)
      // console.log(sentences)
      const x = sentences.filter(sent => sent).map((sent) => {
        console.log('===SENT: ', sent)
        console.log(moment().format('LTS'))

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
                        // console.log(moment().format('LTS'))

                        // console.log(data.data.result)
                        // console.log('------------ response from query -----------')
                        // console.log(data.data)
                        // console.log(data.data.result.fulfillment.messages)
                        reply = data.data.result.fulfillment.speech
                        sender = data.data.result.metadata.intentName ? data.data.result.metadata.intentName : data.data.result.action
                        payload = data.data.result.fulfillment.data
                        // console.log(payload)
                        if (req.headers.push_notifications === 'granted') {
                          console.log('PUSH NOTIFICATIONS!!!')
                          let pushNotification = {
                            "session_id": req.body.session_id,
                            "notification": {
                              "body" : reply,
                              "title" : "New Message from RentHero AI",
                            },
                            "data": payload,
                          }
                          console.log(pushNotification)
                          return axios.post(`${FCM_MS}/send_notification`, pushNotification, headers)
                        } else {
                          return Promise.resolve()
                        }
                      })
                      .then((data) => {
                        // once we have the response, only then do we dispatch an action to Redux
                        console.log('SAVING DIALOGFLOW!!!')

                        // saveDialog(ad_id, channel_id, staff_id, contact_id, sender_id, msg, payload)
                        // return saveDialog(reply, req.body.session_id, sender, req.body.ad_id, payload)
                        return saveDialog(info.ad_id, info.session_id, sender, info.identity_id, sender, reply, payload)
                      })
                      .then((data) => {
                        return Promise.resolve(reply)
                      })
                      .catch((err) => {
                        console.log(err.response.data)
                        return Promise.resolve('')
                      })
      })
      return Promise.all(x)
    })
    .then((data) => {
      // console.log('===>DATA: ', JSON.stringify(data))
      let sumReply = ''
      if (req.headers.push_notifications !== 'granted') {
        data.forEach((reply) => {
          sumReply = `${sumReply} ${reply}`
        })
      }
      res.json({
        message: sumReply,
        payload: payload
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
  console.log(moment().format('LTS'))
  // console.log(req.body)
  // console.log(req.body.queryResult.fulfillmentMessages[0].text.text)
  // console.log('-------')
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
        console.log(moment().format('LTS'))
        return axios.post(endpoint, req.body, headers)
      })
      .then((answer) => {
        console.log('======> ANSWER FOUND')
        console.log(moment().format('LTS'))

        // console.log(answer.data)
        res.json({
          "fulfillmentText": answer.data.fulfillmentText,
          "fulfillmentMessages": answer.data.fulfillmentMessages,
          "outputContexts": answer.data.outputContexts,
          "payload": answer.data.payload,
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

exports.dialogflow_property_question = function(req, res, next) {
  const ad_id = req.body.ad_id
  const identity_id = req.body.identityId
  const bot_id = req.body.botId
  const session_id = req.body.session_id
  const message = 'I have a question about the property!'

  console.log('received session_id: ', session_id)

  const headers = {
    headers: {
      // be sure to change this from dev to prod agent tokens!
      Authorization: `Bearer ${CLIENT_ACCESS_KEY}`
    }
  }

  const params = {
    'event': {
      'name': 'init-from-property-question',
      'data': {
        'ad_id': ad_id,
      }
    },
    'timezone':'America/New_York',
    'lang':'en',
    'sessionId': session_id,
  }

  let reply = ''
  let sender = ''
  let payload = null

  saveDialog(ad_id, session_id, bot_id, identity_id, identity_id, message)
    .then((data) => {
      return axios.post(`https://api.dialogflow.com/api/query?v=20150910`, params, headers)
    })
    .then((data) => {
      reply = data.data.result.fulfillment.speech
      sender = data.data.result.metadata.intentName ? data.data.result.metadata.intentName : data.data.result.action
      payload = data.data.result.fulfillment.data
      if (req.headers.push_notifications === 'granted') {
        console.log('PUSH NOTIFICATIONS!!!')
        let pushNotification = {
          "session_id": req.body.session_id,
          "notification": {
            "body" : reply,
            "title" : "New Message from RentHero AI",
          },
          "data": payload
        }
        return axios.post(`${FCM_MS}/send_notification`, pushNotification, headers)
      } else {
        return Promise.resolve()
      }
    })
    .then((data) => {
      console.log('SAVING DIALOGFLOW!!!')

      // saveDialog(ad_id, channel_id, staff_id, contact_id, sender_id, msg, payload)
      return saveDialog(ad_id, session_id, sender, identity_id, sender, reply, payload)
    })
    .then((data) => {
      // return Promise.resolve(reply)
      res.json({
        message: 'Successfully sent',
        session_id: session_id,
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to send selection')
      // return Promise.resolve('')
    })
}

exports.dialogflow_init_qualification = function(req, res, next) {
  const ad_id = req.body.ad_id
  const identity_id = req.body.identityId
  const bot_id = req.body.botId
  const session_id = req.body.session_id

  console.log('received session_id: ', session_id)

  const headers = {
    headers: {
      // be sure to change this from dev to prod agent tokens!
      Authorization: `Bearer ${CLIENT_ACCESS_KEY}`
    }
  }

  const params = {
    'event': {
      'name': 'init-qualification-questions',
      'data': {
        'ad_id': ad_id,
      }
    },
    'timezone':'America/New_York',
    'lang':'en',
    'sessionId': session_id,
  }

  let reply = ''
  let sender = ''
  let payload = null

    axios.post(`https://api.dialogflow.com/api/query?v=20150910`, params, headers)
    .then((data) => {
      reply = data.data.result.fulfillment.speech
      sender = data.data.result.metadata.intentName ? data.data.result.metadata.intentName : data.data.result.action
      payload = data.data.result.fulfillment.data
      if (req.headers.push_notifications === 'granted') {
        console.log('PUSH NOTIFICATIONS!!!')
        let pushNotification = {
          "session_id": req.body.session_id,
          "notification": {
            "body" : reply,
            "title" : "New Message from RentHero AI",
          },
          "data": payload
        }
        return axios.post(`${FCM_MS}/send_notification`, pushNotification, headers)
      } else {
        return Promise.resolve()
      }
    })
    .then((data) => {
      console.log('SAVING DIALOGFLOW!!!')

      // saveDialog(ad_id, channel_id, staff_id, contact_id, sender_id, msg, payload)
      return saveDialog(ad_id, session_id, sender, identity_id, sender, reply, payload)
    })
    .then((data) => {
      // console.log('===>DATA: ', JSON.stringify(data))
      let sumReply = ''
      if (req.headers.push_notifications !== 'granted') {
        data.forEach((reply) => {
          sumReply = `${sumReply} ${reply}`
        })
      }
      res.json({
        message: sumReply,
        payload: payload
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to send selection')
      // return Promise.resolve('')
    })
}

exports.dialogflow_copmlete_qualification = function(req, res, next) {
  const ad_id = req.body.ad_id
  const identity_id = req.body.identityId
  const bot_id = req.body.botId
  const session_id = req.body.session_id

  console.log('received session_id: ', session_id)

  const headers = {
    headers: {
      // be sure to change this from dev to prod agent tokens!
      Authorization: `Bearer ${CLIENT_ACCESS_KEY}`
    }
  }

  const params = {
    'event': {
      'name': 'completed-qualification-answers',
      'data': {
        'ad_id': ad_id,
      }
    },
    'timezone':'America/New_York',
    'lang':'en',
    'sessionId': session_id,
  }

  let reply = ''
  let sender = ''
  let payload = null

    axios.post(`https://api.dialogflow.com/api/query?v=20150910`, params, headers)
    .then((data) => {
      reply = data.data.result.fulfillment.speech
      sender = data.data.result.metadata.intentName ? data.data.result.metadata.intentName : data.data.result.action
      payload = data.data.result.fulfillment.data
      if (req.headers.push_notifications === 'granted') {
        console.log('PUSH NOTIFICATIONS!!!')
        let pushNotification = {
          "session_id": req.body.session_id,
          "notification": {
            "body" : reply,
            "title" : "New Message from RentHero AI",
          },
          "data": payload
        }
        return axios.post(`${FCM_MS}/send_notification`, pushNotification, headers)
      } else {
        return Promise.resolve()
      }
    })
    .then((data) => {
      console.log('SAVING DIALOGFLOW!!!')

      // saveDialog(ad_id, channel_id, staff_id, contact_id, sender_id, msg, payload)
      return saveDialog(ad_id, session_id, sender, identity_id, sender, reply, payload)
    })
    .then((data) => {
      // console.log('===>DATA: ', JSON.stringify(data))
      let sumReply = ''
      if (req.headers.push_notifications !== 'granted') {
        data.forEach((reply) => {
          sumReply = `${sumReply} ${reply}`
        })
      }
      res.json({
        message: sumReply,
        payload: payload
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to send selection')
      // return Promise.resolve('')
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
