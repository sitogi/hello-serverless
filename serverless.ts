import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'hello-serverless',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'ap-northeast-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    profile: 'private',
  },
  functions: {
    hello: {
      handler: 'handler.hello',
      events: [
        {
          http: {
            method: 'get',
            path: 'hello',
          }
        }
      ]
    },
    updateStatus: {
      handler: 'handler.updateStatus',
      events: [
        {
          http: {
            method: 'post',
            path: 'updateStatus',
          }
        }
      ]
    }
  },
  resources: {
    Resources: {
      users: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'users',
          AttributeDefinitions: [
            {
              AttributeName: "phone_number",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "phone_number",
              KeyType: "HASH",
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        }
      }
    },
  },
}

module.exports = serverlessConfiguration;
