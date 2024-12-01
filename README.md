
# **AWS Client VPN Deployment using AWS CDK**

This project provides an AWS CDK solution to deploy an AWS Client VPN endpoint with support for multiple users, using self-signed certificates. It includes features like managing user certificates, subnet associations, and OpenVPN configuration files stored in an S3 bucket.

---

## **Features**
- Deploys an **AWS Client VPN endpoint**.
- Manages **user certificates** (stored in AWS Systems Manager Parameter Store).
- Supports **subnet associations** for public subnets.
- Stores OpenVPN configuration files in an **S3 bucket**.
- Configures **CloudWatch Logs** for VPN connections.
- Includes consistent **resource tagging**.

---

## **Directory Structure**
```
aws-client-vpn/
├── bin/
│   └── aws-client-vpn.ts              # CDK app entry point
├── lib/
│   └── aws-client-vpn-stack.ts        # Main stack for resources
├── tagging/
│   └── tagging.ts                     # Resource tagging utility
├── certs/
│   └── certificates.ts                # Certificate management helper
├── config/
│   └── config.ts                      # Configuration file for project variables
├── node_modules/                      # Dependencies (created after npm install)
├── cdk.json                           # CDK configuration
├── package.json                       # Project dependencies
├── package-lock.json                  # Dependency lock file (created after npm install)
├── tsconfig.json                      # TypeScript configuration
└── README.md                          # Documentation (this file)
```

---

## **Prerequisites**
1. **AWS Account**: Ensure you have access to an AWS account.
2. **AWS CLI**: [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) and configure it:
   ```bash
   aws configure
   ```
3. **AWS CDK**: Install AWS CDK globally:
   ```bash
   npm install -g aws-cdk
   ```
4. **Node.js**: Ensure Node.js is installed (v14 or later).
   ```bash
   node -v
   npm -v
   ```

---

## **Setup and Installation**
1. **Clone the Repository**:
   ```bash
   mkdir aws-client-vpn && cd aws-client-vpn
   ```
   Copy all files from the directory structure into the project folder.

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Bootstrap the CDK**:
   This is required to set up resources like S3 buckets for CDK deployment:
   ```bash
   cdk bootstrap
   ```

4. **Deploy the Stack**:
   Run the following command to deploy the resources:
   ```bash
   cdk deploy
   ```

5. **Verify Deployment**:
   - **S3 Bucket**: Check the bucket for OpenVPN configuration files.
   - **Client VPN Endpoint**: Validate the VPN endpoint is available in the AWS Console.

---

## **Usage**
### **Downloading OpenVPN Configuration Files**
1. Navigate to the S3 bucket created during deployment.
2. Download the `.ovpn` file(s) for your VPN client.
3. Import the `.ovpn` file into your VPN client (e.g., AWS Client VPN Client).

---

## **Removing or Revoking Users**
Follow these steps to revoke a user certificate:
1. Download the **CA certificate** and the user's certificate from AWS Systems Manager Parameter Store.
2. Use OpenSSL to revoke the certificate:
   ```bash
   openssl ca -revoke user.crt -keyfile ca.key -cert ca.crt
   ```
3. Update the certificate revocation list (CRL):
   ```bash
   openssl ca -gencrl -out revocations.crl -keyfile ca.key -cert ca.crt
   ```
4. Import the updated CRL to the VPN endpoint:
   ```bash
   aws ec2 import-client-vpn-client-certificate-revocation-list \
       --certificate-revocation-list file://revocations.crl \
       --client-vpn-endpoint-id <vpn-endpoint-id> \
       --region <region>
   ```

---

## **Tagging Convention**
All resources are tagged consistently using the following format:
```
<client>-<project>-<environment>-<resourcetype>-<details>
```

Example:
- **Resource Name**: `minedu-client-vpn-production-vpn-endpoint`

---

## **Configuration**
The configuration file (`config/config.ts`) contains key variables for your project. Update the following fields before deployment:
- **VPC ID**: Replace `vpcId` with your VPC ID.
- **Subnet IDs**: Replace `publicSubnetIds` with your subnet IDs.
- **Certificate ARNs**: Replace `clientRootCertificateArn` and `serverCertificateArn` with your ACM certificate ARNs.

---

## **Commands**
- **Synthesize CloudFormation Template**:
  ```bash
  cdk synth
  ```
- **Deploy the Stack**:
  ```bash
  cdk deploy
  ```
- **Destroy the Stack**:
  ```bash
  cdk destroy
  ```

---

## **License**
This project is licensed under the MIT License. See the LICENSE file for details.

---
