"use strict";

import { readInputFile } from './helpers/fileIOHelper.js';
import Game from './classes/game.js';

(() => {
    console.log('\x1b[32m%s\x1b[0m', 'Game started ! \u{1F575}');

    const fileLines = readInputFile();
    const lineToInitMap = fileLines.find(line => line.startsWith('C'));
    if(!lineToInitMap) {
        console.log('\x1b[31m%s\x1b[0m','Line to init the game map not found in the given input file ! \u{1F4A5}')
        return;
    }

    const [ _, mapWidth, mapHeight] = lineToInitMap.split('-');
    const myGame = new Game(mapWidth, mapHeight, fileLines);
    console.log(myGame);
})();
