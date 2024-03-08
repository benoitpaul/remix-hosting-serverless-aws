import { CfnOutput } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3_deployment from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { RemixApiGateway } from "./remix-api-gateway";
import { RemixDistribution } from "./remix-distribution";
import { RemixLambdaConstruct } from "./remix-lambda";
import { RemixStaticAssetsConstruct } from "./remix-static-assets";

interface RemixConstructProps {
  runtime: lambda.Runtime;
  server: string;
  publicDir: string;
  s3Bucket?: {
    keyPrefix: string;
  };
}

export class RemixConstruct extends Construct {
  private readonly staticAssets: RemixStaticAssetsConstruct;
  private readonly lambdaFunction: RemixLambdaConstruct;
  private readonly api: RemixApiGateway;
  private readonly distribution: RemixDistribution;

  constructor(scope: Construct, id: string, props: RemixConstructProps) {
    super(scope, id);

    this.staticAssets = new RemixStaticAssetsConstruct(
      this,
      "RemixStaticAssets",
      {
        publicDir: props.publicDir,
        keyPrefix: props.s3Bucket?.keyPrefix,
      }
    );

    this.lambdaFunction = new RemixLambdaConstruct(this, "RemixServer", {
      runtime: props.runtime,
      server: props.server,
    });

    this.staticAssets.bucket.grantReadWrite(this.lambdaFunction.lambda);
    this.staticAssets.bucket.grantDelete(this.lambdaFunction.lambda);
    this.staticAssets.bucket.grantPut(this.lambdaFunction.lambda);

    this.api = new RemixApiGateway(this, "RemixApiGateway", {
      lambda: this.lambdaFunction.lambda,
    });

    this.distribution = new RemixDistribution(this, "RemixDistribution", {
      serverApiUrl: this.api.apiUrl,
      bucket: this.staticAssets.bucket,
    });

    new s3_deployment.BucketDeployment(this, "Default", {
      sources: [s3_deployment.Source.asset(props.publicDir)],
      destinationBucket: this.staticAssets.bucket,
      destinationKeyPrefix: "_static",
      distribution: this.distribution.distribution,
    });

    new CfnOutput(this, "RemixApiUrl", {
      value: this.distribution.distribution.distributionDomainName,
    });
  }
}
