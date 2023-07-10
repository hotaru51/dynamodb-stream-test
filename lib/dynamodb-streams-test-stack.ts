import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs';

export class DynamodbStreamsTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // リクエスト受信用Lambda
    const receiveFunction = new lambda.Function(this, 'ReceiveFunction', {
      runtime: lambda.Runtime.PYTHON_3_10,
      handler: 'app.handler',
      architecture: lambda.Architecture.X86_64,
      code: lambda.Code.fromAsset('src/receive_function', {
        bundling: {
          image: lambda.Runtime.PYTHON_3_10.bundlingImage,
          command: [
            'bash', '-c',
            'pip install -r requirements.txt -t /asset-output && cp -au . /asset-output'
          ]
        }
      }),
      functionName: 'dynamodb-streams-test-receive-function',
      memorySize: 128
    })

    // リクエスト受信用APi Gateway
    const receiveApi = new apigw.LambdaRestApi(this, 'ReceiveApi', {
      handler: receiveFunction,
      restApiName: 'dynamodb-streams-test-api',
      deployOptions: {
        stageName: 'test'
      }
    })

    // DynamoDB Table
    const table = new dynamodb.Table(this, 'StreamsTestTable',{
      tableName: 'dynamodb-streams-test-table',
      partitionKey: {
        name: 'name',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1
    })
    table.grantWriteData(receiveFunction)
    receiveFunction.addEnvironment('TABLE_NAME', table.tableName)
  }
}
