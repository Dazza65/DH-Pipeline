import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
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
});

describe('Test Exceptions', () => {
  test('Error is thrown is config file does not exist', () => {
    expect(() => {
      DHPipeline.createPipeline(mockApp, 'missing-config.yaml');
    }).toThrowError('ENOENT');
  });
});
