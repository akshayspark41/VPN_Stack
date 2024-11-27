import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { getConfig } from '../config/config';
import { tagResources } from '../tagging/tagging';

export class AwsClientVpnStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Load configuration
    const config = getConfig();

    // S3 bucket for OpenVPN config files
    const vpnConfigBucket = new s3.Bucket(this, 'VpnConfigBucket', {
      bucketName: `${config.projectName}-vpn-config`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudWatch log group for VPN logs
    const logGroup = new logs.LogGroup(this, 'VpnLogGroup', {
      retention: logs.RetentionDays.ONE_WEEK,
    });

    // Client VPN Endpoint
    const clientVpnEndpoint = new ec2.CfnClientVpnEndpoint(this, 'ClientVpnEndpoint', {
      authenticationOptions: [{
        type: 'certificate-authentication',
        mutualAuthentication: {
          clientRootCertificateChainArn: config.clientRootCertificateArn,
        },
      }],
      clientCidrBlock: config.clientCidrBlock,
      connectionLogOptions: {
        enabled: true,
        cloudwatchLogGroup: logGroup.logGroupName,
        cloudwatchLogStream: 'client-vpn-logs',
      },
      serverCertificateArn: config.serverCertificateArn,
      splitTunnel: config.splitTunnel,
      vpcId: config.vpcId,
    });

    // Associate subnets
    config.publicSubnetIds.forEach((subnetId, index) => {
      new ec2.CfnClientVpnTargetNetworkAssociation(this, `SubnetAssociation${index}`, {
        clientVpnEndpointId: clientVpnEndpoint.ref,
        subnetId: subnetId,
      });
    });

    // Add tagging
    tagResources(this, config.tags);
  }
}
