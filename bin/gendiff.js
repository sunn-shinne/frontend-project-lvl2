#!/usr/bin/env node
import { Command } from 'commander';
import genDiff from '../src/index.js';
// import stylish from '../src/formatters/stylish.js';

const program = new Command();

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1');

program
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2, options) => {
    const diff = genDiff(filepath1, filepath2, options.format);
    console.log(diff);
  });

// program

program.parse();
