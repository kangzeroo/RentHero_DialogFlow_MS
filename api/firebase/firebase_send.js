const axios = require('axios')
const authHeaders = require('./firebase_auth_headers').authHeaders

exports.sendNotification = function(notification, clientTokenId){
  const msg = {
    "notification": notification,
    "to" : clientTokenId
  }

  const p = new Promise((res, rej) => {
    // axios.post(`${SEARCH_MICROSERVICE}/search_buildings`, { lat, long })
    axios.post('https://fcm.googleapis.com/fcm/send', msg, authHeaders()) // { httpsAgent: agent })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}
