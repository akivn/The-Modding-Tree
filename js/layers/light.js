addLayer("l", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    branches: [
		["lp", function() { return player.lp.unlocked ? "#c0c0c0" : "#303030" }, 25],
	],
    name: "Light",
    symbol: "L",
    color: "#f7f4b5",                       // The color for this layer, which affects many elements.
    resource: "Light",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "Prestige Points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.p.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e6),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.6,
    base: 10,  
    hotkeys: [
        {
            key: "l", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "l: reset your Prestige points for light", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.l.unlocked) doReset("l") }, // Determines if you can use the hotkey, optional
        }
    ],                        // "normal" prestige gain is (currency^exponent).

    gainMult() {
        let mult = new Decimal(1)                          // Returns your multiplier to your gain of the prestige resource.
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return (player.p.points.gte(1e5) || player[this.layer].points.gte(1)) }, 
    passiveGeneration() {
    },
    effect() {
        let base = new Decimal(2)
        let effect_b = new Decimal(base).pow(player[this.layer].points)
        softcap(effect_b, new Decimal(1e10), new Decimal(0.3))
        return effect_b
    },
    effectDescription(){
            return "boosting both Prestige point by x" + format(tmp[this.layer].effect) + " and point gain by x" + format(tmp[this.layer].effect.pow(1.5))      
    },
    upgrades: {
        11: {
            title: "Vibrate the Powerer",
            description: "The Point Powerer uses a better formula.",
            cost: new Decimal(2),
            unlocked(){
                return true
            },
        },
        12: {
            title: "Vibrate the Prestige Powerer",
            description: "The Prestige Powerer uses a better formula.",
            cost: new Decimal(4),
            unlocked(){
                return true
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
        "Challenges": {
            content: [
                "main-display",
                "challenges",
            ],
            unlocked() {
                return (hasUpgrade("p", 34))
            },
        },
    },
    doReset(){},
})
