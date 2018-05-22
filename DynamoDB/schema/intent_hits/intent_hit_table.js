const AWS = require('aws-sdk')
const aws_config = require('../../../credentials/aws_config')
const RENTHERO_INTENTS_HIT = require('../dynamodb_tablenames').RENTHERO_INTENTS_HIT
AWS.config.update(aws_config)


const rentheroIntentsHitTableParams = {
    TableName : RENTHERO_INTENTS_HIT,
    KeySchema: [
        // USE CASE: ALLOWS ME TO SEE ALL USER PREFERENCES INTEL IN CHRONOLOGICAL ORDER. EG: USER LOOKS FOR ENSUITE FIRST BEFORE CHANGING THEIR FILTERS TO LOOK FOR LESS ROOMATES NO ENSUITE
        { AttributeName: "CHANNEL_ID", KeyType: "HASH" },  //Partition key
        { AttributeName: "DATETIME", KeyType: "RANGE" },  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "CHANNEL_ID", AttributeType: "S" },
        { AttributeName: "DATETIME", AttributeType: "S" },
        { AttributeName: "AD_ID", AttributeType: "S" },
        { AttributeName: "INTENT_ID", AttributeType: "S" },
        { AttributeName: "ITEM_ID", AttributeType: "S" },
        { AttributeName: "TENANT_ID", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 10,
    },
    GlobalSecondaryIndexes: [
      {
        // USE CASE: ALLOWS ME TO SEE ALL INTEL OF A SPECIFIC ACTION, GROUPED BY USERS. EG: SHOW ME ALL PRICE ADJUSTMENTS, AND NOW I CAN GROUP USER POPULATIONS INTO PRICE RANGES.
        IndexName: 'By_Ad_ID', /* required */
        KeySchema: [ /* required */
          {AttributeName: 'AD_ID', KeyType: 'HASH'},
          {AttributeName: 'ITEM_ID', KeyType: 'RANGE'}
        ],
        Projection: { /* required */
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: { /* required */
          ReadCapacityUnits: 2, /* required */
          WriteCapacityUnits: 10 /* required */
        }
      },
      {
        // USE CASE: ALLOWS ME TO SEE ALL INTEL OF A SPECIFIC ACTION, GROUPED BY USERS. EG: SHOW ME ALL PRICE ADJUSTMENTS, AND NOW I CAN GROUP USER POPULATIONS INTO PRICE RANGES.
        IndexName: 'By_Intent_ID', /* required */
        KeySchema: [ /* required */
          {AttributeName: 'INTENT_ID', KeyType: 'HASH'},
          {AttributeName: 'ITEM_ID', KeyType: 'RANGE'}
        ],
        Projection: { /* required */
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: { /* required */
          ReadCapacityUnits: 2, /* required */
          WriteCapacityUnits: 10 /* required */
        }
      },
      {
        // USE CASE: ALLOWS ME TO SEE ALL INTEL OF A SPECIFIC ACTION, GROUPED BY USERS. EG: SHOW ME ALL PRICE ADJUSTMENTS, AND NOW I CAN GROUP USER POPULATIONS INTO PRICE RANGES.
        IndexName: 'By_Tenant_ID', /* required */
        KeySchema: [ /* required */
          {AttributeName: 'TENANT_ID', KeyType: 'HASH'},
          {AttributeName: 'ITEM_ID', KeyType: 'RANGE'}
        ],
        Projection: { /* required */
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: { /* required */
          ReadCapacityUnits: 2, /* required */
          WriteCapacityUnits: 10 /* required */
        }
      }
    ]
}

exports.createTables = function(){

  console.log("==> About to create DynamoDB tables!")

  const dynamodb = new AWS.DynamoDB({
    dynamodb: '2012-08-10',
    region: "us-east-1"
  })

  dynamodb.createTable(rentheroIntentsHitTableParams, function(err, data) {
      if (err)
          console.log(JSON.stringify(err, null, 2));
      else
          console.log(JSON.stringify(data, null, 2));
  })
}
