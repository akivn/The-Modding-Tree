addLayer("g", {
    name: "Generator",
    symbol: "G",
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        power: new Decimal(0),
        auto() {
            if (!player.g.auto || !hasMilestone('h', 3)) return false
            else return true
        },
        buyableAuto() {
            if (!player.g.buyableAuto || !hasMilestone('h', 3)) return false
            else return true
        },
        disabled: false,
        upgDisabled: false
    }},
    nodeStyle() {
        return options.imageNode ? {
            'color': 'white',
            'background-image': 'url("resources/generators.jpeg")',
            'background-position': 'center center',
            'background-size': '120%',
            'border': '1px solid white'
        } : {
            'background-image': 'radial-gradient(circle at center, #80ff80, #408040)'
        }
    },
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
    canBuyMax() {
        return hasMilestone('h', 2)
    },
    autoPrestige() {
        return (hasMilestone('h', 3) && player.g.auto)
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
        if (hasUpgrade('a', 33)) mult = mult.div(upgradeEffect('a', 33))
        if (hasAchievement('ac', 61)) mult = mult.div(10)
        if (hasUpgrade ('i', 112)) mult = mult.times(upgradeEffect('i', 112))
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade('b', 14) || player[this.layer].unlocked }, 
    passiveGeneration() {
    },
    resetsNothing() {
        return hasMilestone('h', 5)
    },
    power: {
        effect() {
            let a = tmp.g.buyables["effectup"].effect
            let effect = player.g.power.add(10).log(10).pow(a)
            if (player.g.disabled) effect = new Decimal(1)
            return effect
        },
        perSecond() {
            let base = new Decimal(2)
            if (hasUpgrade('a', 23)) base = base.add(upgradeEffect('a', 23))
            let effect = new Decimal(base).pow(player.g.points)
            if (hasMilestone('g', 0)) effect = effect.times(3)
            if (player.g.points.lte(0)) effect = new Decimal(0)
            if (hasUpgrade('b', 22)) effect = effect.times(upgradeEffect('b', 22))
            effect = effect.times(tmp.h.effect2)
            if (hasAchievement('ac', 41)) effect = effect.add(tmp.g.limit.effect.minus(player.g.power).times(0.01))
            return effect
        },
    },
    limit:{
        effect() {
            let effect = new Decimal(50)
            if (getBuyableAmount('g', "limitup").gt(0)) effect = effect.times(tmp.g.buyables["limitup"].effect)
            if (hasUpgrade('g', 12)) effect = effect.times(upgradeEffect('g', 12))
            if (hasUpgrade('h', 21)) effect = effect.pow(upgradeEffect('h', 21))
            if (hasUpgrade('br', 13)) effect = effect.times(upgradeEffect('br', 13))
            return effect
        },
    },
    update(delta) {
        player.g.power = Decimal.max(player.g.power.add(Decimal.times(Decimal.min(tmp.g.power.perSecond, tmp.g.limit.effect.minus(player.g.power).times(20)), delta)), 0);
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
                if (hasUpgrade('a', 22) && !(player.a.upgDisabled)) power = new Decimal(1).add(x.times(0.36)).pow(0.73)
                if (hasUpgrade('i', 21)) power = power.times(1.2)
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
                if (player.g.upgDisabled) power = new Decimal(1)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x for both" },
            unlocked(){ return player.g.unlocked },
        },
        12: {
            title: "I need More!",
            description: "The Generator Power cap is expanded based on your Generators.",
            cost: new Decimal(7),
            effect() {
                let power = new Decimal(1.22).pow(player.g.points)
                if (player.g.upgDisabled) power = new Decimal(1)
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
                if (player.g.upgDisabled) power = new Decimal(1)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return hasUpgrade('g', 13) || player.h.unlocked },
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
                if (tmp.g.limit.effect.minus(player.g.power).div(tmp.g.power.perSecond).lte(0.05)) return (player.g.power.add(Decimal.times(Decimal.min(tmp.g.power.perSecond, tmp.g.limit.effect.minus(player.g.power).times(20)), 0.05)).div(tmp.g.bars.genlimit.req))
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
        if (hasMilestone('h', 1) || hasMilestone('i', 2)) keep.push("milestones")
        if (hasMilestone('h', 3)) keep.push("upgrades")
    
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
    
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades);
        if (!hasMilestone('h', 3)) player.g.buyableAuto = false
        if (!hasMilestone('h', 3)) player.g.auto = false
        player.h.time = new Decimal(0)
        player.g.power = new Decimal(0)
        player.br.level = new Decimal(0)
        player.br.exp = new Decimal(0)
        player.br.exptotal = new Decimal(0)
        player.br.buff = new Decimal(0)
    },
    automate(){
        if (player.g.buyableAuto && hasMilestone("h", 3) && !player.crunch.crunched) {
            for(i=1;i<101;i++){
                buyBuyable("g", "limitup")
                buyBuyable("g", "effectup")
            }
        };
    },
})
