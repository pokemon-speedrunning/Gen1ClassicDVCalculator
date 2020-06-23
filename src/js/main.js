const stats = {
    nidoran: { hp: 46, attack: 57, defense: 40, speed: 50, special: 40 },
    nidoking: { hp: 81, attack: 92, defense: 77, speed: 85, special: 75 }
};
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
    { hp: 740, attack: 716, defense: 914, speed: 862, special: 455 },
    { hp: 955, attack: 876, defense: 1104, speed: 1062, special: 595 },
    { hp: 1030, attack: 1001, defense: 1243, speed: 1152, special: 695 },
    { hp: 1150, attack: 1171, defense: 1403, speed: 1347, special: 826 },
    { hp: 1330, attack: 1387, defense: 1608, speed: 1559, special: 966 },
    { hp: 1570, attack: 1675, defense: 1844, speed: 1888, special: 1166 },
    { hp: 1570, attack: 1675, defense: 1844, speed: 1888, special: 1166 },
    { hp: 1570, attack: 1675, defense: 1844, speed: 1888, special: 1166 }
];
const dvBits = ["special", "speed", "defense", "attack"];
function createDVArray() {
    return [...Array(16)].map((x, i) => i);
}
function initialDVs() {
    return { hp: createDVArray(), attack: createDVArray(), defense: createDVArray(), speed: createDVArray(), special: createDVArray() }
}
let possibleDVs = initialDVs();

function bit_test(num, bit) {
    return ((num >> bit) % 2 != 0);
}

function arrayHasNumberWithBit(array, bit) {
    return !array.map(num => bit_test(num, bit)).some(x => x === true);
}

function arrayMissingNumberWithBit(array, bit) {
    return !array.map(num => bit_test(num, bit)).some(x => x === false);
}

function filterBitFromArray(array, bit) {
    return array.filter(num => !bit_test(num, bit));
}

function requireBitInArray(array, bit) {
    return array.filter(num => bit_test(num, bit));
}

function updatePossibleDVs() {
    for (var bit = 0; bit <=3; bit++) {
        //remove DVs incompatible with known HPs
        if (arrayHasNumberWithBit(possibleDVs["hp"], bit)) {
            possibleDVs[dvBits[bit]] = filterBitFromArray(possibleDVs[dvBits[bit]], 0);
        } else if (arrayMissingNumberWithBit(possibleDVs["hp"], bit)) {
            possibleDVs[dvBits[bit]] = requireBitInArray(possibleDVs[dvBits[bit]], 0);
        }
        //remove HP DVs that are incompatible with other DVs
        if (arrayHasNumberWithBit(possibleDVs[dvBits[bit]], 0)) {
            possibleDVs["hp"] = filterBitFromArray(possibleDVs["hp"], bit);
        } else if (arrayMissingNumberWithBit(possibleDVs[dvBits[bit]], 0)) {
            possibleDVs["hp"] = requireBitInArray(possibleDVs["hp"], bit);
        }
    }
    //repopulate the buttons
    let level = parseInt($('#level').val());
    let nidoEvolution = level < 17 ? "nidoran" : "nidoking";
    for (let dvType in possibleDVs) {
        let possibleDVsForType = possibleDVs[dvType];
        let possibleStats = possibleDVsForType.map((dv) => Math.floor(Math.floor((stats[nidoEvolution][dvType] + dv) * 2 + Math.floor(Math.ceil(Math.sqrt(statExp[level - 6][dvType])) / 4)) * level / 100) + 5);
        if (dvType === "hp") {
            possibleStats = possibleStats.map((stat) => stat + level + 5);
        }
        let dvList = $(`[data-dvtype="${dvType}"]`);
        dvList.find('.form-row').remove();
        [...new Set(possibleStats)].forEach(stat => {
            let lowDV = possibleDVsForType[possibleStats.indexOf(stat)];
            let highDV = possibleDVsForType[possibleStats.lastIndexOf(stat)];
            let dvRange = lowDV === highDV ? highDV : `${lowDV}-${highDV}`;
            let impossibleDVsThisStat = possibleDVsForType.filter((dv, index) => possibleStats[index] != stat);
            dvList.append(`<div class="form-row form-group"><label class="col-form-label col-md-6 text-center" for="${dvRange}">${dvRange}</label><button class="form-control col-md-6 btn btn-primary" type="button" id="${dvRange}" data-removedvs="[${impossibleDVsThisStat}]" data-dvtype="${dvType}">${stat}</button></div>`);
        });
    }
}

updatePossibleDVs();

$('.dvButtons').on('click', 'button', function () {
    let thisButton = $(this);
    let removeDVs = thisButton.data("removedvs");
    let dvType = thisButton.data("dvtype");
    possibleDVs[dvType] = possibleDVs[dvType].filter(dv => !removeDVs.includes(dv));
    updatePossibleDVs();
    //todo: consider eliminating "impossible" nidos
});

$('#level').on('change', function () {
    if (this.value < 6) this.value = 6;
    if (this.value > 23) this.value = 23;
    updatePossibleDVs();
});
$('#reset').on('click', function () {
    possibleDVs = initialDVs();
    $('#level').val(6);
    updatePossibleDVs();
})