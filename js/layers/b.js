addLayer("b", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    name: "Year 2",
    symbol: "Y2",
    color: "#00b0ff",                       // The color for this layer, which affects many elements.
    resource: "stars",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e25),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.96,  
    hotkeys: [
        {
            key: "2", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "2: reset your points for stars", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.a.unlocked) doReset("a") }, // Determines if you can use the hotkey, optional
        }
    ],                        // "normal" prestige gain is (currency^exponent).

    gainMult() {
        let mult = new Decimal(1)                          // Returns your multiplier to your gain of the prestige resource.
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true }, 
    passiveGeneration() {
    },
    effect() {
        let effect_b = new Decimal(1)
        if (player.b.points >= 1) effect_b = new Decimal(2).pow(player.b.points)
        if (hasUpgrade('a', 15)) effect_b = effect_b.times(upgradeEffect('a', 15))
        if (hasUpgrade('a', 31)) effect_b = effect_b.pow(2)
        if (inChallenge('b', 11)) effect_b = new Decimal(1)
        if (inChallenge('b', 12)) effect_b = new Decimal(1)
        if (inChallenge('b', 13)) effect_b = new Decimal(1)

        softcap(effect_b, new Decimal(1e10), new Decimal(1).div(new Decimal(effect_b).pow(0.1)))
        return effect_b
    },
    effectDescription(){
            return "boosting points gain by x" + format(tmp[this.layer].effect)        
    },
    canBuyMax() {
        return hasMilestone("b", 1)
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "upgrades",
            ],
        },
        "Milestones": {
            content: [
                "main-display",
                "milestones"
            ]
        },
        "Challenge": {
            content: [
                "main-display",
                "challenges"
            ],
            unlocked() {
                return (hasMilestone('b', 3))
            }
        },
    },
    upgrades: {
        11: {
            title: "Mind Booster",
            description: "Unlock Mind-Generator 3.",
            cost: new Decimal(3),
            unlocked(){
                return (player.b.best.gte(1))
            },
        },
        12: {
            title: "Boost-β",
            description: "Knowledge boost itself.",
            cost: new Decimal(13),
            effect() {
                let power_b12 = new Decimal(player.a.points.add(2).pow(0.09))
                if (hasUpgrade('a', 32)) power_b12 = power_b12.pow(3)
                if (hasUpgrade('a', 33)) power_b12 = power_b12.pow(1.5)
                softcap(power_b12, new Decimal(1e16), new Decimal(1).div(new Decimal(power_b12)))
                return power_b12
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return (hasChallenge('b', 12))
            },
        },
        13: {
            title: "Protein Bar",
            description: "Give a flat 1e20 boost to Brain cell gain.",
            cost: new Decimal(20),
            unlocked(){
                return (hasChallenge('b', 12))
            },
        },
    },
    milestones: {
        1: {
            requirementDescription: "3 stars",
            effectDescription: "You can buy max stars.",
            done() { 
            return player.b.points.gte(3)
            }, 
        },
        2: {
            requirementDescription: "8 stars",
            effectDescription: "Year 2 prestiges resets nothing but buyables.",
            done() { 
            return player.b.points.gte(8)
            }, 
        },
        3: {
            requirementDescription: "9 stars",
            effectDescription: "Unlock Challenges (in Year 2) and Year 2 prestiges will not reset buyables.",
            done() { 
            return player.b.points.gte(9)
            }, 
        },
        4: {
            requirementDescription: "17 stars",
            effectDescription: "Automate buying buyables (Year 1).",
            done() { 
            return player.b.points.gte(17)
            }, 
        },
    },
    challenges: {
        11: {
            name: "Degenerate Era",
            challengeDescription: "Star effect is disabled (Recommended to do at 9 Stars)",
            goalDescription: "1e32 points",
            rewardDescription: "Unlock Mind Generator IV, and Mind Generator III now directly boosts brain cells gain.",
            canComplete: function() {
            return player.points.gte(1e32)
            },
        },
        12: {
            name: "Alzheimer's Disease",
            challengeDescription: "All effects from previous challenges + Point gain is square rooted (Recommended to do at 13 Stars)",
            goalDescription: "3.1e53 points",
            rewardDescription: "Unlock 2 new Year 2 upgrades",
            canComplete: function() {
            return player.points.gte(3.1e53)
            },
        },
        13: {
            name: "Sports heatwave",
            challengeDescription: "All effects from previous challenges + Year 1 Row 2 and 3 upgrades disabled (Recommended to do at 17 Stars)",
            goalDescription: "1e28 points",
            rewardDescription: "Unlock Mind Generator V, and square the upgrade effect of 'Village Searching', but disables the upgrade 'Loretta Callisto' and 'Project Stellosphere'.",
            canComplete: function() {
            return player.points.gte(1e28)
            },
        }
    }
})