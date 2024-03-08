import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface RemixStaticAssetsConstructProps {}

export class RemixStaticAssetsConstruct extends Construct {
  public readonly bucket: s3.IBucket;

  constructor(
    scope: Construct,
    id: string,
    props: RemixStaticAssetsConstructProps
  ) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, "StaticBucket", {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
  }
}
