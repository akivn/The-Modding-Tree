addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        MG1: false,
        MG2: false,             // "points" is the internal name for the main resource of the layer.
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
        if (hasUpgrade('a', 21)) mult = mult.times(upgradeEffect('a', 21))
        mult = mult.times(tmp.b.effect)
        if (getBuyableAmount('fl', 11) > 1) mult = mult.times(buyableEffect('fl', 11))

        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true }, 

    passiveGeneration() {
        return hasMilestone("a", 2) ? 1:0
        },   
    upgrades: {
        11: {
            title: "Start Your Journey",
            description: "Gain 1 point per second.",
            cost: new Decimal(1),
        },
        12: {
            title: "Self-Sufficient I",
            description: "Points boost itself. Softcaps from 100x.",
            cost: new Decimal(2),
            effect() {
                let power_12 = new Decimal(player.points).div(6).add(1)
                if (hasUpgrade('a', 14)) power_12 = power_12.pow(2)
                return softcap(power_12, new Decimal(100), new Decimal(0.2).times(new Decimal(1).div(power_12.log(1e6).add(1))))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasUpgrade('a', 11))
            },
        },
        13: {
            title: "Cell division",
            description: "Brain cells boost itself. Softcaps from 15x.",
            cost: new Decimal(16),
            effect() {
                let power_13 = new Decimal(player.a.points).div(6).add(1)
                return softcap(power_13, new Decimal(15), new Decimal(1).div(power_13.log(1e6).add(1)))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasUpgrade('a', 12))
            },
        },
        14: {
            title: "Upgrade boost I",
            description: "Boost upgrade 'Self-Sufficient I' by ^2, and unlock 4 new upgrades.",
            cost: new Decimal(256),
            unlocked(){
                return (hasUpgrade('a', 13))
            },
        },
        21: {
            title: "Laserang",
            description: "Points boost Brain cell gain. Softcap starts from 2e6x.",
            cost: new Decimal(1024),
            effect() {
                let power_21 = new Decimal(player.points.add(2)).log(2)
                if (hasUpgrade('b', 12)) power_21 = power_21.pow(1.6)
                return softcap(power_21, new Decimal(2e6), new Decimal(1).div(power_21.log(1e6).add(1)))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasUpgrade('a', 14))
            },
        },
        22: {
            title: "Blastboard",
            description: "Brain cells boost points gain. Softcap starts from 2e6x.",
            cost: new Decimal(524288),
            effect() {
                let power_22 = new Decimal(player.a.points.pow(0.15))
                return softcap(power_22, new Decimal(2e6), new Decimal(1).div(power_22.log(1e6).add(1)))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasUpgrade('a', 14))
            },
        },
        23: {
            title: "Stellosphere",
            description: "Unlock Generators.",
            cost: new Decimal(5e6),
            unlocked(){
                return (hasUpgrade('a', 14))
            },
        },
        24: {
            title: "The Generation Changes",
            description: "Total Mind-Generators amount boost points gain based on your points.",
            cost: new Decimal(5e10),
            effect() {
                let power_24 = new Decimal(10).pow(getBuyableAmount('a', 11).div(3)).pow(player.points.add(2).log(1e9))
                return softcap(power_24, new Decimal(2e6), new Decimal(1).div(power_24.log(1e6).add(1)))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasUpgrade('a', 14))
            },
        },
        31: {
            title: "Mathematician",
            description: "Mind-Generators effect boost star effect in a reduced rate.",
            cost: new Decimal(1e37),
            effect() {
                let power_31 = buyableEffect('a', 11).times(buyableEffect('a', 12).pow(0.1))
                if (hasUpgrade('a', 32) && getBuyableAmount('a', 21) > 1) power_31 = buyableEffect('a', 11).times(buyableEffect('a', 12).times(buyableEffect('a', 21).pow(0.1)))
                return softcap(power_31, new Decimal(1e12), new Decimal(1).div(power_31.log(1e12).add(1)))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasUpgrade('b', 11))
            },
        },
        32: {
            title: "Generation-3",
            description: "Unlock Mind-Generator III.",
            cost: new Decimal(1e50),
            unlocked(){
                return (hasUpgrade('b', 11))
            },
        },
        33: {
            title: "Flora of the Nature",
            description: "Unlock Flowers tab.",
            cost: new Decimal(1e52),
            unlocked(){
                return (hasUpgrade('b', 11))
            },
        },
        34: {
            title: "Flora-Alpha",
            description: "Boost flora gain based on your log(points) (softcaps at 100x)",
            cost: new Decimal(1e93),
            effect() {
                let power_34 = new Decimal(1).times(player.points.add(10).log(10))
                return softcap(power_34, new Decimal(100), new Decimal(1).div(power_34.log(100).add(1)))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasUpgrade('b', 11))
            },
        },
        41: {
            title: "HAPPY NEW YEAR!!!",
            description: "UNLOCK YEAR 3.",
            cost: new Decimal(1e131),
            unlocked(){
                return (hasUpgrade('b', 11))
            },
        },
    },
    doReset(resettingLayer) {
        let keep = []
        if (hasMilestone("b", 0)) keep.push("upgrades")
        if (hasMilestone("b", 0)||hasMilestone('c', 2)) keep.push("buyables")
        if (layers[resettingLayer].row > this.row) layerDataReset("a", keep)
       },
    passiveGeneration() {
        return hasMilestone("b", 0) ? 0.3:0
    },

    buyables:{
        11: {
            title: "Mind-Generator I",
            cost(x) { 
                let cost_ab11 = new Decimal(5e5).times(new Decimal(2).pow(x.mul(4).add(1)))
                if(hasUpgrade('b', 11)) cost_ab11 = cost_ab11.div(500000)
                return softcap(cost_ab11, new Decimal(1e10), new Decimal(1.2).add(cost_ab11.pow(0.008).pow(x.pow(0.2)))) 
            },
            effect(x){
                let power_ab11 = new Decimal(1).mul(new Decimal(3.2).pow(x).add(1).pow(2))
                power_ab11 = power_ab11.times(tmp.fl.effect)
                return softcap(power_ab11, new Decimal(1e5), new Decimal(1).div(power_ab11.add(1).log(100)).add(1)) 
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
        },
        12: {
            title: "Mind-Generator II",
            cost(x) { 
                let cost_ab12 = new Decimal(5e34).times(new Decimal(2).pow(x.mul(4).add(1)))
                return softcap(cost_ab12, new Decimal(1e36), new Decimal(1.2).add(cost_ab12.pow(0.02).pow(x.pow(0.16)))) 
            },
            effect(x){
                let power_ab12 = new Decimal(1).mul(x.pow(4).add(1).pow(1.4))
                power_ab12 = power_ab12.times(tmp.fl.effect)
                return softcap(power_ab12, new Decimal(1e4), new Decimal(1.2).add(power_ab12.pow(0.02).pow(x.pow(0.16))))
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
            unlocked() { return hasUpgrade('b', 11)},
            },
        21: {
            title: "Mind-Generator III",
            cost(x) { 
                let cost_ab21 = new Decimal(5e49).times(new Decimal(2).pow(x.mul(4).add(1)))
                return softcap(cost_ab21, new Decimal(1e61), new Decimal(1.2).add(cost_ab21.pow(0.02).pow(x.pow(0.16)))) 
            },
            effect(x){
                let power_ab21 = new Decimal(1).mul(new Decimal(16).pow(x))
                power_ab21 = power_ab21.times(tmp.fl.effect)
                return softcap(power_ab21, new Decimal(1e16), new Decimal(1).div(power_ab21.add(2).log(1e60)))
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
            unlocked() { return hasUpgrade('a', 32)},
        },
        22: {
            title: "Mind-Generator IV",
            cost(x) { 
                let cost_ab22 = new Decimal(1e90).times(new Decimal(10).pow(x.mul(3).add(1)))
                return softcap(cost_ab22, new Decimal(1e150), new Decimal(1.2).add(cost_ab22.pow(0.02).pow(x.pow(0.16)))) 
            },
            effect(x){
                let power_ab22 = new Decimal(1).mul(new Decimal(2).pow(x))
                power_ab22 = power_ab22.times(tmp.fl.effect)
                return softcap(power_ab22, new Decimal(1e16), new Decimal(1).div(power_ab22.add(2).log(1e60)))
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
            unlocked() { return hasChallenge('b', 11)},
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
                return (hasUpgrade('a', 23) || hasUpgrade('b', 11))
            }
        },
    },
    automate(){
        if (hasMilestone('fl', 0)){
          buyBuyable('a', 11)
          buyBuyable('a', 12)
          buyBuyable('a', 21)
        }
        if (hasChallenge('b', 11) && hasMilestone('fl', 0)){
          buyBuyable('a', 22)  
        }
    },
})