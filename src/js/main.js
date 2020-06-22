var stats = {nidoran: {hp:46, attack: 57, defense: 40, speed: 50, special: 40},
    nidoking: {hp:81, attack: 92, defense: 77, speed: 85, special: 75}};
var statExp = [
    {hp: 0, attack: 0, defense: 0, speed: 0, special: 0},
    {hp: 45, attack: 30, defense: 35, speed: 45, special: 20},
    {hp: 90, attack: 60, defense: 70, speed: 90, special: 40},
    {hp: 135, attack: 90, defense: 105, speed: 135, special: 60},
    {hp: 230, attack: 140, defense: 195, speed: 210, special: 105},
    {hp: 240, attack: 195, defense: 220, speed: 305, special: 150},
    {hp: 290, attack: 270, defense: 305, speed: 345, special: 180},
    {hp: 365, attack: 395, defense: 565, speed: 435, special: 240},
    {hp: 450, attack: 460, defense: 630, speed: 530, special: 280},
    {hp: 560, attack: 606, defense: 744, speed: 702, special: 365},
    {hp: 740, attack: 716, defense: 914, speed: 862, special: 455},
    {hp: 955, attack: 876, defense: 1104, speed: 1062, special: 595},
    {hp: 1030, attack: 1001, defense: 1243, speed: 1152, special: 695},
    {hp: 1150, attack: 1171, defense: 1403, speed: 1347, special: 826},
    {hp: 1330, attack: 1387, defense: 1608, speed: 1559, special: 966},
    {hp: 1570, attack: 1675, defense: 1844, speed: 1888, special: 1166},
    {hp: 1570, attack: 1675, defense: 1844, speed: 1888, special: 1166},
    {hp: 1570, attack: 1675, defense: 1844, speed: 1888, special: 1166}
];

function updateDVStatText() {
    var level = parseInt($('#level').val());
    var nidoEvolution = level < 17 ? "nidoran" : "nidoking";
    $('button:not(.d-none)').each(function() {
        var thisDV = $(this);
        var dv = parseInt(thisDV.attr("data-dv"));
        var dvType = thisDV.attr("data-dvtype");
        var newStat = Math.floor(Math.floor((stats[nidoEvolution][dvType]+dv)*2+Math.floor(Math.ceil(Math.sqrt(statExp[level-6][dvType]))/4))*level/100)+5;
        if (dvType === "hp") {
            newStat += level+5;
        }
        this.innerText = newStat;
    });
}

updateDVStatText();

$('.dvButtons').on('click', 'button', function () {
    updateDVStatText();
    var thisDV = $(this);
    var statChosen = this.innerText;
    var dvType = thisDV.attr("data-dvtype");
    $(`button[data-dvtype=${dvType}]`).each(function() {
        if (this.innerText != statChosen  && !thisDV.is(this)) {
            this.classList.add("d-none");
        }
    });
    //todo: remove HPs that are incompatible with known info
    //todo: consider eliminating "impossible" nidos
});

$('#level').on('change', function () {
    if (this.value < 6) this.value = 6;
    if (this.value > 23) this.value = 23;
    updateDVStatText()
});