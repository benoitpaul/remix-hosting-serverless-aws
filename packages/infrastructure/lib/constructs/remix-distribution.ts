import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";

import { Construct } from "constructs";

interface RemixDistributionProps {
  bucket: s3.IBucket;
  serverApiUrl: string;
}

export class RemixDistribution extends Construct {
  public readonly distribution: cloudfront.Distribution;
  constructor(scope: Construct, id: string, props: RemixDistributionProps) {
    super(scope, id);

    const bucketOriginAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "BucketOriginAccessIdentity"
    );
    props.bucket.grantRead(bucketOriginAccessIdentity);

    this.distribution = new cloudfront.Distribution(this, "Distribution", {
      // certificate: TODO
      // domainNames: TODO
      // httpVersion: HttpVersion.HTTP2_AND_3,
      enableLogging: false,
      defaultBehavior: {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        compress: true,
        origin: new cloudfront_origins.HttpOrigin(props.serverApiUrl),
        originRequestPolicy:
          cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      // Static assets are retrieved from the /_static path.
      additionalBehaviors: {
        "_static/*": {
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          compress: true,
          origin: new cloudfront_origins.S3Origin(props.bucket, {
            originAccessIdentity: bucketOriginAccessIdentity,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    });
  }
}
