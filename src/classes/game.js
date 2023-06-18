"use strict";

import { createMadredeDiosMap, cellTypes, orientations } from '../helpers/gameHelper.js';
import Mountain from './mountain.js';
import Treasure from './treasure.js';
import Adventurer from './adventurer.js';

export default class Game {
    constructor(width, height, fileLines) {
        this._madredeDiosMap = createMadredeDiosMap(+width, +height, cellTypes.PLAIN);
        this._gameLength = 0;
        this._mountains = [];
        this._treasures = [];
        this._adventurers = [];
    
        this._initializeMap(fileLines);
    }

    _initializeMap(fileLines) {
        fileLines.forEach(line => {
            const lineType = line[0];

            switch (lineType) {
                case cellTypes.MOUNTAIN:
                    this.addMountain(line);
                    break;
                case cellTypes.TREASURE:
                    this.addTreasure(line);
                    break;
                case cellTypes.ADVENTURER:
                    this.addAdventurer(line);
                    break
            }
        });
    }

    addMountain(line) {
        const [_, xAxis, yAxis] = line.split(' - ');
        const mountain = new Mountain(+xAxis, +yAxis);
    
        this.setMapPositionCellType(mountain, cellTypes.MOUNTAIN);
        this._mountains.push(mountain);
    }

    addTreasure(line) {
        const [_, xAxis, yAxis, nbrTreasures] = line.split(' - ');
        const treasure = new Treasure(+xAxis, +yAxis, +nbrTreasures);
    
        this.setMapPositionCellTreasure(treasure);
        this._treasures.push(treasure);
    }

    addAdventurer(line) {
        const [_, adventurerName, xAxis, yAxis, orientation, movements] = line.split(' - ');
        const adventurer = new Adventurer(adventurerName, +xAxis, +yAxis, orientation, movements);
    
        this.setMapPositionCellAdventurer(adventurer);
        
        if (adventurer.movements.length > this._gameLength) {
          this._gameLength = adventurer.movements.length;
        }
        this._adventurers.push(adventurer);
    }

    setMapPositionCellType(position, cellType) {
        const { xAxis, yAxis } = position;
        this._madredeDiosMap[yAxis][xAxis].type = cellType;
    }

    setMapPositionCellTreasure(treasure) {
        const { xAxis, yAxis } = treasure;
        this._madredeDiosMap[yAxis][xAxis].treasure = treasure;
    }

    setMapPositionCellAdventurer(adventurer) {
        const { xAxis, yAxis } = adventurer;
        if (this._madredeDiosMap[yAxis][xAxis].hasAdventurer === true) {
            throw new Error('Adventurers can not start from the same position !');
        }
        this._madredeDiosMap[yAxis][xAxis].hasAdventurer = true;
    }

    startExploringMap() {
        for (let round = 0; round < this._gameLength; round++) {
          this._adventurers = this.playRound(round);
        }
    }

    playRound(round) {
        return this._adventurers.map(adventurer => {
          const { xAxis: previousX, yAxis: previousY } = adventurer;
          const adventurerAfterMove = this.makeMove(adventurer, adventurer.movements[round]);
          const { xAxis: newX, yAxis: newY } = adventurerAfterMove;
    
          const newCell = this._madredeDiosMap[newY][newX];
          if (newCell.treasure && newCell.treasure.nbrTreasures && (newX !== previousX || newY !== previousY)) {
            adventurerAfterMove.nbrTreasures++;
            newCell.treasure.nbrTreasures--;
          }

          return adventurerAfterMove;
        });
    }

    makeMove(adventurer, moveType) {
        if (moveType === 'A') {
          const { xAxis, yAxis } = this.getNextPosition(adventurer);
          return this.isAbleToMove(xAxis, yAxis) ? { ...adventurer, xAxis, yAxis } : adventurer;
        }
    
        const { orientation } = adventurer;
        const newOrientation = this.getNextOrientation(orientation, moveType);
        return { ...adventurer, orientation: newOrientation };
    }

    getNextPosition(adventurer) {
      const { orientation, xAxis, yAxis } = adventurer;
    
      const positionMap = {
        [orientations.NORTH]: { xAxis, yAxis: yAxis - 1 > 0 ? yAxis - 1 : 0 },
        [orientations.SOUTH]: { xAxis, yAxis: yAxis + 1 >= this.height ? yAxis : yAxis + 1 },
        [orientations.EAST]: { yAxis, xAxis: xAxis + 1 >= this.width ? xAxis : xAxis + 1 },
        [orientations.WEST]: { yAxis, xAxis: xAxis - 1 > 0 ? xAxis - 1 : 0 },
      };
    
      return positionMap[orientation];
    }

    getNextOrientation(orientation, moveType) {
      const orientationMap = {
        [orientations.NORTH]: {
          'A': orientations.NORTH,
          'D': orientations.EAST,
          'G': orientations.WEST
        },
        [orientations.SOUTH]: {
          'A': orientations.SOUTH,
          'D': orientations.WEST,
          'G': orientations.EAST
        },
        [orientations.EAST]: {
          'A': orientations.EAST,
          'D': orientations.SOUTH,
          'G': orientations.NORTH
        },
        [orientations.WEST]: {
          'A': orientations.WEST,
          'D': orientations.NORTH,
          'G': orientations.SOUTH
        }
      };
    
      return orientationMap[orientation][moveType];
    }
    
    isAbleToMove(xAxis, yAxis) {
        const cell = this._madredeDiosMap[yAxis][xAxis];
        return !(cell.type === cellTypes.MOUNTAIN || cell.hasAdventurer);
    }

    get gameLength() {
        return this._gameLength;
    }
    
    get adventurers() {
        return this._adventurers;
    }
    
    get mountains() {
        return this._mountains;
    }
    
    get treasures() {
        return this._treasures;
    }
    
    get madredeDiosMap() {
      return this._madredeDiosMap;
    }

    get width() {
      return this._madredeDiosMap[0].length;
    }

    get height() {
      return this._madredeDiosMap.length;
    }
}
