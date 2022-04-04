#!/usr/bin/env node

import * as fs from 'fs';
import { Command } from 'commander';
import execBuild from './commands/build';
import execStart from './commands/start';
import execCreate from './commands/create';
import { initialize } from './utils/initialize';

const packageJson = JSON.parse(
  fs.readFileSync(require.resolve('../package.json'), 'utf8')
);

const program = new Command();

const commands = [
  {
    command: 'create',
    description: 'download a plugin template',
    example: ['njt-vcreator create <project-name>'],
    action: execCreate,
  },
  {
    command: 'start',
    description: 'start debug',
    example: ['njt-vcreator dev'],
    action: execStart,
  },
  {
    command: 'build',
    description: 'build a plugin for production',
    example: ['njt-vcreator build'],
    action: execBuild,
  },
  // {
  //   command: 'deploy',
  //   description: 'build a plugin for production',
  //   example: ['njt-vcreator build'],
  //   action: execBuild,
  // },
  {
    command: '*',
    description: 'command not found!',
    example: [],
    action: () => console.log('command not found!'),
  },
];

const options = [
  {
    content: '-p, --port <port>',
    desc: 'Start development server width port.',
  },
  {
    content: '-f, --folder <folder>',
    desc: 'The folder for download template.',
  },
  {
    content: '--hot',
    desc: 'Hot update plugin render.',
  },
];

options.forEach(({ content, desc }) => {
  program.option(content, desc);
});

commands.forEach(action => {
  program
    .command(action.command)
    .description(action.description)
    .action(() => {
      const options = program.opts() as CommandOptions;
      initialize({}, () => {
        action.action(options);
      });
    });
});

program.version(packageJson.version).parse(process.argv);
