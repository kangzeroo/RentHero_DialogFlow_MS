const Promise = require('bluebird')
const { promisify } = Promise
const pool = require('../db_connect')
const uuid = require('uuid')

// to run a query we just pass it to the pool
// after we're done nothing has to be taken care of
// we don't have to return any client to the pool or close a connection

const query = promisify(pool.query)

// stringify_rows: Convert each row into a string
const stringify_rows = res => res.rows.map(row => JSON.stringify(row))

const json_rows = res => res.map(row => JSON.parse(row))
//log_through: log each row
const log_through = data => {
  // console.log(data)
  return data
}

exports.saveSessionAndAdIds = (session_id, ad_id, identity_id, bot_id) => {
  const p = new Promise((res, rej) => {
    const values = [session_id, ad_id, identity_id, bot_id]

    const insert_session = `INSERT INTO sessions (session_id, ad_id, identity_id, bot_id)
                                 VALUES ($1, $2, $3, $4)
                                 ON CONFLICT (session_id, ad_id, identity_id)
                                 DO UPDATE
                                    SET bot_id = $4,
                                        updated_at = CURRENT_TIMESTAMP
                                 RETURNING session_id
                            `

    query(insert_session, values)
    .then((data) => {
      res(data.rows[0].session_id)
    })
    .catch((err) => {
      console.log(err)
      rej(err)
    })
  })
  return p
}

exports.getAdIdFromSession = (session_id) => {
  const p = new Promise((res, rej) => {
    const values = [session_id]

    const get_ad = `SELECT * FROM sessions WHERE session_id = $1`

    const return_rows = (rows) => {
      console.log(rows)
      res(rows[0])
    }
    return query(get_ad, values)
      .then((data) => {
        return stringify_rows(data)
      })
      .then((data) => {
        return json_rows(data)
      })
      .then((data) => {
        return return_rows(data)
      })
      .catch((err) => {
        console.log(err)
        rej('Failed to get any chat channels')
      })
  })
  return p
}

exports.getAdSnapshot = (ad_id) => {
  const p = new Promise((res, rej) => {
    const values = [ad_id]

    // lat, lng, address, unit #, # of rooms, # of baths, price of rooms/suite,

    const get_ad = `SELECT c.gps_x, c.gps_y,
                           b.ad_title, b.ad_unit,
                           d.num_available_rooms, d.available_rooms_price,
                           e.total_rooms, e.total_rooms_price,
                           f.num_bathrooms
                      FROM advertisements b
                      INNER JOIN address c
                      ON b.address_id = c.address_id
                      LEFT OUTER JOIN (
                        SELECT ad_id, COUNT(*) AS num_available_rooms,
                               SUM(price) AS available_rooms_price
                          FROM rooms
                          WHERE type = 'bedroom'
                            AND available = true
                          GROUP BY ad_id
                      ) d
                      ON b.ad_id = d.ad_id
                      LEFT OUTER JOIN (
                        SELECT ad_id, COUNT(*) AS total_rooms,
                               SUM(price) AS total_rooms_price
                          FROM rooms
                          WHERE type = 'bedroom'
                          GROUP BY ad_id
                      ) e
                      ON b.ad_id = e.ad_id
                      LEFT OUTER JOIN (
                        SELECT ad_id, COUNT(*) AS num_bathrooms
                          FROM rooms
                          WHERE type = 'bathroom'
                          GROUP BY ad_id
                      ) f
                      ON b.ad_id = f.ad_id
                      WHERE b.ad_id = $1
                  `

    const return_rows = (rows) => {
      console.log(rows)
      res(rows[0])
    }
    return query(get_ad, values)
      .then((data) => {
        return stringify_rows(data)
      })
      .then((data) => {
        return json_rows(data)
      })
      .then((data) => {
        return return_rows(data)
      })
      .catch((err) => {
        console.log(err)
        rej('Failed to get any chat channels')
      })
  })
  return p
}
