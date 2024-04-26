addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        auto1: false,
    }},
    branches: [
		["l", function() { return player.l.unlocked ? "#c0c0c0" : "#303030" }, 25],
	],
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 11)) mult = mult.times(upgradeEffect('p', 11))
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        mult = mult.times(buyableEffect('p', 12))
        mult = mult.times(tmp.l.effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        let effect = new Decimal(1)
        effect = (player[this.layer].points.add(1)).pow(new Decimal(1.1).div(new Decimal(1).add(player[this.layer].points.add(1).log(10).div(4))))
        return effect
    },
    effectDescription(){
            return "boosting points gain by x" + format(tmp[this.layer].effect)        
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Boost I",
            description: "Boost your Prestige Point gain based on your points.",
            cost: new Decimal(2),
            effect() {
                let power = new Decimal(player.points.add(5).log(5))
                if (hasUpgrade('p', 21)) power = power.times(2)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return true
            },
        },
        12: {
            title: "Boost II",
            description: "Boost your Point gain based on time played.",
            cost: new Decimal(20),
            effect() {
                let power = new Decimal(player.timePlayed).pow(0.22)
                if (hasUpgrade('p', 22)) power = power.times(2)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return hasUpgrade('p', 11)
            },
        },
        13: {
            title: "Boost III",
            description: "Boost your Prestige point gain based on your prestige points.",
            cost: new Decimal(100),
            effect() {
                let cap = new Decimal(2)
                let power = new Decimal(player[this.layer].points).add(5).log(new Decimal(cap).add(new Decimal(5).div(player[this.layer].points.log(10))))
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return hasUpgrade('p', 12)
            },
        },
        21: {
            title: "Boost Ia",
            description: "Boost the above upgrade by 2.",
            cost: new Decimal(2000),
            effect() {
                let power = new Decimal(2)
                return power
            },
            unlocked(){
                return hasUpgrade('p', 13)
            },
        },
        22: {
            title: "Boost IIa",
            description: "Boost the above upgrade by 2.",
            cost: new Decimal(4000),
            effect() {
                let power = new Decimal(2)
                return power
            },
            unlocked(){
                return hasUpgrade('p', 13)
            },
        },
        23: {
            title: "Unlock!",
            description: "Unlock Generators.",
            cost: new Decimal(10000),
            unlocked(){
                return hasUpgrade('p', 13)
            },
        },
        31: {
            title: "Light Absorber",
            description: "Improve Light Particle gain based on your points.",
            cost: new Decimal(2e16),
            effect() {
                let power = player.points.add(10).log(10).div(3)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasMilestone("lp",0))
            },
        },
        32: {
            title: "Effienciency",
            description: "Boost the base of Prestige Powerer based on how many Lights you have.",
            cost: new Decimal(1e18),
            effect() {
                let power = player.l.points.div(2.5)
                return power
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                return (hasMilestone("lp",0))
            },
        },
        33: {
            title: "Light Absorber II",
            description: "Improve Light Particle gain based on your Prestige points.",
            cost: new Decimal(1e21),
            effect() {
                let power = player.p.points.pow(0.035)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasMilestone("lp",0))
            },
        },
        34: {
            title: "Unlock! II",
            description: "Unlock Challenges.",
            cost: new Decimal(1e24),
            unlocked(){
                return (hasMilestone("lp",0))
            },
        },
    },
    buyables: {
        11: {
            title: "Point Powerer",
            cost(x) { 
                let cost = new Decimal(2).pow(x).times(10000)
                return cost 
            },
            effect(x){
                let base = new Decimal(4)
                let power = new Decimal(1).mul(x.add(1).pow(1.4))
                if(hasUpgrade('l', 11)) power = new Decimal(base).pow(x.pow(0.7))
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Prestige points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies point gain by " + format(buyableEffect(this.layer, this.id))+"x"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        12: {
            title: "Prestige Powerer",
            cost(x) { 
                let cost = (new Decimal(4).add(x.div(2))).pow(x).times(100000)
                return cost 
            },
            effect(x){
                let base = new Decimal(5)
                if(hasUpgrade('p', 32)) base = base.add(upgradeEffect('p', 32))
                let power = new Decimal(1).mul(x.add(1).pow(1.2))
                if(hasUpgrade('l', 12)) power = new Decimal(base).pow(x.pow(0.58))
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Prestige points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Prestige point gain by " + format(buyableEffect(this.layer, this.id))+"x"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            autoBuy() {
                return (false)
            },
            unlocked(){
                return (getBuyableAmount('p', 11).gte(1))
            },
        },

    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "upgrades",
            ],
        },
        "Generators": {
            content: [
                "main-display",
                "prestige-button",
                "buyables",
            ],
            unlocked() {
                return (hasUpgrade("p", 23))
            },
        },
    },
    automate() {
        if(player.p.auto1) buyBuyable("p",11)
    },
    doReset(resettingLayer) {
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
    },

    layerShown(){return true}
})
