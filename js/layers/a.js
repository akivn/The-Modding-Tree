addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    name: "Year 1",
    symbol: "Y1",
    color: "#4080b0",                       // The color for this layer, which affects many elements.
    resource: "brain cells",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
    branches: 'b',
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,  
    hotkeys: [
        {
            key: "1", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "1: reset your points for brain cells", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.a.unlocked) doReset("a") }, // Determines if you can use the hotkey, optional
        }
    ],               // "normal" prestige gain is (currency^exponent).

    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade('a', 13)) mult = mult.times(upgradeEffect('a', 13))   
        if (getBuyableAmount('a', 11) >= 1 && hasUpgrade('a', 23)) mult = mult.times(buyableEffect('a', 11).pow(0.1))
        if (getBuyableAmount('a', 12) >= 1 && hasUpgrade('a', 23)) mult = mult.times(buyableEffect('a', 12).pow(0.1)) 
        if (getBuyableAmount('a', 21) >= 1 && hasUpgrade('a', 23) && hasChallenge('a', 11)) mult = mult.times(buyableEffect('a', 21).pow(0.1))     
        if (hasUpgrade('b', 12)) mult = mult.times(upgradeEffect('b', 12))
        softcap(mult, new Decimal(1e63), new Decimal(1).div(player.a.points.div(1e63).add(10).log(1e3)))
        if (hasUpgrade('b', 13)) mult = mult.times(new Decimal(1e20))   
        // Returns your multiplier to your gain of the prestige resource.
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true }, 

    passiveGeneration() {
        return hasMilestone("a", 2) ? 1:0
        },
    doReset(resettingLayer) {
        let keep = []
        if (hasMilestone("b", 2)) keep.push("upgrades")
        if (hasMilestone("b", 2)) keep.push("milestones")
        if (hasMilestone("b", 3)) keep.push("buyables")
        if (layers[resettingLayer].row > this.row) layerDataReset("a", keep)
       },
    upgrades: {
        11: {
            title: "Start Your Journey",
            description: "Gain 1 point per second.",
            cost: new Decimal(1),
            effect() {},
        },
        12: {
            title: "Boost-α",
            description: "Points boost itself.",
            cost: new Decimal(1),
            effect() {
                let power_12 = new Decimal(player.points.add(2).log(2))
                if (hasUpgrade('a', 24)) power_12 = power_12.pow(upgradeEffect('a', 24))
                softcap(power_12, new Decimal(1e10), new Decimal(0.2))
                if (hasUpgrade('a', 31)) power_12 = power_12.pow(new Decimal(1).div(3))
                return power_12
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasUpgrade('a', 11))
            },
        },
        13: {
            title: "Inspiration I",
            description: "Points boost brain cells gain.",
            cost: new Decimal(5),
            effect() {
                let power_13 = new Decimal(player.points.times(10).pow(0.1))
                softcap(power_13, new Decimal(1e10), new Decimal(0.2))
                return power_13
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasUpgrade('a', 12))
            },
        },
        14: {
            title: "Return from the knowledge",
            description: "Brain cells boost point gain.",
            cost: new Decimal(16),
            effect() {
                let power_14 = new Decimal(player.a.points.add(1).pow(0.3))
                softcap(power_14, new Decimal(1e10), new Decimal(0.2))
                if (hasUpgrade('a', 32)) power_14 = power_14.pow(0)
                return power_14
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasUpgrade('a', 13))
            },
        },
        21: {
            title: "Miles Callisto",
            description: "Brain cells boost itself.",
            cost: new Decimal(1e6),
            effect() {
                let power_21 = new Decimal(player.a.points.pow(0.1))
                softcap(power_21, new Decimal(1e10), new Decimal(0.2))
                if (inChallenge('b', 13)) power_21 = new Decimal(1)
                return power_21
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasUpgrade('a', 14) && hasMilestone('a', 1))
            },
        },
        22: {
            title: "Loretta Callisto",
            description: "Evolvers are boosted based on your points.",
            cost: new Decimal(3e6),
            effect() {
                let power_22 = new Decimal(player.points.pow(0.045).add(1))
                softcap(power_22, new Decimal(1e10), new Decimal(0.2))
                if (hasChallenge('b', 13)) power_22 = power_22.pow(0.85)
                if (inChallenge('b', 13)) power_22 = new Decimal(1)

                return power_22
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasUpgrade('a', 14) && hasMilestone('a', 1))
            },
        },
        23: {
            title: "Phoebe Callisto",
            description: "Evolvers I and II now boosts brain cells gain, but in a reduced rate.",
            cost: new Decimal(3e7),
            effect() {
                let power_23 = new Decimal(buyableEffect('a', 11)).times(buyableEffect('a', 12)).pow(0.1)
                softcap(power_23, new Decimal(1e10), new Decimal(0.2))
                if (inChallenge('b', 13)) power_23 = new Decimal(1)

                return power_23
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasUpgrade('a', 14) && hasMilestone('a', 1))
            },
        },
        24: {
            title: "Leo Callisto",
            description: "Massively boost upgrade 'Boost-α' by ^4.",
            cost: new Decimal(1e11),
            effect() {
                let power_24 = new Decimal(4)
                if (inChallenge('b', 13)) power_24 = new Decimal(1)

                return power_24
            },
            unlocked(){
                return (hasUpgrade('a', 14) && hasMilestone('a', 1))
            },
        },
        15: {
            title: "Project Stellosphere (v2.0)",
            description: "Star effect is boosted based on your points.",
            cost: new Decimal(2e41),
            currencyDisplayName: "points",
            currencyInternalName: "points",
            currencyLocation() {return player},
            effect() {
                let power_15 = new Decimal(2).pow(player.points.pow(0.015))
                if (hasChallenge('b', 13)) power_15 = new Decimal(1)
                softcap(power_15, new Decimal(1e10), new Decimal(0.2))
                if (inChallenge('b', 13)) power_15 = new Decimal(1)

                return power_15
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasMilestone('a', 3))
            },
        },
        25: {
            title: "Village Searching (v2.0)",
            description: "Point gain is further boosted based on your total challenge completions.",
            cost: new Decimal(1e61),
            currencyDisplayName: "points",
            currencyInternalName: "points",
            currencyLocation() {return player},
            effect() {
                let power_25 = new Decimal(10).pow(Object.values(player.b.challenges).reduce((a,b) => a+b))
                if (hasChallenge('b', 13)) power_25 = power_25.pow(2)
                softcap(power_25, new Decimal(1e10), new Decimal(0.2))
                if (inChallenge('b', 13)) power_25 = new Decimal(1)

                return power_25
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasMilestone('a', 3))
            },
        },
        31: {
            title: "Laser Boomerang",
            description: "Star boost effect is squared, but cube root the upgarde 'Boost-α'.",
            cost: new Decimal(1e73),
            currencyDisplayName: "points",
            currencyInternalName: "points",
            currencyLocation() {return player},
            unlocked(){
                return (hasMilestone('a', 3))
            },
        },
        32: {
            title: "Blastboard",
            description: "Boost-β is cubed, and can now boost all generators in a reduced rate, but disable the upgrade 'Return from the knowledge'.",
            cost: new Decimal(1e80),
            currencyDisplayName: "points",
            currencyInternalName: "points",
            currencyLocation() {return player},
            effect() {
                let power_32 = upgradeEffect('b', 12).pow(0.25)
                if (inChallenge('b', 13)) power_32 = new Decimal(1)

                return power_32
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasMilestone('a', 3))
            },
        },
        33: {
            title: "Intellect",
            description: "Raise all layer 2 upgrades effect to the power of 1.5 (except unlocking feature ones).",
            cost: new Decimal(1e96),
            currencyDisplayName: "points",
            currencyInternalName: "points",
            currencyLocation() {return player},
            unlocked(){
                return (hasMilestone('a', 3))
            },
        },
        34: {
            title: "placeholder",
            description: "Placeholder",
            cost: new Decimal("1e666"),
            currencyDisplayName: "points",
            currencyInternalName: "points",
            currencyLocation() {return player},
            effect() {
                let power_34 = new Decimal(10).pow(Object.values(player.b.challenges).reduce((a,b) => a+b))
                return power_34
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasMilestone('a', 3))
            },
        },
        35: {
            title: "placeholder",
            description: "Placeholder",
            cost: new Decimal("1e666"),
            currencyDisplayName: "points",
            currencyInternalName: "points",
            currencyLocation() {return player},
            effect() {
                let power_35 = new Decimal(10).pow(Object.values(player.b.challenges).reduce((a,b) => a+b))
                return power_35
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasMilestone('a', 3))
            },
        },
    },
    buyables: {
        11: {
            title: "Mind-Generator",
            cost(x) { 
                let cost_ab11 = new Decimal(2).pow(x.div(4).add(1))
                if (getBuyableAmount('a', 11).gte(new Decimal(1000))) cost_ab11 = new Decimal(2).pow(x.pow(1.012).add(1))
                return cost_ab11 
            },
            effect(x){
                let power_ab11 = new Decimal(1).mul(x.add(1).pow(1.4))
                if(hasUpgrade('a', 22)) power_ab11 = power_ab11.times(upgradeEffect('a', 22))
                if(hasUpgrade('a', 32)) power_ab11 = power_ab11.times(upgradeEffect('a', 32))
                return power_ab11
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " brain cells\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies point gain by " + format(buyableEffect(this.layer, this.id))+"x"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            autoBuy() {
                return (hasMilestone('a', 4))
            },
        },
        12: {
            title: "Mind-Generator II",
            cost(x) { 
                let cost_ab12 = new Decimal(2).pow(x.div(3).add(7.96578428466))
                if (getBuyableAmount('a', 12).gte(750)) cost_ab12 = new Decimal(2).pow(x.pow(1.024).add(7.96578428466))
                return cost_ab12
            },
            effect(x){
                let power_ab12 = new Decimal(1).mul(new Decimal(3).mul(new Decimal(0.4).mul(x).pow(3)).add(1))
                if(hasUpgrade('a', 22)) power_ab12 = power_ab12.times(upgradeEffect('a', 22))
                if(hasUpgrade('a', 32)) power_ab12 = power_ab12.times(upgradeEffect('a', 32))
                return power_ab12
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " brain cells\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies point gain by " + format(buyableEffect(this.layer, this.id))+"x"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            autoBuy() {
                return (hasMilestone('a', 4))
            },
        },
        21: {
            title: "Mind-Generator III",
            cost(x) { 
                let cost_ab21 = new Decimal(2).pow(x.div(2).add(56.4727776131))
                if (getBuyableAmount('a', 21).gte(420)) cost_ab21 = new Decimal(2).pow(x.pow(1.048).add(56.4727776131))
                return cost_ab21
            },
            effect(x){
                let power_ab21 = new Decimal(1).mul(x.pow(3)).add(1)
                if(hasUpgrade('a', 22)) power_ab21 = power_ab21.times(upgradeEffect('a', 22))
                if(hasUpgrade('a', 32)) power_ab21 = power_ab21.times(upgradeEffect('a', 32))
                return power_ab21
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " brain cells\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies point gain by " + format(buyableEffect(this.layer, this.id))+"x"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade('b', 11)
            },
            autoBuy() {
                return (hasMilestone('a', 4))
            },
        },
        22: {
            title: "Mind-Generator IV",
            cost(x) { 
                let cost_ab22 = new Decimal(2).pow(x.div(1.6).add(89.692058562))
                if (getBuyableAmount('a', 22).gte(300)) cost_ab22 = new Decimal(2).pow(x.pow(1.096).add(89.692058562))
                return cost_ab22
            },
            effect(x){
                let power_ab22 = new Decimal(1).mul(x.times(2).pow(2.6)).add(1)
                if(hasUpgrade('a', 22)) power_ab22 = power_ab22.times(upgradeEffect('a', 22))
                if(hasUpgrade('a', 32)) power_ab22 = power_ab22.times(upgradeEffect('a', 32))
                return power_ab22
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " brain cells\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies point gain by " + format(buyableEffect(this.layer, this.id))+"x"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasChallenge('b', 11)
            },
            autoBuy() {
                return (hasMilestone('a', 4))
            },
        },
        31: {
            title: "Mind-Generator V",
            cost(x) { 
                let cost_ab31 = new Decimal(2).pow(x.add(188.763495491))
                if (getBuyableAmount('a', 31).gte(100)) cost_ab31 = new Decimal(2).pow(x.pow(1.192).add(188.763495491))
                return cost_ab31
            },
            effect(x){
                let power_ab31 = new Decimal(1).mul(x.times(0.7).pow(4.5)).add(1)
                if(hasUpgrade('a', 22)) power_ab31 = power_ab31.times(upgradeEffect('a', 22))
                if(hasUpgrade('a', 32)) power_ab31 = power_ab31.times(upgradeEffect('a', 32))
                return power_ab31
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " brain cells\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies point gain by " + format(buyableEffect(this.layer, this.id))+"x"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasChallenge('b', 13)
            },
            autoBuy() {
                return (hasMilestone('a', 4))
            },
        },
    },
    milestones: {
        1:{
            requirementDescription: "350,000 brain cells",
            effectDescription: "Unlocks 4 new upgrades",
            done(){
                return player.a.points.gte(350000)
            },
        },
        2:{
            requirementDescription: "2e9 brain cells",
            effectDescription: "You now gain 100% of the pending brain cells each second.",
            done(){
                return player.a.points.gte(2e9)
            },
        },
        3:{
            requirementDescription: "3e26 brain cells",
            effectDescription: "Unlock 7 new point-based upgrades.",
            done(){
                return player.a.points.gte(3e26)
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
            unlocked() {
                return true
            }
        },
        "Milestone": {
            content: [
                "main-display",
                "milestones"
            ],
            unlocked() {
                return true
            }
        },
        "Evolver": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                 function() { return 'Generators' },
                 {"font-size": "27px"}],
                "buyables",
            ],
            unlocked() {
                return (hasUpgrade('a', 14))
            }
        },
    }
})