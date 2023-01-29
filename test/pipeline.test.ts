import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { DHPipeline } from '../src/index';

const mockApp = new App();

describe('Test normal pipeline', () => {
  let template: Template;
  beforeAll(() => {
    const stack = DHPipeline.createPipeline(mockApp);
    template = Template.fromStack(stack);

  });
  test('CodePipeline should be created', () => {
    template.hasResourceProperties('AWS::CodePipeline::Pipeline', {});
  });
  it('Should have a name of <projectname>-DHPipeline', () => {
    template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Name: 'MyProject-DHPipeline',
    });
  });
  it('Should have a CodeRepository name of prj1ex', () => {
    template.hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
      Stages: [
        {
          Actions: [
            {
              ActionTypeId: {
                Category: 'Source',
                Owner: 'AWS',
                Provider: 'CodeCommit',
              },
              Configuration: {
                RepositoryName: 'prj1ex',
                BranchName: 'master',
              },
            },
          ],
        },
        {
        },
        {
        },
      ],
    }));
  });
});

describe('Test Exceptions', () => {
  test('Error is thrown is config file does not exist', () => {
    expect(() => {
      DHPipeline.createPipeline(mockApp, '.missing-config.yaml');
    }).toThrowError('ENOENT');
  });
});

describe('Test Unimplemented functionality', () => {
  test('Error is thrown for CDK pipeline', () => {
    expect(() => {
      DHPipeline.createPipeline(mockApp, '.cdk-config.yaml');
    }).toThrowError('Not Implemented');
  });
});
