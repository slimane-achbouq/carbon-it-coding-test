"use strict";

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filesDirectory = process.env.NODE_ENV === 'test' ? 'tests' : 'public';

export const INPUT_FILE_PATH = join(__dirname, 'src', filesDirectory, 'input.txt');
export const OUTPUT_FILE_PATH = join(__dirname, 'src', filesDirectory, 'output.txt');