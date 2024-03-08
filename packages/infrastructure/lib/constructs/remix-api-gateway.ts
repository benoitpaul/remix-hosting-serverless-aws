import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2-alpha";
import * as apigatewayv2_integrations from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs";

import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

interface RemixApiGatewayProps {
  lambda: lambda_nodejs.NodejsFunction;
}

export class RemixApiGateway extends Construct {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: RemixApiGatewayProps) {
    super(scope, id);

    const lambdaIntegration =
      new apigatewayv2_integrations.HttpLambdaIntegration(
        "LambdaIntegration",
        props.lambda
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
