const starterStats = {
    nidoran: { startingLevel: 1, hp: 46, attack: 57, defense: 40, speed: 50, special: 40 },
    nidoking: { startingLevel: 17, hp: 81, attack: 92, defense: 77, speed: 85, special: 75 }
};
const runInfo = { startingLevel: 3, lastUsefulLevel: 14}
const statExp = [
    { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
    { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
    { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
    { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
    { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
    { hp: 17, attack: 22, defense: 80, speed: 35, special: 15 },
    { hp: 62, attack: 52, defense: 115, speed: 80, special: 35 },
    { hp: 102, attack: 87, defense: 145, speed: 130, special: 55 },
    { hp: 177, attack: 173, defense: 215, speed: 247, special: 100 },
    { hp: 212, attack: 233, defense: 259, speed: 302, special: 140 },
    { hp: 342, attack: 323, defense: 374, speed: 432, special: 205 },
    { hp: 487, attack: 393, defense: 519, speed: 537, special: 275 }
];
const hpdvBits = ["special", "speed", "defense", "attack"];

function createDVArray() {
    return [...Array(16)].map((x, i) => i);
}

function initialDVs() {
    return { hp: createDVArray(), attack: createDVArray(), defense: createDVArray(), speed: createDVArray(), special: createDVArray() }
}

function bit_test(num, bit) {
    return ((num >> bit) % 2 != 0);
}

function allNumbersHaveBit(array, bit) {
    return !array.map(num => bit_test(num, bit)).some(x => x === true);
}

function noNumbersHaveBit(array, bit) {
    return !array.map(num => bit_test(num, bit)).some(x => x === false);
}

function removeNumbersWithBit(array, bit) {
    return array.filter(num => !bit_test(num, bit));
}

function removeNumbersWithoutBit(array, bit) {
    return array.filter(num => bit_test(num, bit));
}

function updatePossibleDVs() {
    for (var bit = 0; bit <=3; bit++) {
        //remove DVs incompatible with known HPs
        if (allNumbersHaveBit(possibleDVs["hp"], bit)) {
            possibleDVs[hpdvBits[bit]] = removeNumbersWithBit(possibleDVs[hpdvBits[bit]], 0);
        } else if (noNumbersHaveBit(possibleDVs["hp"], bit)) {
            possibleDVs[hpdvBits[bit]] = removeNumbersWithoutBit(possibleDVs[hpdvBits[bit]], 0);
        }
        //remove HP DVs that are incompatible with other DVs
        if (allNumbersHaveBit(possibleDVs[hpdvBits[bit]], 0)) {
            possibleDVs["hp"] = removeNumbersWithBit(possibleDVs["hp"], bit);
        } else if (noNumbersHaveBit(possibleDVs[hpdvBits[bit]], 0)) {
            possibleDVs["hp"] = removeNumbersWithoutBit(possibleDVs["hp"], bit);
        }
    }
    //repopulate the buttons
    let level = parseInt($('#level').val());
    let starterEvolution = "";
    for (starter in starterStats) {
        if (starterStats[starter].startingLevel < level) {
            starterEvolution = starter;
        }
    }
    for (let dvType in possibleDVs) {
        let possibleDVsForType = possibleDVs[dvType];
        let possibleStats = possibleDVsForType.map((dv) => Math.floor(Math.floor((starterStats[starterEvolution][dvType] + dv) * 2 + Math.floor(Math.ceil(Math.sqrt(statExp[level - runInfo.startingLevel][dvType])) / 4)) * level / 100) + 5);
        if (dvType === "hp") {
            possibleStats = possibleStats.map((stat) => stat + level + 5);
        }
        let statList = $(`[data-statType="${dvType}"] .btn-group-vertical`);
        statList.find('button').remove();
        let dvList = $(`[data-dvType="${dvType}"]`).find('.dvRange').empty();
        let lowestPossibleDV = possibleDVsForType[0];
        let highestPossibleDV = possibleDVsForType[possibleDVsForType.length-1];
        dvList.append(lowestPossibleDV === highestPossibleDV ? lowestPossibleDV : `${lowestPossibleDV}-${highestPossibleDV}`);
        [...new Set(possibleStats)].forEach(stat => {
            let impossibleDVsThisStat = possibleDVsForType.filter((dv, index) => possibleStats[index] != stat);
            statList.append(`<button class="btn btn-primary" type="button" data-removedvs="[${impossibleDVsThisStat}]" data-dvtype="${dvType}">${stat}</button`);
        });
    }
}

$('.dvButtons').on('click', 'button', function () {
    let thisButton = $(this);
    let dvType = thisButton.data("dvtype");
    possibleDVs[dvType] = possibleDVs[dvType].filter(dv => !thisButton.data("removedvs").includes(dv));
    updatePossibleDVs();
    //todo: consider eliminating "impossible" nidos
});

$('#level').on('change', function () {
    if (this.value < runInfo.startingLevel) this.value = runInfo.startingLevel;
    if (this.value > runInfo.lastUsefulLevel) this.value = runInfo.lastUsefulLevel;
    updatePossibleDVs();
});

$('#decrementLevel').on('click', function () {
    let currentLevel = $('#level').val();
    if (currentLevel > runInfo.startingLevel) {
        $('#level').val(--currentLevel);
    }
    updatePossibleDVs();
});

$('#incrementLevel').on('click', function () {
    let currentLevel = $('#level').val();
    if (currentLevel < runInfo.lastUsefulLevel) {
        $('#level').val(++currentLevel);
    }
    updatePossibleDVs();
});

$('#reset').on('click', function () {
    possibleDVs = initialDVs();
    $('#level').val(runInfo.startingLevel);
    updatePossibleDVs();
});

let possibleDVs = initialDVs();
updatePossibleDVs();