const AWS = require('aws-sdk')
const aws_config = require('../../../credentials/aws_config')
const RENTHERO_USER_REACTIONS = require('../dynamodb_tablenames').RENTHERO_USER_REACTIONS
AWS.config.update(aws_config)


const rentheroReactionsTableParams = {
    TableName : RENTHERO_USER_REACTIONS,
    KeySchema: [
        // USE CASE: ALLOWS ME TO SEE ALL USER PREFERENCES INTEL IN CHRONOLOGICAL ORDER. EG: USER LOOKS FOR ENSUITE FIRST BEFORE CHANGING THEIR FILTERS TO LOOK FOR LESS ROOMATES NO ENSUITE
        { AttributeName: "SESSION_ID", KeyType: "HASH" },  //Partition key
        { AttributeName: "REACTION_ID", KeyType: "RANGE" },  //Sort key
    ],
    AttributeDefinitions: [
        // { AttributeName: "MESSAGE_ID", AttributeType: "S" },
        { AttributeName: "AD_ID", AttributeType: "S" },
        { AttributeName: "SESSION_ID", AttributeType: "S" },
        { AttributeName: "IDENTITY_ID", AttributeType: "S" },
        // { AttributeName: "DATETIME", AttributeType: "S" },
        { AttributeName: "REACTION_ID", AttributeType: "S" }
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
          {AttributeName: 'REACTION_ID', KeyType: 'RANGE'}
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
        IndexName: 'By_Identity_ID', /* required */
        KeySchema: [ /* required */
          {AttributeName: 'IDENTITY_ID', KeyType: 'HASH'},
          {AttributeName: 'REACTION_ID', KeyType: 'RANGE'}
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

  dynamodb.createTable(rentheroReactionsTableParams, function(err, data) {
      if (err)
          console.log(JSON.stringify(err, null, 2));
      else
          console.log(JSON.stringify(data, null, 2));
  })
}
