import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
export function tagResources(scope: Construct, tags: { [key: string]: string }) {
  Object.keys(tags).forEach((key) => {
    cdk.Tags.of(scope).add(key, tags[key]);
  });
}
