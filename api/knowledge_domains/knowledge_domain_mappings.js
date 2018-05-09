let S3_bucket = 'https://s3.amazonaws.com/renthero-ai-mappings/'

exports.domain_mappings = {
  domains: [
    {
      domain_prefix: "META",
      s3_mapping: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/meta_intents.json`
    },
    {
      domain_prefix: "SEARCHING",
      s3_mapping: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/searching_intents.json`
    },
    {
      domain_prefix: "GENERAL",
      s3_mapping: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/general_intents.json`
    },
    {
      domain_prefix: "SPEC_STRUC",
      s3_mapping: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/specific_struc_intents.json`
    },
    {
      domain_prefix: "SPEC_UNSTRUC",
      s3_mapping: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/specific_unstruc_intents.json`
    },
    {
      domain_prefix: "TOURS",
      s3_mapping: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/tours_intents.json`
    },
    {
      domain_prefix: "HUMAN",
      s3_mapping: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/human_intents.json`
    },
    {
      domain_prefix: "GEO",
      s3_mapping: `${S3_bucket}knowledge_domains/${process.env.NODE_ENV}/geo_intents.json`
    }
  ]
}
