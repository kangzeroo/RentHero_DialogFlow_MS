// Imports the Google Cloud client library
const moment = require('moment')
const Logging = require('@google-cloud/logging')
const path = require('path')
const uuid = require('uuid')
const pathToGoogleConfig = path.join(__dirname, '..', '..', 'credentials', process.env.NODE_ENV, 'cloud_logging_config_dialogflow.json')
const PROJECT_ID = require(`../../credentials/${process.env.NODE_ENV}/cloud_logging_profile_dialogflow`).PROJECT_ID
// Creates a client
const logging = new Logging({
  projectId: PROJECT_ID,
  keyFilename: pathToGoogleConfig
})


exports.saveIntentLog = function(identity_id, session_id, intent_id, intent_name, bot_id, ad_id, payload) {
  // The name of the log to write to
  const logName = `intents-hit`
  // Selects the log to write to
  const log = logging.log(logName)
  const created_at = moment().toISOString()

  // The data to write to the log
  const json = {
    identity_id: identity_id,
    intent_id: intent_id,
    intent_name: intent_name,
    session_id: session_id,
    bot_id: bot_id,
    ad_id: ad_id,
    timestamp: created_at,
    payload: payload || { message: 'no payload' }
  }
  // The metadata associated with the entry
  const metadata = {
    resource: {
      type: 'api'
    },
    severity: 0,
    labels: {
      intent_id: intent_id,
      ad_id: ad_id
    }
  }
  // Prepares a log entry
  const entry = log.entry(metadata, json)

  // Writes the log entry
  log.write(entry)
    .then(() => {
      console.log(`Logged a hit: ${intent_id}`)
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getIntentLog = function(logName, params) {
  /*
    const logName = 'intents-hit'
    const params = {
      autoPaginate: true,
      filter: `
        resource.type = "api"
        logName = "projects/dev-landlordai-8221e/logs/intents-hit"
        timestamp >= "2018-04-17T13:51:33+00:00" AND timestamp <= "2018-06-17T13:51:33+00:00"
        labels.intent_id = ("INIT---LookAtMeMom" OR "INIT---LookAtMeDad")
        jsonPayload.ad_id = "ad_id"
      `
    }
  */
  const log = logging.log(logName)
  log.getEntries(params)
  .then(results => {
    const entries = results[0]

    console.log('Logs:')
    entries.forEach(entry => {
      console.log(entry.data)
    })
  })
  .catch(err => {
    console.error('ERROR:', err)
  })
}

exports.logSessionMilestone = (session_id, message, payload, stacktrace) => {
  // The name of the log to write to
  const logName = `session-progress`
  // Selects the log to write to
  const log = logging.log(logName)
  const created_at = moment().toISOString()

  // The data to write to the log
  const json = {
    session_id: session_id,
    message: message,
    payload: payload,
    stacktrace: stacktrace,
    timestamp: created_at
  }
  // The metadata associated with the entry
  const metadata = {
    resource: {
      type: 'api'
    },
    severity: 0,
    labels: {
      session_id: session_id,
      event_type: 'milestone'
    }
  }
  // Prepares a log entry
  return log.entry(metadata, json)
}

exports.logSessionError = (session_id, message, payload, stacktrace, severity) => {
  // The name of the log to write to
  const logName = `session-progress`
  // Selects the log to write to
  const log = logging.log(logName)
  const created_at = moment().toISOString()

  // The data to write to the log
  const json = {
    session_id: session_id,
    message: message,
    payload: payload,
    stacktrace: stacktrace,
    timestamp: created_at
  }
  // The metadata associated with the entry
  const metadata = {
    resource: {
      type: 'api'
    },
    severity: severity,
    labels: {
      session_id: session_id,
      event_type: 'error'
    }
  }
  // Prepares a log entry
  return log.entry(metadata, json)
}

exports.saveSessionProgress = (entries) => {
  // The name of the log to write to
  const logName = `session-progress`
  // Selects the log to write to
  const log = logging.log(logName)
  // Writes the log entry
  log.write(entries)
    .then(() => {
      console.log(`Logged some session progress!`)
    })
    .catch(err => {
      console.log(err)
    })
}
