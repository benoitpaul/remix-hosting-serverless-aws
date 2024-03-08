import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

interface RemixLambdaConstructProps {
  runtime: lambda.Runtime;
  server: string;
}

export class RemixLambdaConstruct extends Construct {
  public readonly lambda: lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: RemixLambdaConstructProps) {
    super(scope, id);

    this.lambda = new lambda_nodejs.NodejsFunction(this, "RemixLambda", {
      description: "Remix Server, managed by CDK",
      runtime: props.runtime,
      entry: props.server,
      bundling: {
        nodeModules: [
          "@remix-run/architect",
          // "@remix-run/node",
          // "react",
          // "react-dom",
        ],
      },
      timeout: cdk.Duration.seconds(10),
      logRetention: logs.RetentionDays.THREE_DAYS,
    });
  }
}
