export function getConfig() {
    return {
      organizationName: 'Ministry of Education, Greece',
      projectName: 'minedu-client-vpn',
      clientCidrBlock: '10.1.0.0/22',
      vpcId: 'vpc-040dcfa841ad82082',
      publicSubnetIds: ['subnet-01205db77f3c98b1b'],
      domain: 'directory.pg.sparksdev.net',
      splitTunnel: true,
      tags: {
        environment: 'Development',
        project: 'minedu-client-vpn',
      },
    };
  }
  