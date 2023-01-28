import * as cdk from 'aws-cdk-lib';
import { DHPipeline } from './DHPipeline';

const app = new cdk.App();
// const stack = new cdk.Stack(app, 'MyTestPipelineStack');
DHPipeline.createPipeline(app);
