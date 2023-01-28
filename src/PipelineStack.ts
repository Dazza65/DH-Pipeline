import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { PipelineProject, LinuxArmBuildImage } from 'aws-cdk-lib/aws-codebuild';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { Pipeline, Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { CodeCommitSourceAction, CodeBuildAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { Config } from './DHPipeline';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps, config: Config) {
    super(scope, id, props);

    const pipeline = new Pipeline(this, 'Pipeline', {
      pipelineName: `${config.projectName}-DHPipeline`,
      crossAccountKeys: false,
    });

    // TODO: Pass name of existing repo via props
    // TODO: All creation of new CodeCommit repository
    // TODO: Allow other Git repositories; Github, BitBucket, etc
    const repository = Repository.fromRepositoryName(this, 'MyCodeRepository', 'prj1ex');

    const sourceOutput = new Artifact('DHPipelineS3');

    // TODO: Props to pass branch name
    const sourceAction = new CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository: repository,
      output: sourceOutput,
      branch: 'master',
    });

    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    // TODO: prop to pass in projectName and build image
    const buildProject = new PipelineProject(this, 'MyPipelineBuild', {
      environment: {
        buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
      },
      projectName: 'prj1ex',
    });

    // TODO: what other actions are required, should these be configurable
    if ( buildProject.role ) {
      buildProject.role.attachInlinePolicy(new Policy(this, 'prCodeBuildPolicy', {
        statements: [new PolicyStatement({
          actions: ['cloudformation:ValidateTemplate'],
          resources: ['*'],
        })],
      }));
    }

    const buildAction = new CodeBuildAction({
      actionName: 'buildAction',
      project: buildProject,
      input: sourceOutput,
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction],
    });

    new CfnOutput(this, 'PipelineName', { value: pipeline.pipelineName });
  }
}
