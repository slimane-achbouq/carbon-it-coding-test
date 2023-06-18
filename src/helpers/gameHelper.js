"use strict";

export const orientations = {
    NORTH: 'N',
    SOUTH: 'S',
    EAST: 'E',
    WEST: 'O'
};

export const cellTypes = {
    MOUNTAIN: 'M',
    TREASURE: 'T',
    ADVENTURER: 'A',
    PLAIN: 'P',
};

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

export const prepareOutputData = gameObject => {
    let outputString = '# {C comme Carte} - {Nb. de case en largeur} - {Nb. de case en hauteur}\n';
    outputString += `C - ${gameObject.width} - ${gameObject.height}\n`;

    outputString += gameObject.mountains?.length > 0 ? '# {M comme Montagne} - {Axe horizontal} - {Axe vertical}\n' : '';
    for (const mountain of gameObject.mountains) {
        outputString += `M - ${mountain.xAxis} - ${mountain.yAxis}\n`;
    }

    outputString += gameObject.treasures?.length > 0 ? '# {T comme Trésor} - {Axe horizontal} - {Axe vertical} - {Nb. de trésors restants}\n' : '';
    for (const treasure of gameObject.treasures) {
        outputString += treasure.nbrTreasures ? `T - ${treasure.xAxis} - ${treasure.yAxis} - ${treasure.nbrTreasures}\n` : '';
    }

    outputString += gameObject.adventurers?.length > 0 ? '# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axevertical} - {Orientation} - {Nb. trésors ramassés}\n' : '';
    for (const adventurer of gameObject.adventurers) {
        outputString += `A - ${adventurer.adventurerName} - ${adventurer.xAxis} - ${adventurer.yAxis} - ${adventurer.orientation} - ${adventurer.nbrTreasures}\n`;
    }

    return outputString;
}
