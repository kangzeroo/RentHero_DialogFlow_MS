const google = require('googleapis')

exports.getFirebaseAccessToken = function(){
  return new Promise(function(resolve, reject) {
    var key = require('../../credentials/firebase_creds.json')
    // console.log(key)
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      'https://www.googleapis.com/auth/firebase.messaging',
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      resolve(tokens.access_token)
    });
  });
}
