import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import * as Twilio from 'twilio';
import {DynamoDB} from "aws-sdk";
import {GetItemInput} from "aws-sdk/clients/dynamodb";

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const client = Twilio(`${process.env.TWILIO_SID}`, `${process.env.TWILIO_TOKEN}`);
  const response = await client.messages.create({
    body: 'Takano Test',
    from: '+15005550006', // テスト用番号
    statusCallback: '',
    to: '+15123456789' // テスト用番号
   });

  console.log(response);

  const docClient = new DynamoDB.DocumentClient();
  const params: GetItemInput = {
    TableName: "users",
    Key: {},
  };

  docClient.get(params, (err, data) => {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      response: response,
      input: event,
    }, null, 2),
  };
}

export const updateStatus: APIGatewayProxyHandler = async (event, _context) => {
  // TODO: 受け取ったやつを出す
  const docClient = new DynamoDB.DocumentClient();
  const params = {
    TableName: "users",
    Item: {
      "phone_number": 'test number',
    }
  };

  console.log("Adding a new item...");

  docClient.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
    }, null, 2),
  };
}
