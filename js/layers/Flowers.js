addLayer("fl", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    name: "Flower",
    symbol: "F",
    color: "#11aa00",                       // The color for this layer, which affects many elements.
    resource: "Flora",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "Brain Cells",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.a.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e52),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1,  
    hotkeys: [
        {
            key: "f", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "F: reset your points for Flowers", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.f.unlocked) doReset("f") }, // Determines if you can use the hotkey, optional
        }
    ],                        // "normal" prestige gain is (currency^exponent).
    update() {
        let gain = new Decimal(1).times(tmp.c.effect)
        gain = gain.times(buyableEffect('fl', 11).div(20))
        if (hasUpgrade('b', 12)) gain = gain.times(6)
        if (hasUpgrade('a', 34)) gain = gain.times(upgradeEffect('a', 34))
        addPoints('fl', gain)
    },
    gainMult() {
        let mult = new Decimal(1)                          // Returns your multiplier to your gain of the prestige resource.
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade('a', 33) || player.fl.best.gte(1) ||player.c.best.gte(1)},
    effect() {
        let effect_fl = new Decimal(1).times(player.fl.points).add(1)
        if (hasMilestone('fl', 1)) effect_fl = new Decimal(1).times(player.fl.best).add(1)
        if (inChallenge('b', 11)) effect_fl = new Decimal(1)
        return softcap(effect_fl, new Decimal(1e10), new Decimal(1).div(new Decimal(effect_fl).pow(0.015)))
    },
    effectDescription(){
            return "boosting Year 1 Buyables by x" + format(tmp[this.layer].effect)        
    },

    buyables: {
        11: {
            title: "Dandelion",
            cost(x) { 
                let cost = new Decimal(1).mul(new Decimal(2).pow(x))
                return softcap(cost, new Decimal(1e16), new Decimal(1).times(cost.log(1e16)))
            },
            effect(x){
                let power = new Decimal(1).mul(x.add(1).pow(1.4).add(1)).add(1)
                power = power.times(buyableEffect('fl', 12))
                return power
            },
            effect(y){
                let power2 = new Decimal(new Decimal(0.1).mul(y)).pow(1.2).times(3)
                power2 = power2.times(buyableEffect('fl', 12))
                return power2
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Florae\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies brain cells gain by " + format(buyableEffect(this.layer, this.id))+"x" + "\n\ and Generating " + format(buyableEffect(this.layer, this.id)) + " Florae per second"

            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        12: {
            title: "Poppy",
            cost(x) { 
                let cost = new Decimal(10).mul(new Decimal(3).pow(x))
                return softcap(cost, new Decimal(1e16), new Decimal(1).times(cost.log(1e16)))
            },
            effect(x){
                let power = new Decimal(new Decimal(1).mul(x).pow(1.5)).add(1)
                power = power.times(buyableEffect('fl', 21))
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Florae\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplying Dandelion production rate by x" + format(buyableEffect(this.layer, this.id))

            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return getBuyableAmount('fl', 11).gte(3)
            },
        },
        21: {
            title: "Blue Orchid",
            cost(x) { 
                let cost = new Decimal(2000).mul(new Decimal(4).pow(x))
                return softcap(cost, new Decimal(1e16), new Decimal(1).times(cost.log(1e16)))
            },
            effect(x){
                let power = new Decimal(new Decimal(1).mul(x).pow(new Decimal(1.5).pow(2))).add(1)
                power = power.times(buyableEffect('fl', 22))
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Florae\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplying Poppy effect by x" + format(buyableEffect(this.layer, this.id))

            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return getBuyableAmount('fl', 12).gte(5)
            },
        },
        22: {
            title: "Allium",
            cost(x) { 
                let cost = new Decimal(1e7).mul(new Decimal(10).pow(x))
                return softcap(cost, new Decimal(1e16), new Decimal(1).times(cost.log(1e16)))
            },
            effect(x){
                let power = new Decimal(new Decimal(1).mul(x).pow(new Decimal(1.5).pow(4))).add(1)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Florae\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplying Blue Orchid effect by x" + format(buyableEffect(this.layer, this.id))

            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasChallenge('b', 11)
            },
        },
    },
    milestones: {
        0: {requirementDescription: "1 Flora",
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: "Year 1 buyables now autobuys.",
        },
        1: {requirementDescription: "1000 Flora",
            done() {return player[this.layer].best.gte(1000)}, // Used to determine when to give the milestone
            effectDescription: "The Flora boost formula is now based on your best flora.",
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                        function() {return 'You have a best of ' + format(player.fl.best) + ' florae.'},
                        {"color": "white", "font-size": "17px"}],
                "buyables",
            ],
        },
        "Milestones": {
            content: [
                "main-display",
                "milestones"
            ]
        },
    },


})

