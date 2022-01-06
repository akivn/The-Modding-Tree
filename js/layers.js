addLayer("a", {
    name: "Year 1 (2015)", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Y1", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ff0000",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Knowledge", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.66, // Prestige currency exponent
    softcap: new Decimal(1e6), 
        softcapPower: new Decimal(0.48),
    milestones: {
            0: {requirementDescription: "1e10 Knowledge",
                done() {return player[this.layer].best.gte(1e10)}, // Used to determine when to give the milestone
                effectDescription: "Get a boost on everything in this layer",
                effect() {
                    return player[this.layer].points.add(1).pow(0.22)
                },
                effect() {
                    return player.points.add(1).pow(0.21)
                },
            },
            1: {requirementDescription: "1e450 Knowledge",
                unlocked() {return hasMilestone(this.layer, 0)},
                done() {return player[this.layer].best.gte(1e450)},
                effectDescription: "Year 2 prestiges resets nothing",
                },
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('a', 13)) mult = mult.times(upgradeEffect('a',13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "1", description: "1: Reset for Knowledge", onPress(p){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    resetsNothing() {
        return hasMilestone("c", 1)
        },
        
    layerShown(){return true},
    
    upgrades:{
        11: {
            title: "Origin",
            description: "Gain 2.4x more points per second.",
            cost: new Decimal(1),
            unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
                branches: [12],
        },
        12: {
            unlocked() { return (hasUpgrade(this.layer, 11))},
            title: "Inspiration I",
            description: "Gain more points based on your knowledge points.",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(1).pow(0.35)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        13: {
            unlocked() { return (hasUpgrade(this.layer, 12))},
            title: "Synergy",
            description: "Gain more knowledge based on your points.",
            cost: new Decimal(3),
            effect() {
                return player.points.add(1).pow(0.21)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        14: {
            unlocked() { return (hasUpgrade(this.layer, 12))},
            title: "Optimisation I",
            description: "Gain more knowledge and points synergized together.",
            cost: new Decimal(11),
            effect() {
                return player.points.add(1).pow(0.19)
            },
            effect() {
                return player[this.layer].points.add(1).pow(0.14)
            },
        },
        21: {
            unlocked() { return (hasUpgrade(this.layer, 14))},
            title: "Project Stellosphere",
            description: "Gain more points based on best Stars you have (Which can be obtained in Year 2016).",
            cost: new Decimal(50),
            effect() {
                return player.points.pow(player.c.best).pow(0.063).add(10)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        22: {
            unlocked() { return (hasUpgrade(this.layer, 14))},
            title: "Village Searching",
            description: "Gain more knowledge based on your achievements.",
            cost: new Decimal(1e7),
            effect() {
                return player[this.layer].points.add(1).pow(player.b.points)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
    },
    
})
addLayer("b", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "achievement power", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "2015 - The knowledge is growing",
            done() {return (hasUpgrade('a', 11))},  // This one is a freebie
            goalTooltip: "Get your first upgrade.", // Shows when achievement is not completed
            effect() {
                return player[this.layer].points.add(1)
            },
        },
    },
},)
addLayer("c", {
    name: "Year 2 (2016)", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Y2", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ff0000",
    requires: new Decimal(1e6), // Can be a function that takes requirement increases into account
    resource: "Stars", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.03, // Prestige currency exponent
    softcap: new Decimal(8), 
        softcapPower: new Decimal(0.72),
    effect(){
        return Decimal.pow(2, player[this.layer].points)
  /*
    you should use this.layer instead of <layerID>
    Decimal.pow(num1, num2) is an easier way to do
    num1.pow(num2)
  */
},
    milestones: {
            0: {requirementDescription: "10 Stars",
                done() {return player[this.layer].best.gte(16)}, // Used to determine when to give the milestone
                effectDescription: "Get a boost on everything in this layer",
                effect() {
                    return player[this.layer].points.add(1).pow(0.22)
                },
                effect() {
                    return player.points.add(1).pow(0.21)
                },
            },
            1: {requirementDescription: "14 Stars",
                unlocked() {return hasMilestone(this.layer, 0)},
                done() {return player[this.layer].best.gte(34)},
                effectDescription: "Year 2 prestiges resets nothing",
                },
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "2", description: "2: Reset for Stars", onPress(p){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    
    layerShown(){return true},
})