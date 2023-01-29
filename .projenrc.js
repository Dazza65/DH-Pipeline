const { awscdk } = require('projen');

const cdkVersion = '2.61.1';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Darren Harris',
  authorAddress: 'dazza@me.com',
  cdkVersion,
  defaultReleaseBranch: 'main',
  name: 'DH-Pipeline',
  repositoryUrl: 'https://github.com/dazza65/DH-Pipeline.git',
  keywords: [
    'Pipeline',
  ],
  description: 'A CDK CodePipeline construct',
  stability: 'experimental',
  packageName: 'dh-pipeline',
  deps: [
    'js-yaml@^4.1.0',
    '@types/js-yaml@^4.0.5',
  ],
  bundledDeps: [
    'js-yaml',
    '@types/js-yaml',
  ],
  gitignore: [
    'cdk.out/',
  ],
});
project.synth();