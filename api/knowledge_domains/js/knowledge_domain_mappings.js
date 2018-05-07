let S3_bucket = 'https://s3.amazonaws.com/renthero-ai-mappings/'

exports.domain_mappings = {
  domains: [
    {
      domain_prefix: ".META",
      endpoint: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/meta_intents.json`
    },
    {
      domain_prefix: ".SEARCHING",
      endpoint: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/searching_intents.json`
    },
    {
      domain_prefix: ".GENERAL",
      endpoint: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/general_intents.json`
    },
    {
      domain_prefix: ".SPECIFIC_STRUC",
      endpoint: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/specific_struc_intents.json`
    },
    {
      domain_prefix: ".SPECIFIC_UNSTRUC",
      endpoint: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/specific_unstruc_intents.json`
    },
    {
      domain_prefix: ".TOURS",
      endpoint: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/tours_intents.json`
    },
    {
      domain_prefix: ".HUMAN",
      endpoint: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/human_intents.json`
    },
    {
      domain_prefix: ".GEO",
      endpoint: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/geo_intents.json`
    }
  ]
}
