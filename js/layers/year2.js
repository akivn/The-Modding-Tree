addLayer("b", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    name: "Year 2",
    symbol: "Y2",
    color: "#00b0ff",                       // The color for this layer, which affects many elements.
    resource: "Stars",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1,
    base: 1e15,
    branches: ['c', 'fl'],  
    hotkeys: [
        {
            key: "2", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "2: reset your points for stars", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.b.unlocked) doReset("b") }, // Determines if you can use the hotkey, optional
        }
    ],                        // "normal" prestige gain is (currency^exponent).

    gainMult() {
        let mult = new Decimal(1)                          // Returns your multiplier to your gain of the prestige resource.
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    doReset(resettingLayer) {
        let keep = []
        if (hasMilestone("c", 1)) keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset("a", keep)
       },

    layerShown() { return player.points.gte(1e9) || player.b.best.gte(1) || player.c.best.gte(1) },
    effect() {
        let effect_b = new Decimal(1)
        if (player.b.points.gte(1)) effect_b = new Decimal(3).pow(player.b.points)
        if (hasUpgrade('a', 24)) effect_b = effect_b.times(upgradeEffect('a', 24))
        if (hasUpgrade('a', 31)) effect_b = effect_b.times(upgradeEffect('a', 31))
        if (hasUpgrade('b', 12)) effect_b = effect_b.times(6)
        return softcap(effect_b, new Decimal(1e10), new Decimal(1).div(new Decimal(effect_b).pow(0.015)))
    },
    effectDescription(){
            return "boosting points and knowledge gain by x" + format(tmp[this.layer].effect)        
    },

    upgrades: {
        11: {
            title: "Square the effect!",
            description: "Unlock Mind-Generator II. (In Year 1), divide the cost of Generator I by 500,000, and unlock 4 new upgrades for Year 1.",
            cost: new Decimal(2),
            unlocked() {
                return (player.b.best.gte(1))
            }
        },
        12: {
            title: "Six times six",
            description: "Boost Flora gain and Star effect by 6, and boost Y1 upgrade 5 by ^1.6.",
            cost: new Decimal(6),
            unlocked() {
                return (player.b.best.gte(5))
            }
        },
        13: {
            title: "No pain, no gain.",
            description: "Unlock Challenges.",
            cost: new Decimal(8),
            unlocked() {
                return (player.b.best.gte(6))
            }
        },

    },
    canBuyMax() {
        return hasMilestone('c', 0)
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "upgrades",
                "milestones",
            ],
        },
        "Challenges": {
            content: [
                "challenges"
            ],
            unlocked() {
                return hasUpgrade('b', 13)
            }
        }
    },
    challenges: {
        11: {
            name: "Concrete forest",
            challengeDescription: "Flora effect is disabled.",
            goalDescription: "1e72 points",
            rewardDescription: "Unlock Mind Generator IV and Flora buyable 4.",
            canComplete: function() {
            return player.points.gte(1e72)
            },
        },

    },
    milestones: {
        0: {
        requirementDescription: "6 Stars",
            done() {return player[this.layer].best.gte(6)}, // Used to determine when to give the milestone
            effectDescription: "Year 2 prestiges resets nothing in Year 1, and gain 30% of the points you get every second in Year 1.",
        },

    }

})