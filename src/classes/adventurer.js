"use strict";

export default class Adventurer {
    constructor(adventurerName, xAxis, yAxis, orientation, movements) {
        this.adventurerName = adventurerName;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.orientation = orientation;
        this.movements = movements.split('');
        this.nbrTreasures = 0;
    }
}
