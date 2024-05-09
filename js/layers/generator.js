addLayer("g", {
    name: "Generator",
    symbol: "G",
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        power: new Decimal(0),
    }},
    branches: [],
    color: "#80ff80",                       // The color for this layer, which affects many elements.
    resource: "Generators",            // The name of this layer's main prestige resource.
    row: 1,                                   // The row this layer is on (0 is the first row).
    position: 2,

    baseResource: "Experiences",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e11),              // The amount of the base needed to  gain 1 of the prestige currency.
    base () {
        return new Decimal(3)
    },
    

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent(){
        let exp = new Decimal(1.56)
        return exp
    },  
    hotkeys: [
        {
            key: "g", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "G: reset your Arts for Generators", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.g.unlocked) doReset("g") }, // Determines if you can use the hotkey, optional
        }
    ],                        // "normal" prestige gain is (currency^exponent).

    gainMult() {
        let mult = new Decimal(1)                          // Returns your multiplier to your gain of the prestige resource.
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade('b', 14) || player[this.layer].unlocked }, 
    passiveGeneration() {
    },
    power: {
        effect() {
            let a = tmp.g.buyables["effectup"].effect
            let effect = player.g.power.add(10).log(10).pow(a)
            return effect
        },
        perSecond() {
            let effect = new Decimal(2).pow(player.g.points)
            if (hasMilestone('g', 0)) effect = effect.times(3)
            if (player.g.points.lte(0)) effect = new Decimal(0)
            if (hasUpgrade('b', 22)) effect = effect.times(upgradeEffect('b', 22))
            if (hasUpgrade('a', 21)) effect = effect.times(upgradeEffect('a', 21))
            effect = effect.times(tmp.h.effect)
            if (hasMilestone('h', 0)) effect = effect.add(tmp.g.limit.effect.minus(player.g.power).times(0.02))
            if (player.g.power.gte(tmp.g.limit.effect)) effect = new Decimal(0)
            return effect
        },
    },
    limit:{
        effect() {
            let effect = new Decimal(50)
            if (getBuyableAmount('g', "limitup").gt(0)) effect = effect.times(tmp.g.buyables["limitup"].effect)
            if (hasUpgrade('g', 12)) effect = effect.times(upgradeEffect('g', 12))
            return effect
        },
    },
    update(delta) {
        player.g.power = player.g.power.add(Decimal.times(tmp.g.power.perSecond, delta));
        if (tmp.g.bars.genlimit.progress>=1) {
            player.g.power = tmp.g.limit.effect
        };
    },
    milestones: {
        0: {requirementDescription: "5 Generators",
            done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
            effectDescription: "x3 Generator Power gain, and keep your Art Upgrades on Generator resets.",
        },
    },
    buyables: {
        "limitup": {
            title: "Limit Increaser",
            cost(x) { 
                let base = new Decimal(15)
                let cost = new Decimal(base).pow(x).times(1e12)
                cost = softcap(cost, new Decimal(1e18), new Decimal(1).add(cost.add(10).log(10).div(18).minus(1)).pow(0.1))
                return cost 
            },
            effect(x){
                let power = new Decimal(3).pow(x)
                if (x.lte(0) && x.gte(0)) power = new Decimal(1)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + format(data.cost) + " Experiences"
                if (data.cost.lte(1) && data.cost.gte(1)) d1 = "Cost: " + format(data.cost) + " Experiences"
                return d1 + "\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies your Generator Limit by " + format(buyableEffect(this.layer, this.id))+"x"
            },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
            }, 
        },
        "effectup": {
            title: "Effect Increaser",
            cost(x) { 
                let base = new Decimal(10)
                let cost = new Decimal(base).pow(x).times(1e13)
                cost = softcap(cost, new Decimal(1e15), new Decimal(1).add(cost.add(10).log(10).div(15).minus(1)).pow(0.1))
                return cost 
            },
            effect(x){
                let power = new Decimal(1).add(x.times(0.3)).pow(0.7)
                if (hasUpgrade('a', 23)) power = new Decimal(1).add(x.times(0.35)).pow(0.73)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + format(data.cost) + " Experiences"
                if (data.cost.lte(1) && data.cost.gte(1)) d1 = "Cost: " + format(data.cost) + " Experiences"
                return `${d1}\n\
                Amount: ${player[this.layer].buyables[this.id]}\n\
                Raises your Generator Effect to ^${format(buyableEffect(this.layer, this.id))}`
            },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
            }, 
        },
    },

    upgrades:{
        11: {
            title: "More Motivation!",
            description: "Gain a 1.2x boost for Experience and Artwork Size per Generator obtained.",
            cost: new Decimal(5),
            effect() {
                let power = new Decimal(1.2).pow(player.g.points)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x for both" },
            unlocked(){ return player.g.unlocked },
        },
        12: {
            title: "I need More!",
            description: "The Generator Power cap is expanded based on your Generator Points.",
            cost: new Decimal(7),
            effect() {
                let power = new Decimal(1.22).pow(player.g.points)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return player.g.unlocked },
        },
        13: {
            title: "I need Dimensions!",
            description: "Unlock Art Dimensions.",
            cost: new Decimal(8),
            unlocked(){ return player.g.unlocked },
        },
        14: {
            title: "Dimensional Speedup",
            description: "Artspaces also boost Experience gain.",
            cost: new Decimal(9),
            effect() {
                let power = player.a.artspace.add(10).log(10).pow(2.8)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return hasUpgrade('g', 13) },
        },
    },
    bars: {
        genlimit: {
            direction: RIGHT,
            width: 500,
            height: 25,
            req(){
                let req = tmp.g.limit.effect
                return req
            },
            progress() {
                return (player.g.power.div(tmp.g.bars.genlimit.req))
            },
            unlocked() { return true },
            display() {
                return `Generator Limit: ${format(player.g.power)} / ${format(tmp.g.bars.genlimit.req)} (${format(100-tmp[this.layer].bars.genlimit.progress, 2)}%)`
            },
            fillStyle() {
                let r = 84
                let g = 168
                let b = 84
                return {
                    "background-color": ("rgb(" + r + ", " + g + ", " + b + ")")
                }
            },
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["bar", "genlimit"],
                ['display-text', function() {
                    return `You have ${format(player.g.power)} Generator Power, boosting Art Progress by ${format(tmp.g.power.effect)}x`}, { 'font-size': '15px', 'color': 'silver'}],
                ['display-text', function() {
                    return `You are gaining ${format(tmp.g.power.perSecond)} Generator Power per second`}, { 'font-size': '15px', 'color': 'silver'}],
                "blank",
                ["row", [['buyable', function() {if (player[this.layer].unlocked) return "limitup"}], "blank", ['buyable', function() {if (player[this.layer].unlocked) return "effectup"} ], ], ],
                "blank",
                function() {if (player[this.layer].unlocked) return "upgrades"}
            ],
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["bar", "genlimit"],
                ['display-text', function() {
                    return `You have ${format(player.g.power)} Generator Power, boosting Art Progress by ${format(tmp.g.power.effect)}x`}, { 'font-size': '15px', 'color': 'silver'}],
                ['display-text', function() {
                    return `You are gaining ${format(tmp.g.power.perSecond)} Generator Power per second`}, { 'font-size': '15px', 'color': 'silver'}],
                "blank",
                "milestones",
            ],
        },
    },
    doReset(prestige) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[prestige].row == this.row) return player.g.power = new Decimal(0);
        if (layers[prestige].row < this.row) return;
    
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 21, Milestones
        let keptUpgrades = [];
    
        // Stage 3, track which main features you want to keep - milestones
        let keep = [];
    
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
    
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades);
    },
})
