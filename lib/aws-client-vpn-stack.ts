import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';
import { getConfig } from '../config/config';
import { tagResources } from '../tagging/tagging';

export class AwsClientVpnStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Load configuration
    (async () => {
      const config = await getConfig();

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

      // CloudWatch log stream for VPN logs
      const logStream = new logs.LogStream(this, 'VpnLogStream', {
        logGroup: logGroup,
        logStreamName: 'client-vpn-logs',
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });

      // Create Route 53 hosted zone
      const myHostedZone = new route53.HostedZone(this, 'HostedZone', {
        zoneName: config.domain,
      });

      // Create ACM certificates
      const clientCertificate = new acm.Certificate(this, 'ClientCertificate', {
        domainName: config.domain,
        validation: acm.CertificateValidation.fromDns(myHostedZone),
      });

      const serverCertificate = new acm.Certificate(this, 'ServerCertificate', {
        domainName: config.domain,
        validation: acm.CertificateValidation.fromDns(myHostedZone),
      });

      // Client VPN Endpoint
      const clientVpnEndpoint = new ec2.CfnClientVpnEndpoint(this, 'ClientVpnEndpoint', {
        authenticationOptions: [{
          type: 'certificate-authentication',
          mutualAuthentication: {
            clientRootCertificateChainArn: clientCertificate.certificateArn,
          },
        }],
        clientCidrBlock: config.clientCidrBlock,
        connectionLogOptions: {
          enabled: true,
          cloudwatchLogGroup: logGroup.logGroupName,
          cloudwatchLogStream: logStream.logStreamName,
        },
        serverCertificateArn: serverCertificate.certificateArn,
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
    })();
  }
}