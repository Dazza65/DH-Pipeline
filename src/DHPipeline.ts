import * as fs from 'fs';
import { Construct } from 'constructs';
import * as yaml from 'js-yaml';
import { PipelineStack } from './PipelineStack';

export interface Config {
  readonly projectName: string;
}

function readYamlFileSync(filePath: string): Config {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const obj = yaml.load(data);
    return (obj as Config);
  } catch (e) {
    throw e;
  }
}

export class DHPipeline {
  static createPipeline(construct: Construct, configFile = '.pipeline-config.yaml') {
    const config = readYamlFileSync(configFile);

    console.log(config);

    return new PipelineStack(construct, 'DHPipelineStack', { stackName: `${config.projectName}-PipelineStack` }, config);
  }
}
