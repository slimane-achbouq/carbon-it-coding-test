import { readFileSync, existsSync, unlinkSync } from 'fs';
import { expect } from 'chai';
import { readInputFile, writeOutputFile } from '../helpers/fileIOHelper.js';
import Game from '../classes/game.js';
import Treasure from '../classes/treasure.js';
import Adventurer from '../classes/adventurer.js';
import { OUTPUT_FILE_PATH } from '../../config.js';

describe('Game', () => {
  let game;
  let mockFileLines = [];

  describe('Parsing files', () => {
    it('should read input file correctly', () => {
      const fileLines = readInputFile();
      const lineToInitMap = fileLines.find(line => line.startsWith('C'));
      const [ _, mapWidth, mapHeight] = lineToInitMap.split('-');
      expect(lineToInitMap).to.equal('C - 3 - 4');
      expect(+mapWidth).to.equal(3);
      expect(+mapHeight).to.equal(4);

      mockFileLines = fileLines;
    });

    it('should write output file', () => {
      expect(existsSync(OUTPUT_FILE_PATH)).to.be.false;
      writeOutputFile(game);
      expect(existsSync(OUTPUT_FILE_PATH)).to.be.true;
      
      const outputFileLines = readFileSync(OUTPUT_FILE_PATH, 'utf8').split('\n');
      const mountains = outputFileLines.filter(line => line.startsWith('M'));
      expect(mountains.length).to.be.equal(2);
      expect(mountains[0]).to.be.equal('M - 1 - 0');
      expect(mountains[1]).to.be.equal('M - 2 - 1');
      expect(outputFileLines.find(line => line.startsWith('C'))).to.equal('C - 3 - 4');
      expect(outputFileLines.find(line => line.startsWith('A'))).to.equal('A - Lara - 1 - 1 - S - 0');
    });

    after(() => {
      unlinkSync(OUTPUT_FILE_PATH);
    });
  });

  beforeEach(() => {
    game = new Game(3, 4, mockFileLines);
  });

  describe('Initialization', () => {
    it('should create the game with the specified width and height', () => {
      expect(game.madredeDiosMap[0].length).to.equal(3);
      expect(game.madredeDiosMap.length).to.equal(4);
    });

    it('should add mountains to the game', () => {
      expect(game.mountains).to.have.lengthOf(2);
      expect(game.mountains[0]).to.deep.equal({ xAxis: 1, yAxis: 0 });
      expect(game.mountains[1]).to.deep.equal({ xAxis: 2, yAxis: 1 });
    });

    it('should add treasures to the game', () => {
      expect(game.treasures).to.have.lengthOf(2);
      expect(game.treasures[0]).to.deep.equal({ xAxis: 0, yAxis: 3, nbrTreasures: 2 });
      expect(game.treasures[1]).to.deep.equal({ xAxis: 1, yAxis: 3, nbrTreasures: 3 });
    });

    it('should add adventurers to the game', () => {
      expect(game.adventurers).to.have.lengthOf(1);
      expect(game.adventurers[0]).to.deep.equal({
        adventurerName: 'Lara',
        xAxis: 1,
        yAxis: 1,
        orientation: 'S',
        movements: ['A', 'A', 'D', 'A', 'D', 'A', 'G', 'G', 'A'],
        nbrTreasures: 0
      });
    });
  });

  describe('Map Operations', () => {
    it('should set map position cell type correctly', () => {
      expect(game._madredeDiosMap[2][1].type).to.equal('P');
      game.setMapPositionCellType({ xAxis: 1, yAxis: 2 }, 'M');
      expect(game._madredeDiosMap[2][1].type).to.equal('M');
    });

    it('should set map position cell treasure correctly', () => {
      const treasure = new Treasure(1, 2, 2);
      game.setMapPositionCellTreasure(treasure);
      expect(game._madredeDiosMap[2][1].treasure).to.deep.equal(treasure);
    });

    it('should set map position cell adventurer correctly', () => {
      expect(game._madredeDiosMap[2][1].hasAdventurer).to.be.false;
      const adventurer = new Adventurer('Slimane', 2, 2, 'S', 'AADADAGGA');
      game.setMapPositionCellAdventurer(adventurer);
      expect(game._madredeDiosMap[1][1].hasAdventurer).to.be.true;
    });
  });

  describe('Game play', () => {
    it('should make a move for the adventurer', () => {
      const adventurer = game.adventurers[0];
      const newAdventurer = game.makeMove(adventurer, 'A');

      expect(newAdventurer.xAxis).to.equal(1);
      expect(newAdventurer.yAxis).to.equal(2);
    });

    it('should update the game state after a round of play', () => {
      game.startExploringMap();
      const adventurer = game.adventurers[0];

      expect(adventurer.xAxis).to.equal(0);
      expect(adventurer.yAxis).to.equal(3);
      expect(adventurer.nbrTreasures).to.equal(3);
      expect(adventurer.orientation).to.equal('S');
      expect(game._treasures[0].nbrTreasures).to.equal(0);
      expect(game._treasures[1].nbrTreasures).to.equal(2);
    });
  });
});
