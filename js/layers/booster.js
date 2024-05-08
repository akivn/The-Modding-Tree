addLayer("b", {
    name: "Booster",
    symbol: "B",
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    branches: ['g'],
    color: "#6e64c4",                       // The color for this layer, which affects many elements.
    resource: "Booster",            // The name of this layer's main prestige resource.
    row: 1,                                   // The row this layer is on (0 is the first row).
    position: 1,

    baseResource: "Arts",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.a.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(500),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent(){
        let exp = new Decimal(1.6)
        return exp
    },  
    hotkeys: [
        {
            key: "b", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "B: reset your Arts for Boosters", // The description of the hotkey that is displayed in the game's How To Play tab
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

    layerShown() { return hasUpgrade('a', 14) || player[this.layer].unlocked }, 
    passiveGeneration() {
    },
    effect() {
        let effect = new Decimal(2).pow(player[this.layer].points)
        softcap(effect, new Decimal(1), new Decimal(1).div(effect.add(10).log(10).div(10).pow(0.5).add(1)))
        return effect
    },
    effectDescription(){
        return "boosting Art and Experience gain by x" + format(tmp[this.layer].effect)        
    },
    milestones: {
        0: {requirementDescription: "4 Boosters",
            done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
            effectDescription: "Unlock Automation for Booster gain.",
        },
        1: {requirementDescription: "7 Boosters",
            done() {return player[this.layer].best.gte(7)}, // Used to determine when to give the milestone
            effectDescription: "x4 to Art Progress, and you can now gain Artworks over 10/s.",
        },
        2: {requirementDescription: "10 Boosters",
            done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
            effectDescription: "Unlock Automation for Art Buyables, and keep your Upgrades on Booster resets.",
        },
    },

    upgrades:{
        11: {
            title: "Faster Working",
            description: "Boost Artwork progress based on your boosters.",
            cost: new Decimal(3),
            effect() {
                let power = new Decimal(player.b.points.div(2).add(1).pow(2))
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return true},
        },
        12: {
            title: "Formula Plus",
            description: "The Formula for Experience Boost is better.",
            cost: new Decimal(5),
            unlocked(){ return true },
        },
        13: {
            title: "Art Synergy",
            description: "Art gain boost itself.",
            cost: new Decimal(9),
            effect() {
                let power = player.a.points.add(10).log(10).div(5).add(1).pow(2)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return true },
        },
        14: {
            title: "AI Art",
            description: "Unlock Generators.",
            cost: new Decimal(10),
            unlocked(){ return true },
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "milestones",
                "upgrades",
            ],
        },
    },
})
