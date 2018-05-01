const AWS = require('aws-sdk')
const aws_config = require('../../../credentials/aws_config')
const RENTHERO_QALTA_SETS = require('../dynamodb_tablenames').RENTHERO_QALTA_SETS
AWS.config.update(aws_config)


const qaltaTableParams = {
    TableName : RENTHERO_QALTA_SETS,
    KeySchema: [
        // USE CASE: ALLOWS ME TO SEE ALL USER PREFERENCES INTEL IN CHRONOLOGICAL ORDER. EG: USER LOOKS FOR ENSUITE FIRST BEFORE CHANGING THEIR FILTERS TO LOOK FOR LESS ROOMATES NO ENSUITE
        { AttributeName: "AD_ID", KeyType: "HASH" },  //Partition key
        { AttributeName: "ITEM_ID", KeyType: "RANGE" },  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "AD_ID", AttributeType: "S" },
        { AttributeName: "ITEM_ID", AttributeType: "S" },
        { AttributeName: "DATETIME", AttributeType: "S" },
        // { AttributeName: "TYPE", AttributeType: "S" },
        // { AttributeName: "TAGS", AttributeType: "SS" },
        // { AttributeName: "PHRASING", AttributeType: "S" },
        // { AttributeName: "GPS_X", AttributeType: "N" },
        // { AttributeName: "GPS_Y", AttributeType: "N" },
        // { AttributeName: "LANDLORD_ID", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
    },
    GlobalSecondaryIndexes: [
      {
        // USE CASE: ALLOWS ME TO SEE ALL INTEL OF A SPECIFIC ACTION, GROUPED BY USERS. EG: SHOW ME ALL PRICE ADJUSTMENTS, AND NOW I CAN GROUP USER POPULATIONS INTO PRICE RANGES.
        IndexName: 'By_Item_ID', /* required */
        KeySchema: [ /* required */
          {AttributeName: 'ITEM_ID', KeyType: 'HASH'},
          {AttributeName: 'DATETIME', KeyType: 'RANGE'}
        ],
        Projection: { /* required */
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: { /* required */
          ReadCapacityUnits: 10, /* required */
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

  dynamodb.createTable(qaltaTableParams, function(err, data) {
      if (err)
          console.log(JSON.stringify(err, null, 2));
      else
          console.log(JSON.stringify(data, null, 2));
  })
}
