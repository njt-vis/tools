import { resolve } from 'path';

import inquirer from 'inquirer';
import ora from 'ora';

import logger from '../../utils/logger';
import { isFolder } from '../../utils/common';
import { getAllTemplates } from '../../utils/repository';
import { REPOSITORY_INFO } from '../../setting';

const download = require('download-git-repo');

// 考虑可能根据不同入参进入不同交互流
async function create(options: CommandOptions) {
  const { folder } = options;
  if (!folder) {
    logger.error('Lost param folder to download template.');
    return;
  }
  if (isFolder(resolve(folder))) {
    logger.error(`Folder ${folder} is already exist.`);
  }

  try {
    console.info('Fetcing templates...');

    const { data: templates } = await getAllTemplates();

    console.clear();

    const choices = templates.map(({ name }) => ({
      name,
      value: name,
    }));

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'module',
        message: 'Select plugin template:',
        choices,
      },
    ]);

    const spinner = ora('Pulling . . .').start();

    download(
      `${REPOSITORY_INFO.repository}#${answer.module}`,
      resolve(folder),
      { clone: true },
      err => {
        if (err) {
          logger.error(err);
          spinner.stop();
        } else {
          spinner.succeed('Success.');
        }
      }
    );
  } catch (error) {
    logger.error(error as Error);
  }
}

export default create;
