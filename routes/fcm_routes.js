const sendNotification = require('../api/firebase/firebase_send').sendNotification
const getFirebaseClientIDFromTenantId = require('./Postgres/Queries/FirebaseClientIdQueries').getFirebaseClientIDFromTenantId
const saveFirebaseClientIDAndTenantRelationship = require('./Postgres/Queries/FirebaseClientIdQueries').saveFirebaseClientIDAndTenantRelationship


// POST /send_notification
exports.send_notification = function(req, res, next){
  const notification = req.body.notification
  const tenant_id = req.body.tenant_id
  getFirebaseClientIDFromTenantId(tenant_id).then((data) => {
    return sendNotification(notification, data[0].firebase_client_id)
  }).then((data) => {
    res.json({
      message: "Successfully sent notification"
    })
  }).catch((err) => {
    // console.log(err)
    res.status(500).send({
      message: 'An error occurred'
    })
  })
}

// POST /save_firebase_client
exports.save_firebase_client = function(req, res, next){
  const firebase_client_id = req.body.firebase_client_id
  const tenant_id = req.body.tenant_id
  saveFirebaseClientIDAndTenantRelationship(tenant_id, firebase_client_id).then((data) => {
    res.json(data)
  }).catch((err) => {
    console.log(err)
    res.status(500).send({
      message: 'An error occurred'
    })
  })
}

//
