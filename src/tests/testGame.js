"use strict";

import { readInputFile } from '../helpers/fileIOHelper.js';
import { expect } from 'chai';
import Game from '../classes/game.js';

describe('Game', () => {
    describe('Parsing files', () => {
        it('Should read input file correctly', () => {
          const fileLines = readInputFile();
          const lineToInitMap = fileLines.find(line => line.startsWith('C'));
          const [ _, mapWidth, mapHeight] = lineToInitMap.split('-');
          expect(lineToInitMap).to.equal('C - 3 - 4');
          expect(+mapWidth).to.equal(3);
          expect(+mapHeight).to.equal(4);

          const game = new Game(+mapWidth, +mapHeight, fileLines);
          expect(game.width).to.equal(+mapWidth);
          expect(game.height).to.equal(+mapHeight);
        });
      });
});
  