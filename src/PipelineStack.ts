import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { PipelineProject, LinuxArmBuildImage } from 'aws-cdk-lib/aws-codebuild';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { Pipeline, Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { CodeCommitSourceAction, CodeBuildAction, CloudFormationCreateUpdateStackAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { Config, ProjectType } from './DHPipeline';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps, config: Config) {
    super(scope, id, props);

    if ( config.projectType === ProjectType.CFN ) {
      const pipeline = new Pipeline(this, 'Pipeline', {
        pipelineName: `${config.projectName}-DHPipeline`,
        crossAccountKeys: false,
      });

      // TODO: All creation of new CodeCommit repository
      // TODO: Allow other Git repositories; Github, BitBucket, etc
      const repository = Repository.fromRepositoryName(this, 'CodeCommitRepository', config.codeRepositoryName);

      const sourceOutput = new Artifact('DHPipelineS3');

      const sourceAction = new CodeCommitSourceAction({
        actionName: 'CodeCommit',
        repository: repository,
        output: sourceOutput,
        branch: config.codeRepositoryBranch,
      });

      pipeline.addStage({
        stageName: 'Source',
        actions: [sourceAction],
      });

      // TODO: prop to pass in build image
      const buildProject = new PipelineProject(this, 'MyPipelineBuild', {
        environment: {
          buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
        },
        projectName: config.projectName,
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

      // TODO: pass cfn template in props
      // TODO: what if we have more that one cfn stack?
      // TODO: add project name to the name of the stack
      const cfnAction = new CloudFormationCreateUpdateStackAction({
        actionName: 'CreateStack',
        stackName: 'CfnStack',
        adminPermissions: true,
        templatePath: sourceOutput.atPath('template.yaml'),
      });

      pipeline.addStage({
        stageName: 'Deploy',
        actions: [cfnAction],
      });

      new CfnOutput(this, 'PipelineName', { value: pipeline.pipelineName });
    } else if ( config.projectType === ProjectType.CDK ) {
      throw ('Not Implemented');
    }
  }
}
