addLayer("fa", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    name: "Fauna",
    symbol: "F+",
    color: "#098800",                       // The color for this layer, which affects many elements.
    resource: "Fauna",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "Flora",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.fl.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e105),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1,  
    hotkeys: [
        {
            key: "ctrl-f", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "control-f: reset your points for Flowers", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.f.unlocked) doReset("fa") }, // Determines if you can use the hotkey, optional
        }
    ],                        // "normal" prestige gain is (currency^exponent).
    update() {
        let gain = new Decimal(1)
        gain = gain.times(buyableEffect('fa', 11).div(20))
        gain = softcap(gain, new Decimal(1e100), new Decimal(0.2))
        if (hasUpgrade('c', 24)) gain = gain.times(upgradeEffect('c', 24))
        addPoints('fa', gain)
    },
    gainMult() {
        let mult = new Decimal(1)                          // Returns your multiplier to your gain of the prestige resource.
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    position: 2,
    layerShown() { return hasUpgrade('a', 42) || player.fa.best.gte(1)},
    effect() {
        let effect_fl = new Decimal(1).times(player.fa.points).add(1)
        if (hasMilestone('fa', 0)) effect_fl = new Decimal(1).times(player.fa.best).add(1)
        effect_fl = softcap(effect_fl, new Decimal(1e20), new Decimal(0.84))
        effect_fl = softcap(effect_fl, new Decimal(1e32), new Decimal(0.54))
        effect_fl = softcap(effect_fl, new Decimal(1e44), new Decimal(0.24))
        effect_fl = softcap(effect_fl, new Decimal(1e160), new Decimal(0.12))
        if (hasMilestone('fa', 0))effect_fl = effect_fl.pow(2)
        return effect_fl
    },
    effectDescription(){
            return "boosting Flora gain by x" + format(tmp[this.layer].effect)        
    },

    buyables: {
        11: {
            title: "Sheep",
            cost(x) { 
                let cost = new Decimal(1).mul(new Decimal(2).pow(x))
                return softcap(cost, new Decimal(1e16), new Decimal(1).times(cost.log(1e16).pow(2)))
            },
            effect(x){
                let power = new Decimal(1).mul(x.add(1).pow(1.4).add(1)).add(1).minus(3)
                power = power.times(buyableEffect('fa', 12))
                if (hasUpgrade('a', 44)) power = power.times(666)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Faunas\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Power gain by " + format(buyableEffect(this.layer, this.id))+"x" + "\n\ and Generating " + format(buyableEffect(this.layer, this.id)) + " Faunas per second"

            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        12: {
            title: "Pig",
            cost(x) { 
                let cost = new Decimal(500).mul(new Decimal(3).pow(x))
                return softcap(cost, new Decimal(1e16), new Decimal(1).times(cost.log(1e16).pow(2)))
            },
            effect(x){
                let power = new Decimal(1).mul(x.pow(3.2).add(1))
                power = power.times(buyableEffect('fa', 21))
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Faunas\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Sheep Production by " + format(buyableEffect(this.layer, this.id))+"x"

            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        21: {
            title: "Tai O Cow",
            cost(x) { 
                let cost = new Decimal(1e6).mul(new Decimal(4).pow(x))
                return softcap(cost, new Decimal(1e32), new Decimal(1).times(cost.log(1e32).pow(2)))
            },
            effect(x){
                let power = new Decimal(1).mul(x.pow(5).add(1))
                power = power
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Faunas\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Pig Production by " + format(buyableEffect(this.layer, this.id))+"x"

            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },
    milestones: {
        0: {
            requirementDescription: "11,111 Faunas",
                done() {return player[this.layer].best.gte(11111)}, // Used to determine when to give the milestone
                effectDescription: "Fauna boost is now based on your best fauna, and the effect is squared.",
        },
        1: {
            requirementDescription: "1e13 Faunas",
                done() {return player[this.layer].best.gte(1e13)}, // Used to determine when to give the milestone
                effectDescription: "Fauna boost now boosts brain cells, raised to the power of 4. (omits softcap)",
        },
            

    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                        function() {return 'You have a best of ' + format(player.fa.best) + ' faunas.'},
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
    doReset(resettingLayer) {
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset("fa", keep)
       },
    automate(){
        if (hasUpgrade('c', 24)) {
            buyBuyable('fa', 11)
            buyBuyable('fa', 12)
            buyBuyable('fa', 21)
       }
},

})