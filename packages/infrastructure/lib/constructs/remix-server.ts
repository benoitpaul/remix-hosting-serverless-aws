import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2-alpha";
import * as apigatewayv2_integrations from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";

import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

interface RemixServerProps {
  server: string;
}

export class RemixServer extends Construct {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: RemixServerProps) {
    super(scope, id);

    const lambdaNodejsFn = new lambda_nodejs.NodejsFunction(
      this,
      "RemixLambda",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
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
      }
    );

    const lambdaIntegration =
      new apigatewayv2_integrations.HttpLambdaIntegration(
        "LambdaIntegration",
        lambdaNodejsFn
      );

    const httpApi = new apigatewayv2.HttpApi(this, "RemixApi", {
      apiName: scope.node.id,
      defaultIntegration: lambdaIntegration,
    });

    this.apiUrl = `${httpApi.httpApiId}.execute-api.${Stack.of(this).region}.${
      Stack.of(this).urlSuffix
    }`;
  }
}
