addLayer("i", {
    name: "Infinity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "∞", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 3, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        fastestCrunch: new Decimal(31415926),
        timeInCurrentInfinity: new Decimal(0),
        infinities: new Decimal(0),
    }},
    nodeStyle() {
        return options.imageNode ? {
            'color': 'white',
            'background-image': 'url("resources/Infinity.webp")',
            'background-position': 'center center',
            'background-size': '100%',
            'border': '1px solid white'
        } : {
            'background-image': 'radial-gradient(circle at center, orange, #e3bb29)'
        }
    },
    color: "orange",
    requires: new Decimal(2).pow(1024), // Can be a function that takes requirement increases into account
    resource: "Infinity Points", // Name of prestige currency
    branches: ['h'],
    baseResource: "Arts", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.001, // Prestige currency exponent
    hotkeys: [ {key: "i", description: "I: Reset for Infinity points", onPress(){if (canReset(this.layer)) doReset(this.layer)}}, ],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    update(delta) {
        player.i.timeInCurrentInfinity = player.i.timeInCurrentInfinity.add(Decimal.times(new Decimal(1), delta))
    },
    upgrades: {


    },
    buyables: {


    },
    challenges: {


    },
    layerShown(){return player.i.infinities.gte(0.1)}
})
