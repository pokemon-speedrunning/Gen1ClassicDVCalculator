const starterStats = {
    nidoran: { startingLevel: 1, hp: 46, attack: 57, defense: 40, speed: 50, special: 40 },
    nidoking: { startingLevel: 17, hp: 81, attack: 92, defense: 77, speed: 85, special: 75 }
};
const runInfo = { startingLevel: 6, lastUsefulLevel: 23}
const statExp = [
    { hp: 0, attack: 0, defense: 0, speed: 0, special: 0 },
    { hp: 45, attack: 30, defense: 35, speed: 45, special: 20 },
    { hp: 90, attack: 60, defense: 70, speed: 90, special: 40 },
    { hp: 135, attack: 90, defense: 105, speed: 135, special: 60 },
    { hp: 230, attack: 140, defense: 195, speed: 210, special: 105 },
    { hp: 240, attack: 195, defense: 220, speed: 305, special: 150 },
    { hp: 290, attack: 270, defense: 305, speed: 345, special: 180 },
    { hp: 365, attack: 395, defense: 565, speed: 435, special: 240 },
    { hp: 450, attack: 460, defense: 630, speed: 530, special: 280 },
    { hp: 560, attack: 606, defense: 744, speed: 702, special: 365 },
    { hp: 731, attack: 769, defense: 909, speed: 899, special: 475 },
    { hp: 891, attack: 959, defense: 1109, speed: 1044, special: 600 },
    { hp: 1006, attack: 1129, defense: 1283, speed: 1224, special: 740 },
    { hp: 1136, attack: 1329, defense: 1493, speed: 1369, special: 861 },
    { hp: 1306, attack: 1505, defense: 1643, speed: 1591, special: 991 },
    { hp: 1506, attack: 1758, defense: 1849, speed: 1870, special: 1171 },
    { hp: 1506, attack: 1758, defense: 1849, speed: 1870, special: 1171 },
    { hp: 1506, attack: 1758, defense: 1849, speed: 1870, special: 1171 }
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
        let statList = $(`[data-statType="${dvType}"]`);
        statList.find('.form-row').remove();
        let dvList = $(`[data-dvType="${dvType}"]`).find('.dvRange').empty();
        let lowestPossibleDV = possibleDVsForType[0];
        let highestPossibleDV = possibleDVsForType[possibleDVsForType.length-1];
        dvList.append(lowestPossibleDV === highestPossibleDV ? lowestPossibleDV : `${lowestPossibleDV}-${highestPossibleDV}`);
        [...new Set(possibleStats)].forEach(stat => {
            let lowDV = possibleDVsForType[possibleStats.indexOf(stat)];
            let highDV = possibleDVsForType[possibleStats.lastIndexOf(stat)];
            let dvRange = lowDV === highDV ? highDV : `${lowDV}-${highDV}`;
            let impossibleDVsThisStat = possibleDVsForType.filter((dv, index) => possibleStats[index] != stat);
            statList.append(`<div class="form-row form-group"><label class="col-form-label col-md-6 text-center" for="${dvRange}">${dvRange}</label><button class="form-control col-md-6 btn btn-primary" type="button" id="${dvRange}" data-removedvs="[${impossibleDVsThisStat}]" data-dvtype="${dvType}">${stat}</button></div>`);
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