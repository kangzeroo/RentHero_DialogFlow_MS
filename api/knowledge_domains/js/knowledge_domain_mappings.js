let url = 'https://renthero.host'

exports.domain_mappings = {
  domains: [
    {
      domain_prefix: ".META",
      endpoint: "https://renthero.host:8302/dialogflow"
    },
    {
      domain_prefix: ".SEARCHING",
      endpoint: "https://renthero.host:8304/dialogflow"
    },
    {
      domain_prefix: ".GENERAL",
      endpoint: "https://renthero.host:8305/dialogflow"
    },
    {
      domain_prefix: ".SPECIFIC_STRUC",
      endpoint: "https://renthero.host:8303/dialogflow_sql_answers"
    },
    {
      domain_prefix: ".SPECIFIC_UNSTRUC",
      endpoint: "https://renthero.host:8303/dialogflow_typeform_answers"
    },
    {
      domain_prefix: ".TOURS",
      endpoint: "https://renthero.host:8304/dialogflow"
    },
    {
      domain_prefix: ".NEEDS_HUMAN",
      endpoint: "https://renthero.host:8307/dialogflow"
    },
    {
      domain_prefix: ".GEO_HELP",
      endpoint: "https://renthero.host:8306/dialogflow"
    }
  ]
}
