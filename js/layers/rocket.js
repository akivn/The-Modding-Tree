addLayer("r", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    name: "Rocket",
    symbol: "R",
    color: "#a6a6a6",                       // The color for this layer, which affects many elements.
    resource() {
        if (player[this.layer].points.gte(1) && player[this.layer].points.lte(1)) return "Rocket"
        else return "Rockets"
    },                                      // The name of this layer's main prestige resource.
    row: 3,                                 // The row this layer is on (0 is the first row).
    position: 1,
    branches: ['h'],
    nodeStyle() {
        return options.imageNode ? {
            'color': 'white',
            'background-image': 'url("resources/space-x.jpg")',
            'background-position': 'center center',
            'background-size': '160%',
            'border': '1px solid white'
        } : {
            'background-image': 'radial-gradient(circle at center, #A6A6A6, #535353)'
        }
    },

    baseResource: "Honours",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.h.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e84),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.4,
    base: new Decimal(10).pow(8.4),  
    hotkeys: [
        {
            key: "r", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "R: reset your Honours for Rockets", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.r.unlocked) doReset("r") }, // Determines if you can use the hotkey, optional
        }
    ],                        // "normal" prestige gain is (currency^exponent).

    gainMult() {
        let mult = new Decimal(1)                          // Returns your multiplier to your gain of the prestige resource.
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade('i', 121) || player[this.layer].unlocked }, 
    passiveGeneration() {
    },
    effect() {
        let effect = player[this.layer].points.times(0.08).add(1).pow(0.7)
        return effect
    },
    effectDescription(){
        return "boosting Experience gain by ^" + format(tmp[this.layer].effect, 4)        
    },
})
