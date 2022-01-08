


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
    branches: ["y2"],
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.66, // Prestige currency exponent
    softcap: new Decimal(1e6), 
    softcapPower(){return new Decimal(1).div(player.points.add(10).log(1e34))
    },
    milestones: {
            0: {requirementDescription: "1e10 Knowledge",
                done() {return player[this.layer].best.gte(1e10)}, // Used to determine when to give the milestone
                effectDescription: "Get a boost on everything in this layer",
                effect() {
                    return player[this.layer].points.add(1).pow(0.07)
                },
                effect() {
                    return player.points.add(1).pow(0.12)
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
        if (hasUpgrade('a', 31)) mult = mult.times(upgradeEffect('a',21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        exp = exp.add(tmp.d.effect.log(10))
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "1", description: "1: Reset for Knowledge", onPress(p){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    resetsNothing() {
        return hasMilestone("c", 0)
        },
        
    autoPrestige() {
         return hasMilestone("c", 0)
        },
    doReset(resettingLayer) {
         let keep = []
         if (hasMilestone("c", 0)) keep.push("upgrades")
         if (hasMilestone("c", 0)) keep.push("milestones")
         if (layers[resettingLayer].row > this.row) layerDataReset("a", keep)
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
                let power_a12 = new Decimal(Math.log(player[this.layer].points.add(1).pow(0.49))).times(100).add(1)
                if (hasUpgrade('a', 32)) power_a12 = power_a12.times(new Decimal(upgradeEffect('a', 32))) 
                if (hasUpgrade('a', 33)) power_a12 = power_a12.times(new Decimal(upgradeEffect('a', 33))) 
                return power_a12
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
            
        },
        13: {
            unlocked() { return (hasUpgrade(this.layer, 12))},
            title: "Synergy",
            description: "Gain more knowledge based on your points.",
            cost: new Decimal(100),
            effect() {
                let power_a13 = new Decimal(Math.log(player.points.add(1).pow(0.21))).add(1)
                if (hasAchievement('b', 13)) power_a13 = player.points.add(2).pow(0.21)
                if (hasUpgrade('a', 33)) power_a13 = power_a13.times(new Decimal(upgradeEffect('a', 33))) 
                softcap(power_a13, new Decimal(1e30), new Decimal(1).div(Math.log(power_a13)))
                return power_a13
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        14: {
            unlocked() { return (hasUpgrade(this.layer, 12))},
            title: "Optimisation I",
            description: "Gain more knowledge and points synergized together.",
            cost: new Decimal(1000),
            effect() {
                let power_a141 = player.points.add(1).pow(0.55)
                if (hasUpgrade('a', 33)) power_a141 = power_a141.times(new Decimal(upgradeEffect('a', 33))) 
                return power_a141
                
            },
            effect() {
                let power_a142 = player[this.layer].points.add(1).pow(0.27)
                if (hasUpgrade('a', 33)) power_a142 = power_a142.times(new Decimal(upgradeEffect('a', 33))) 
                return power_a142
            },
        },
        21: {
            unlocked() { return (hasUpgrade(this.layer, 14))},
            title: "Project Stellosphere",
            description: "Gain more points based on best Stars you have (Which can be obtained in Year 2016).",
            cost: new Decimal(7500),
            effect() {
                let power_a21 = new Decimal (2).pow(player.c.best).pow(0.2)
                if (hasChallenge('c', 12)) power_a21 = power_a21.times(player.points.add(1)).pow(0.1)
                if (hasUpgrade('a', 31)) power_a21 = power_a21.times(upgradeEffect('a', 31))
                if (hasUpgrade('a', 33)) power_a21 = power_a21.times(new Decimal(upgradeEffect('a', 33))) 
                softcap(power_a21, new Decimal(1e10), new Decimal(1).div(power_a21.pow(0.3)))
                return power_a21
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        22: {
            unlocked() { return (hasUpgrade(this.layer, 21))},
            title: "Village Searching",
            description: "Gain more knowledge based on your achievements.",
            cost: new Decimal(1e19),
            effect() {
                let power_a22 = new Decimal (2).pow(player.b.points).pow(0.2)
                if (hasChallenge('c', 12)) power_a22 = power_a22.times(player.points.add(1)).pow(0.1)
                if (hasUpgrade('a', 33)) power_a22 = power_a22.times(new Decimal(upgradeEffect('a', 33))) 
                softcap(power_a22, new Decimal(1e10), new Decimal(1).div(power_a22.pow(0.3)))
                return power_a22
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        23: {
            unlocked() { return (hasUpgrade(this.layer, 22))},
            title: "Premiere",
            description: "Gain more points based on your Y2-challenge completion.",
            cost: new Decimal(1e23),
            effect() {
                let power_a23 = new Decimal (2).pow(Object.values(player.c.challenges).reduce((a,b) => a+b)).pow(6)
                if(hasUpgrade('d', 12)) power_a23 = power_a23.times(upgradeEffect('d', 12))
                if (hasUpgrade('a', 33)) power_a23 = power_a23.times(new Decimal(upgradeEffect('a', 33))) 
                softcap(power_a23, new Decimal(1e10), new Decimal(1).div(Math.log(power_a23)))
                return power_a23
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        24: {
            unlocked() { return (hasUpgrade(this.layer, 23))},
            title: "Loyalty I",
            description: "Star boosts are stronger based on your knowledge.",
            cost: new Decimal(1e27),
            effect() {
                let power_a24 = new Decimal (1).times(player.a.points).pow(0.1).add(1)
                if (hasUpgrade('a', 33)) power_a24 = power_a24.times(new Decimal(upgradeEffect('a', 33))) 
                softcap(power_a24, new Decimal(1e10), new Decimal(1).div(Math.log(power_a24)))
                return power_a24
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        31: {
            unlocked() { return (hasUpgrade(this.layer, 24))},
            title: "Stronger spaceship",
            description: "Upgrade 'Project Stellosphere' is stronger based on your Stars, and can now boost Knowledge gain.",
            cost: new Decimal(1e33),
            effect() {
                let power_a31 = new Decimal (1).times(2).pow(player.c.points)
                if (hasUpgrade('a', 33)) power_a31 = power_a31.times(new Decimal(upgradeEffect('a', 33))) 
                softcap(power_a31, new Decimal(1e4), new Decimal(1).div(Math.log(Math.log(power_a31.add(10)))))
                return power_a31
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        32: {
            unlocked() { return (hasUpgrade(this.layer, 24))},
            title: "Inspiration II",
            description: "Boost upgrade 'Inspiration I further' based on your Ideas.",
            cost: new Decimal(1e149),
            currencyDisplayName: "points",
            currencyInternalName: "points",
            currencyLocation: player,
            effect() {
                let power_a32 = new Decimal (10).pow(player.d.points).add(1)
                if (hasUpgrade('a', 33)) power_a32 = power_a32.times(new Decimal(upgradeEffect('a', 33))) 
                softcap(power_a32, new Decimal(1e10), new Decimal(1).div(power_a32.log(10)))
                return power_a32
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        33: {
            unlocked() { return (hasUpgrade(this.layer, 24))},
            title: "ERROR 404",
            description: "Imply a global boost to Year 1 and 2 upgrades based on your points (except for upgrade 'Origin').",
            cost: new Decimal('1e404'),
            currencyDisplayName: "points",
            currencyInternalName: "points",
            currencyLocation: player,
            effect() {
                let power_a33 = new Decimal (1).times(player.points).pow(0.01).add(1)
                softcap(power_a33, new Decimal(1e10), new Decimal(1).div(Math.log(power_a33)))
                return power_a33
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        34: {
            unlocked() { return (hasUpgrade(this.layer, 24))},
            title: "Placeholder",
            description: "Placeholder",
            cost: new Decimal(1e6969),
            effect() {
                let power_a34 = new Decimal (1).times(player.a.points).pow(0.1).add(1)
                softcap(power_a34, new Decimal(1e10), new Decimal(1).div(Math.log(power_a34)))
                return power_a34
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
    },
    
})

