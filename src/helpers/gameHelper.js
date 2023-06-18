"use strict";

export const createMadredeDiosMap = (width, height, plainCellType) => {
    let map = [];

    for (let row = 0; row < height; row++) {
        map[row] = [];

        for(let col = 0; col < width; col++) {
            map[row][col] = {
                type: plainCellType,
                hasAdventurer: false,
                treasure: undefined
            };
        }
    }

    return map;
};