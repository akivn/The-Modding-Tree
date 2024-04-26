addLayer("lp", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        power: new Decimal(0)             // "points" is the internal name for the main resource of the layer.
    }},
    name: "Light Power",
    symbol: "LP",
    color: "#fdfad7",                       // The color for this layer, which affects many elements.
    resource: "Light Power",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "Light",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.l.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(5),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.2,
    base: 1.2,  
    hotkeys: [
        {
            key: "L", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "shift+l: Get Light Power", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.l.unlocked) doReset("l") }, // Determines if you can use the hotkey, optional
        }
    ],                        // "normal" prestige gain is (currency^exponent).
    resetDescription: "Get ",

    gainMult() {
        let mult = new Decimal(1)                          // Returns your multiplier to your gain of the prestige resource.
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return (player.l.points.gte(3) || player[this.layer].points.gte(1)) }, 
    passiveGeneration() {
    },
    power: {
        perSecond() {
            let base = player.lp.points.div(5).pow(new Decimal(player.timePlayed).pow(0.1))
            if(hasUpgrade('p', 31)) base = base.times(upgradeEffect('p', 31))
            if(hasUpgrade('p', 33)) base = base.times(upgradeEffect('p', 33))
            softcap(base, new Decimal(1e6), new Decimal(0.9).pow(base.div(1e5).log(10)).add(0.1))
            return base
        },
        effect() {
            let powa = (player.lp.power).pow(2).add(1)
            return powa
        }
    },
    update(delta) {
        player.lp.power = player.lp.power.plus(Decimal.times(tmp.lp.power.perSecond, delta));
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                ['display-text', function() { return `You have ${format(player.lp.power)} Photons,\n\ boosting Point gain by ${format(tmp.lp.power.effect)}x` }, { 'font-size': '19.8px', 'color': 'silver' }],
                ['display-text', function() { return `Photon Gain: ${format(tmp.lp.power.perSecond)} / sec, based on your Light Power` }, { 'font-size': '14.4px', 'color': 'silver' }],
                "milestones",
            ],
        },
    },
    milestones: {
        0: {requirementDescription: "1 Light Power",
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: "Unlock 4 new upgrades in Prestige, and unlock autobuyer for Point Powerer.",
            toggles: [
                ["p", "auto1"]
            ],
        },
},
})