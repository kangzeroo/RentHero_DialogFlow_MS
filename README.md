# RentHero DialogFlow Microservice
For DialogFlow chat initialization, saving `session_id`+`ad_id` pairs, message forwarding between `client` --> `server` --> `dialogflow`, and answering questions asking for meta help, such as "What can you do?" and "What are you?". May also host `POST /dialogflow_fulfillment_renthero` endpoint if it is not hosted on a `Google Cloud Function`.

## Mappings for Setup
The following are the type of mappings RentHero AI uses. They are hosted on AWS S3. To manage mappings, see the repo `RentHero_Mappings_Manager`
1. Typeform to DynamoDB (to Elasticsearch)
      - Map a Typeform question/answer with its Elasticsearch entry using `./api/mapping_locations.js > basic_question_map.json`
2. DialogFlow to Elasticsearch
      - Map a DialogFlow intent fulfillment with an Elasticsearch entry using `./api/mapping_locations.js > basic_elastic_dialog_map.json`
