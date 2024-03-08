import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { RemixConstruct } from "./constructs/remix";
import path = require("path");

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const remix = new RemixConstruct(this, "Remix", {
      publicDir: path.join(__dirname, "../../my-remix-app/public"),
      server: path.join(__dirname, "../../my-remix-app/server/index.js"),
    });
  }
}
