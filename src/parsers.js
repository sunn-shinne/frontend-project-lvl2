import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export const jsonParser = (filepath) => JSON.parse(fs.readFileSync(path.resolve(filepath)));

export const yamlParser = (filepath) => yaml.load(fs.readFileSync(path.resolve(filepath)), 'utf8');
