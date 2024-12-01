export function getConfig() {
    return {
      organizationName: 'Ministry of Education, Greece',
      projectName: 'minedu-client-vpn',
      clientCidrBlock: '10.1.0.0/22',
      vpcId: 'vpc-040dcfa841ad82082',
      publicSubnetIds: ['subnet-01205db77f3c98b1b'],
      clientRootCertificateArn: 'arn:aws:acm:us-east-1:047719653773:certificate/2138639a-4546-46ad-9a66-e41ed1e639af', 
      serverCertificateArn: 'arn:aws:acm:us-east-1:047719653773:certificate/2138639a-4546-46ad-9a66-e41ed1e639af', 
      splitTunnel: true,
      tags: {
        environment: 'Development',
        project: 'minedu-client-vpn',
      },
    };
  }
  