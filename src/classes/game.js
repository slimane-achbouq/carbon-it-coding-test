"use strict";

import { createMadredeDiosMap } from '../helpers/gameHelper.js';

export default class Game {
    constructor(width, height, fileLines) {
        this._madredeDiosMap = createMadredeDiosMap(+width, +height, 'P');
        this._gameLength = 0;
        this._mountains = [];
        this._treasures = [];
        this._adventurers = [];
    }

    get width() {
        return this._madredeDiosMap[0].length;
      }
  
      get height() {
        return this._madredeDiosMap.length;
      }
}