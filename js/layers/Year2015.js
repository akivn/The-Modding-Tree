addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    name: "Year 1",
    symbol: "1",
    color: "#2080ff",                       // The color for this layer, which affects many elements.
    resource: "knowledge",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1.25),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.8,
    hotkeys: [
        {
            key: "1", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "1: Do Year 1 Reset", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.a.unlocked) doReset("a") }, // Determines if you can use the hotkey, optional
        }
    ],                        // "normal" prestige gain is (currency^exponent).

    gainMult() {
        let mult = new Decimal(1)                // Returns your multiplier to your gain of the prestige resource.
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {
        let exp = new Decimal(1)                             // Returns the exponent to your gain of the prestige resource.
        return exp
    },

    layerShown() { return true }, 
    passiveGeneration() {
    },
    effect() {
        let effect = new Decimal(1)
        return effect
    },
    upgrades: {
        11: {
            title: "Start your Journey",
            description: "Add 0.01 to the multiplier base.",
            cost: new Decimal(1),
            effect(){
                let effect = new Decimal(0.01)
                return effect
            }
        },
        12: {
            title: "Get Set...",
            description: "Every upgrade adds the multiplier base by 0.01.",
            cost: new Decimal(2),
            effect(){
                let effect = new Decimal(player.a.upgrades.length).times(0.01)
                if (hasUpgrade('a', 31)) effect = effect.times(upgradeEffect('a', 31))
                return effect
            },
            effectDisplay() { return "+" + format( upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return hasUpgrade('a', 11)
            }
        },
        13: {
            title: "3...",
            description: "Points boost the multiplier. (Softcap at 0.03, Caps at 1)",
            cost: new Decimal(5),
            effect(){
                let effect = new Decimal(player.points).log(1e40)
                effect = softcap(effect, new Decimal(0.03), new Decimal(0.7))
                effect = softcap(effect, new Decimal(0.1), new Decimal(0.45))
                if (effect.gte(1)) effect = new Decimal(1)
                return effect
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return hasUpgrade('a', 12)
            }
        },
        14: {
            title: "2...",
            description: "Knowledges boost the multiplier. (Softcap at 0.05, Caps at 1.5)",
            cost: new Decimal(34),
            effect(){
                let effect = new Decimal(player.a.points).log(1e24)
                effect = softcap(effect, new Decimal(0.05), new Decimal(0.7))
                effect = softcap(effect, new Decimal(0.1), new Decimal(0.45))

                if (effect.gte(1.5)) effect = new Decimal(1.5)
                return effect
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return hasUpgrade('a', 13)
            }
        },
        21: {
            title: "1...",
            description: "Add an additional 1 point gain per second after everything.",
            cost: new Decimal(500),
            effect(){
                let effect = new Decimal(1)
                return effect
            },
            unlocked(){
                return hasUpgrade('a', 14)
            }
        },
        22: {
            title: "BLAST OFF!!!",
            description: "Remove Softcap 1 for points.",
            cost: new Decimal(4000),
            effect(){
                let effect = new Decimal(1)
                return effect
            },
            unlocked(){
                return hasUpgrade('a', 21)
            }
        },
        31: {
            title: "The Moon",
            description: "Boost Upgrade 2 based on your points, and weaken Softcap 2 by 80%.",
            cost: new Decimal(1e20),
            effect(){
                let effect = new Decimal(player.points).log(1e4).add(1)
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return hasUpgrade('a', 22)
            }
        },
        32: {
            title: "Mars",
            description: "Multiplies multiplier based on your points, and weaken Softcap 2 by 50% more.",
            cost: new Decimal(1e25),
            effect(){
                let effect = new Decimal(player.points).log(1e50).add(1)
                effect = softcap(effect, new Decimal(2), new Decimal(0.4))
                effect = softcap(effect, new Decimal(4), new Decimal(0.2))
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return hasUpgrade('a', 22)
            }
        },
        33: {
            title: "Asteroid Belt",
            description: "Multiplies multiplier based on your knowledge.",
            cost: new Decimal(1e33),
            effect(){
                let effect = new Decimal(player.a.points).log(1e25).add(1)
                effect = softcap(effect, new Decimal(3), new Decimal(0.4))
                effect = softcap(effect, new Decimal(6), new Decimal(0.2))
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return hasUpgrade('a', 22)
            }
        },
        41: {
            title: "Jupiter",
            description: "Boost multiplier based on your time played.",
            cost: new Decimal(1e38),
            effect(){
                let effect = new Decimal(player.timePlayed).log(1.5).add(1)
                effect = softcap(effect, new Decimal(3), new Decimal(0.4))
                effect = softcap(effect, new Decimal(6), new Decimal(0.2))
                return effect
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                return hasUpgrade('a', 33)
            }
        },
        42: {
            title: "Saturn",
            description: "Boost multiplier based on Upgrade 3's effect, and remove Softcap 2.",
            cost: new Decimal(1e45),
            effect(){
                let effect = new Decimal(upgradeEffect('a', 13)).times(100).add(1)
                effect = softcap(effect, new Decimal(7), new Decimal(0.4))
                effect = softcap(effect, new Decimal(14), new Decimal(0.2))
                return effect
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                return hasUpgrade('a', 33)
            }
        },
        43: {
            title: "Uranus",
            description: "Raise multiplier to the power of 2.",
            cost: new Decimal('1e1800'),
            effect(){
                let effect = new Decimal(2)
                return effect
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                return hasUpgrade('a', 33)
            }
        },
        44: {
            title: "Neptune",
            description: "Raise multiplier to the power based on Upgrade 5's effect.",
            cost: new Decimal('1e3000'),
            effect(){
                let effect = new Decimal(upgradeEffect('a', 21)).pow(0.04).add(1)
                return effect
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                return hasUpgrade('a', 33)
            }
        },
        51: {
            title: "Pluto",
            description: "Raise multiplier to the power based on your knowledge, and nerf Softcap 3 by 96%.",
            cost: new Decimal('1e4400'),
            effect(){
                let effect = new Decimal(player.a.points).pow(0.04).log(1e8).add(1)
                return effect
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                return hasUpgrade('a', 33)
            }
        },
        52: {
            title: "Sedna",
            description: "Raise multiplier to the power based on your total upgrade amount.",
            cost: new Decimal('1e350000'),
            effect(){
                let effect = new Decimal(10).pow(player.a.upgrades.length)
                return effect
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                return hasUpgrade('a', 33)
            }
        },
        53: {
            title: "Oort Cloud",
            description: "Raise multiplier to the power based on your points.",
            cost: new Decimal('ee500'),
            effect(){
                let effect = player.points.log(10)
                if (hasUpgrade('a', 55)) effect = effect.pow(upgradeEffect('a', 55))
                return effect
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                return hasUpgrade('a', 33)
            }
        },
        54: {
            title: "Local Bubble",
            description: "Raise multiplier to the power based on upgrade 8's effect.",
            cost: new Decimal('eee40'),
            effect(){
                let effect = (upgradeEffect('a', 32)).pow(1e10)
                if (hasUpgrade('a', 61)) effect = effect.pow(upgradeEffect('a', 61))
                return effect
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                return hasUpgrade('a', 33)
            }
        },
        55: {
            title: "Milky Way",
            description: "Boost Upgrade 16 by ^ee10.",
            cost: new Decimal('eee750'),
            effect(){
                let effect = new Decimal('1e1e10')
                return effect
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                return hasUpgrade('a', 33)
            }
        },
        61: {
            title: "Local Group",
            description: "Boost Upgrade 17 by ^eee10.",
            cost: new Decimal('eee750'),
            effect(){
                let effect = new Decimal('1e1e1e10')
                return effect
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
            unlocked(){
                return hasUpgrade('a', 33)
            }
        },
    },
})
