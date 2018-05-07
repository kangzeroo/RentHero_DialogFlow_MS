const axios = require('axios')
const domain_mappings = require('./knowledge_domain_mappings').domain_mappings

const headers = {
  headers: {

  }
}

exports.mapIntentToDomain = function(intentName) {
  const p = new Promise((res, rej) => {
    let domain
    console.log(intentName)
    domain_mappings.domains.forEach((d) => {
      console.log(d.domain_prefix)
      if (intentName.indexOf(d.domain_prefix) > -1) {
        domain = d
      }
    })
    console.log(domain)
    if (domain && domain.s3_mapping) {
      axios.get(domain.s3_mapping, headers)
        .then((data) => {
          console.log(data.data)
          const relationships = data.data.relationships
          let endpoint = ''
          relationships.forEach((r) => {
            if (intentName === r.dialogFlow_intentName) {
              endpoint = r.endpoint
            }
          })
          if (endpoint) {
            console.log(`====> SUCCESS! Hitting endpoint: ${endpoint}`)
            res(endpoint)
          } else {
            console.log(`====> FAILURE! No matching intent/domain/endpoint mapping found for the Intent: ${intentName}`)
            rej(`No matching intent/domain/endpoint mapping found for the Intent: ${intentName}`)
          }
        })
        .catch((err) => {
          console.log(`====> FAILURE! Could not get s3 mapping`)
          console.log(err)
          rej(err)
        })
    } else {
      console.log(`====> FAILURE! No Domain Found`)
      rej('No Domain Found')
    }
  })
  return p
}
