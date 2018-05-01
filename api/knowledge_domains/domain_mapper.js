const domain_mappings = require('./js/knowledge_domain_mappings').domain_mappings

exports.mapIntentToDomain = function(intentName) {
  let domain
  domain_mappings.domains.forEach((d) => {
    if (intentName.indexOf(d.domain_prefix) > -1) {
      domain = d
    }
  })
  if (domain) {
    return Promise.resolve(domain)
  } else {
    return Promise.reject('No Domain Found')
  }
}
