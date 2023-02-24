import { App } from 'aws-cdk-lib';
import { DHPipeline } from './DHPipeline';

const app = new App();
// const stack = new cdk.Stack(app, 'MyTestPipelineStack');
DHPipeline.createPipeline(app);
