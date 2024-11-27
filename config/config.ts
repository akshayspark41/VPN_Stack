export function getConfig() {
    return {
      organizationName: 'Ministry of Education, Greece',
      projectName: 'minedu-client-vpn',
      clientCidrBlock: '192.168.99.0/24',
      vpcId: 'vpc-040dcfa841ad82082',
      publicSubnetIds: ['subnet-01205db77f3c98b1b'],
      clientRootCertificateArn: 'arn:aws:acm:region:account-id:certificate/cert-id', // Replace with ACM ARN
      serverCertificateArn: 'arn:aws:acm:region:account-id:certificate/cert-id', // Replace with ACM ARN
      splitTunnel: true,
      tags: {
        environment: 'Development',
        project: 'minedu-client-vpn',
      },
    };
  }
  