const Promise = require('bluebird')
const { promisify } = Promise
const pool = require('../db_connect')
const uuid = require('uuid')
const moment = require('moment')

// to run a query we just pass it to the pool
// after we're done nothing has to be taken care of
// we don't have to return any client to the pool or close a connection

const query = promisify(pool.query)

// stringify_rows: Convert each row into a string
const stringify_rows = res => res.rows.map(row => JSON.stringify(row))

const json_rows = res => res.map(row => JSON.parse(row))

exports.saveFirebaseClientIDAndTenantRelationship = (session_id, firebase_client_id) => {
  const p = new Promise((res, rej) => {
    const values = [session_id, firebase_client_id]

    const insert_relationship = `INSERT INTO firebase_device_relationship (session_id, firebase_client_id) VALUES ($1, $2) ON CONFLICT (session_id) DO UPDATE SET firebase_client_id = $2, updated_at = CURRENT_TIMESTAMP`

    query(insert_relationship, values)
    .then(() => {
      console.log('INSERTED')
      res()
    })
    .catch((err) => {
      console.log('INSERTION ERROR')
      console.log(err)
      rej()
    })
  })
  return p
}


exports.getFirebaseClientIDFromTenantId = (session_id) => {
  const p = new Promise((res, rej) => {
    const values = [session_id]

    const get_relationship = `SELECT * FROM firebase_device_relationship WHERE session_id = $1`

    const return_rows = (rows) => {
      return rows[0]
    }
    return query(get_relationship, values)
      .then((data) => {
        return stringify_rows(data)
      })
      .then((data) => {
        return json_rows(data)
      })
      .then((data) => {
        res(data)
        return return_rows(data)
      })
      .catch((error) => {
        console.log(error)
        rej()
      })
  })
  return p
}
