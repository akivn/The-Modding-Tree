addLayer("b", {
    name: "Booster",
    symbol: "B",
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        auto() {
            if (!player.b.auto || !hasMilestone('h', 3)) return false
            else return true
        },
    }},
    nodeStyle() {
        return options.imageNode ? {
            'color': 'white',
            'background-image': 'url("resources/booster.png")',
            'background-position': 'center center',
            'background-size': '100%',
            'border': '1px solid white'
        } : {
            'background-image': 'radial-gradient(circle at center, #6e64c4, #373262)'
        }
    },
    branches: ['g', 'h', 'sb'],
    color: "#6e64c4",                       // The color for this layer, which affects many elements.
    resource: "Boosters",            // The name of this layer's main prestige resource.
    row: 1,                                   // The row this layer is on (0 is the first row).
    position: 1,

    baseResource: "Arts",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.a.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(500),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent(){
        let exp = new Decimal(1.6).add(Decimal.max(90, player.b.points.add(getResetGain('b', "static"))).minus(90).times(0.0004))
        return exp
    },
    canBuyMax() {
        return hasMilestone('h', 2)
    },
    autoPrestige() {
        return (hasMilestone('h', 3) && player.b.auto)
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
        if (hasUpgrade('h', 13)) mult = mult.div(upgradeEffect('h', 13))
        if (hasUpgrade('i', 72)) mult = mult.div(upgradeEffect('i', 72))
        if (hasAchievement('ac', 61)) mult = mult.div(10)
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade('a', 14) || player[this.layer].unlocked }, 
    passiveGeneration() {
    },
    resetsNothing() {
        return hasMilestone('h', 5)
    },
    effect() {
        let base = new Decimal(2)
        base = base.add(tmp.sb.effect)
        if (hasChallenge('i', 11)) base = base.add(0.3)
        if (hasUpgrade('i', 113)) base = base.add(upgradeEffect('i', 113))
        if (hasAchievement('ac', 25)) base = base.add(achievementEffect('ac', 25))
        let effect = new Decimal(base).pow(player[this.layer].points)
        softcap(effect, new Decimal(1), new Decimal(1).div(effect.add(10).log(10).div(10).add(1).pow(0.5)))
        if (inChallenge('i', 21)) effect = effect.pow(0.5)
        return effect
    },
    effectDescription(){
        return "boosting Art and Experience gain by x" + format(tmp[this.layer].effect)        
    },
    milestones: {
        0: {requirementDescription: "4 Boosters",
            done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
            effectDescription: "Unlock Automation for Booster gain.",
            onComplete(){
                player.a.auto = true
            }
        },
        1: {requirementDescription: "7 Boosters",
            done() {return player[this.layer].best.gte(7)}, // Used to determine when to give the milestone
            effectDescription: "x4 to Art Progress, and you can now gain Artworks over 10/s.",
        },
        2: {requirementDescription: "10 Boosters",
            done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
            effectDescription: "Unlock Automation for Art Buyables, and keep your Art Upgrades on Booster resets.",
            onComplete(){
                player.a.buyableAuto = true
            }
        },
    },

    upgrades:{
        11: {
            title: "Faster Working",
            description: "Boost Artwork progress based on your boosters.",
            cost: new Decimal(3),
            effect() {
                let power = new Decimal(2).times(player.b.points.div(2).add(1).pow(2))
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
        21: {
            title: "WE NEED MORE ART",
            description: "Art gain is raised to ^1.2.",
            cost: new Decimal(12),
            unlocked(){ return hasUpgrade('b', 14) },
        },
        22: {
            title: "Generation Boost",
            description: "Generator Power gain is boosted by your Boosters.",
            cost: new Decimal(14),
            effect() {
                let power = player.b.points.add(1).pow(1.5)
                power = softcap(power, new Decimal(1), new Decimal(1).div(power.log(10).div(5).add(1).pow(0.07)))
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return hasUpgrade('b', 14)  },
        },
        23: {
            title: "Arty Madness",
            description: "Every Booster you get boosts Art Dimensions by x1.06.",
            cost: new Decimal(18),
            effect() {
                let power = new Decimal(1.06).pow(player.b.points)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return hasUpgrade('b', 14)  },
        },
        24: {
            title: "We need more Art Upgrades!",
            description: "Unlock 4 new Art Upgrades.",
            cost: new Decimal(19),
            unlocked(){ return hasUpgrade('b', 14) },
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "upgrades",
            ],
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "milestones",
            ],
        },
    },
    doReset(prestige) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[prestige].row <= this.row) return;
    
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 21, Milestones
        let keptUpgrades = [];
        for(i=4;i<5;i++){ //rows
            for(v=1;v<2;v++){ //columns
                if (hasUpgrade(this.layer, i+v*10)) keptUpgrades.push(i+v*10)
              }
        }
    
        // Stage 3, track which main features you want to keep - milestones
        let keep = [];
        if (hasMilestone('h', 1) || hasMilestone('i', 1)) keep.push("milestones")
        if (hasMilestone('h', 3)) keep.push("upgrades")
    
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
    
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades);
        if (!hasMilestone('h', 3)) player.b.auto = false
    },
})
