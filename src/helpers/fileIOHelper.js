"use strict";

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { INPUT_FILE_PATH, OUTPUT_FILE_PATH} from '../../config.js';
import { prepareOutputData } from './gameHelper.js';


export function readInputFile() {
    if(!existsSync(INPUT_FILE_PATH)) {
        console.log('\x1b[31m%s\x1b[0m',`Input file not found ! \u{1F4A5} looking at : ${INPUT_FILE_PATH}`);
        process.exit();
    }
    
    return readFileSync(INPUT_FILE_PATH, 'utf8').split('\n');
}

export function writeOutputFile(gameObject) {
    const outputData = prepareOutputData(gameObject);
    writeFileSync(OUTPUT_FILE_PATH, outputData);
}

