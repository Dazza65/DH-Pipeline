const { awscdk } = require('projen');

const cdkVersion = '2.61.1';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Darren Harris',
  authorAddress: 'dazza@me.com',
  cdkVersion,
  defaultReleaseBranch: 'main',
  name: 'DH-Pipeline',
  repositoryUrl: 'https://github.com/dazza65/DH-Pipeline.git',
  keywords: 'Pipeline',
  description: 'A CDK CodePipeline construct',
  deps: [
    `@aws-cdk/aws-apigatewayv2-alpha@${cdkVersion}-alpha.0`,
    `@aws-cdk/aws-apigatewayv2-integrations-alpha@${cdkVersion}-alpha.0`,
  ],
  stability: 'experimental',
  packageName: 'DH-Pipeline',
});
project.synth();