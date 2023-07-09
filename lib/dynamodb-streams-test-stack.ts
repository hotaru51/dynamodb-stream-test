import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs';

export class DynamodbStreamsTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
  }
}
