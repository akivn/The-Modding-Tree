addLayer("br", {
    name: "Breakthrough", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "BR", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 2, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        exp: new Decimal(0),
        exptotal: new Decimal(0),
        level: new Decimal(0),
        buff: new Decimal(0),
        bulk: false,
        bulkLevel: new Decimal(0),
        buyableAuto() {
            if (!player.a.buyableAuto || !hasMilestone('i', 7)) return false
            else return true
        },
        auto() {
            if (!player.br.auto || !hasMilestone('i', 11)) return false
            else return true
        },
    }},
    nodeStyle() {
        return options.imageNode ? {
            'color': 'black',
            'background-image': 'url("resources/Humpty_Lock.webp")',
            'background-position': 'center center',
            'background-size': '100%',
            'border': '1px solid white'
        } : {
            'background-image': 'radial-gradient(circle at center, #f5cb51, #7a6528)'
        }
    },
    color: "#f5cb51",
    resource: "Breakthrough Points", 
    base: new Decimal(2).pow(128),
    requires: new Decimal(2).pow(512),             // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.5,  
    autoPrestige() {
        return (hasMilestone('i', 11) && player.br.auto)
    },  
    baseResource: "Arts", // Name of resource prestige is based on
    branches: ['h', 'g'],
    baseAmount() { return player.a.points },  // A function to return the current amount of baseResource.
    canBuyMax() {return true},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    resetsNothing() {
        return hasMilestone('i', 11)
    },
    perSecond() {
        let effect = player.a.points.add(10).log(10).div(100).times(player.br.points.pow(1.5))
        effect = effect.times(buyableEffect('br', 11))
        effect = effect.times(buyableEffect('br', 12))
        if (hasUpgrade('a', 32)) effect = effect.times(upgradeEffect('a', 32))
        return effect
    },
    nextBuff() {
        let next = new Decimal(3).times(player.br.buff.add(1))
        if (player.br.buff.gte(4)) next = new Decimal(1e310)
        return next
    },
    update(delta) {
        player.br.exp = player.br.exp.add(Decimal.times(tmp.br.perSecond, delta))
        player.br.exptotal = player.br.exptotal.add(Decimal.times(tmp.br.perSecond, delta))
        if (tmp[this.layer].bars.xpbar.progress>=1) {
            let target = new Decimal(0)
            for (i=1;i<1001;i++) {
                let a = player[this.layer].exp
                let mult = new Decimal(0.01)
                let req = new Decimal(15).times(new Decimal(1.1).add(target.times(mult)).pow(target))
                if (hasChallenge('i', 12)) req = new Decimal(15).times(new Decimal(1.08).add(target.times(mult)).pow(target.div(1.1)))
                req = softcap(req, new Decimal(305), new Decimal(2))
                req = softcap(req, new Decimal(5.67e9), new Decimal(1).add(req.add(10).log(10).div(100)))
                if (hasUpgrade('i', 152)) req = req.div(upgradeEffect('i', 152))
                if (a.gte(req)) {
                    target = target.add(1)
                }
                if (a.lt(req)) break
            }
            player[this.layer].level = player[this.layer].level.max(target)
            player[this.layer].exp = new Decimal(0)
        };
        if (player.br.level.gte(tmp.br.nextBuff)) player.br.buff = player.br.buff.add(1)
    },
    effect1() {
        let effect = player.br.level.minus(2).div(20).add(1)
        let base = new Decimal(0.7)
        effect = softcap(effect, new Decimal(1), new Decimal(1).div(effect.log(10).add(1).pow(base)))
        if (hasUpgrade('a', 34) && !(player.a.upgDisabled)) effect = effect.pow(1.1)
        if (hasUpgrade('i', 81)) effect = effect.pow(upgradeEffect('i', 81))
        return effect 
    },
    effect2() {
        let effect = new Decimal(1.3).pow(player.br.level.minus(5))
        let base = new Decimal(0.6)
        effect = softcap(effect, new Decimal(1), new Decimal(1).div(effect.log(10).div(6).add(1).pow(base)))
        if (hasUpgrade('a', 34) && !(player.a.upgDisabled)) effect = effect.pow(1.1)
        if (hasUpgrade('i', 81)) effect = effect.pow(upgradeEffect('i', 81))
        return effect 
    },
    effect3() {
        let effect = new Decimal(0.0222).times(player.br.level.minus(8)).add(1)
        let base = new Decimal(0.5)
        effect = softcap(effect, new Decimal(1), new Decimal(1).div(effect.add(1).pow(base)))
        if (hasUpgrade('a', 34) && !(player.a.upgDisabled)) effect = effect.pow(1.1)
        if (hasUpgrade('i', 81)) effect = effect.pow(upgradeEffect('i', 81))
        return effect 
    },
    effect4() {
        let effect = new Decimal(1.5).pow(player.br.level.minus(11))
        let base = new Decimal(0.6)
        effect = softcap(effect, new Decimal(1), new Decimal(1).div(effect.log(10).div(3).add(1).pow(base)))
        if (hasUpgrade('a', 34) && !(player.a.upgDisabled)) effect = effect.pow(1.1)
        if (hasUpgrade('i', 81)) effect = effect.pow(upgradeEffect('i', 81))
        return effect 
    },
    bars: {
        xpbar: {
            direction: RIGHT,
            width: 666,
            height: 44,
            req(){
                let mult = new Decimal(0.01)
                let req = new Decimal(15).times(new Decimal(1.1).add(player.br.level.times(mult)).pow(player.br.level))
                if (hasChallenge('i', 12)) req = new Decimal(15).times(new Decimal(1.08).add(player.br.level.times(mult)).pow(player.br.level.div(1.1)))
                req = softcap(req, new Decimal(305), new Decimal(2))
                req = softcap(req, new Decimal(5.67e9), new Decimal(1).add(req.add(10).log(10).div(100)))
                if (hasUpgrade('i', 152)) req = req.div(upgradeEffect('i', 152))
                return req
            },
            base(){
                return new Decimal(0)
            },
            progress() {
                return (player.br.exp.minus(tmp.br.bars.xpbar.base)).div(tmp.br.bars.xpbar.req.minus(tmp.br.bars.xpbar.base))
            },
            unlocked() { return true },
            display() {
                return `You are at Level ${commaFormat(player.br.level)}<br>Next Level at ${formatWhole(player.br.exp)} / ${formatWhole(tmp[this.layer].bars.xpbar.req)} XP (${format(100-tmp[this.layer].bars.xpbar.progress, 3)}%)`
            },
            fillStyle() {
                let r = 122 - (0) * tmp.br.bars.xpbar.progress
                let g = 101 + (0) * tmp.br.bars.xpbar.progress
                let b = 40 + (0) * tmp.br.bars.xpbar.progress
                return {
                    "background-color": ("rgb(" + r + ", " + g + ", " + b + ")")
                }
            },
        },
    },

    upgrades: {
        11: {
            title: "Amulet Heart",
            description: "Artspace softcap scales even softer based on your Boosters.",
            cost: new Decimal(20),
            currencyDisplayName: "Levels",
            currencyInternalName: "level",
            currencyLayer: 'br',
            effect() {
                let power = new Decimal(0.125).add(new Decimal(0.5).div(player.b.points.div(200).add(1).pow(0.4)).pow(player.h.points.add(10).log(10).div(18).add(1).pow(0.675)))
                if (power.lte(0.125)) power = new Decimal(0.125)
                return power
            },
            effectDisplay() { return "Power "+format(upgradeEffect(this.layer, this.id), 4) },
            unlocked(){ return true},
        },
        12: {
            title: "Amulet Spade",
            description: "Re: Motivation is now raised to ^1.3.",
            cost: new Decimal(25),
            currencyDisplayName: "Levels",
            currencyInternalName: "level",
            currencyLayer: 'br',
            unlocked(){ return true},
        },
        13: {
            title: "Amulet Clover",
            description: "Generator Power limit is boosted based on your Honour.",
            cost: new Decimal(30),
            currencyDisplayName: "Levels",
            currencyInternalName: "level",
            currencyLayer: 'br',
            effect() {
                let power = player.h.points.add(1).pow(0.375)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return true},
        },
    },
    buyables: {
        11: {
            title: "XP Gain 1",
            cost(x) { 
                let base = new Decimal(1.03).add(x.times(0.001))
                let cost = new Decimal(base).pow(x).times(34).ceil()
                return cost 
            },
            effect(x){
                let power = new Decimal(1.5).pow(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + formatWhole(data.cost) + " Generators"
                if (data.cost.lte(1) && data.cost.gte(1)) d1 = "Requires: " + formatWhole(data.cost) + " Generators"
                return `${d1}\n\
                Amount: ${player[this.layer].buyables[this.id]}\n\
                Gain ${format(buyableEffect(this.layer, this.id))}x more XP per second`
            },
            canAfford() { return player.g.points.gte(this.cost()) && player.br.unlocked },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
            }, 
        },
        12: {
            title: "XP Gain 2",
            cost(x) { 
                let base = new Decimal(10)
                let cost = new Decimal(base).pow(x).times(1e12).ceil()
                return cost 
            },
            effect(x){
                let power = new Decimal(2).pow(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + formatWhole(data.cost) + " Honours"
                if (data.cost.lte(1) && data.cost.gte(1)) d1 = "Cost: " + formatWhole(data.cost) + " Honours"
                return `${d1}\n\
                Amount: ${player[this.layer].buyables[this.id]}\n\
                Gain ${format(buyableEffect(this.layer, this.id))}x more XP per second`
            },
            canAfford() { return player.h.points.gte(this.cost()) && player.br.unlocked },
            buy() {
                player.h.points = player.h.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
            }, 
        },
    },
    milestones: {

    },
    challenges: {
        
    },
    clickables: {

    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["bar", "xpbar"],
                "blank",
                ['display-text', function() {
                    return `You are gaining ${format(tmp.br.perSecond)} XP per second`}, { 'font-size': '15px', 'color': 'silver'}
                ],
                "blank",
                ['display-text', function() {
                    return `You have ${commaFormat(player.br.buff)} buffs` }, { 'font-size': '15px', 'color': 'silver'}
                ],
                ['display-text', function() {
                    if (player.br.buff.gte(0) && player.br.buff.lte(0)) return `Next buff unlocks at Level 3`
                    return `Boosting upgrade 'Receive Honour' by ^${format(tmp.br.effect1, 4)}` }, { 'font-size': '15px', 'color': 'silver'}
                ],
                ['display-text', function() {
                    if (player.br.buff.lte(0)) return 
                    if (player.br.buff.gte(1) && player.br.buff.lte(1)) return `Next buff unlocks at Level 6`
                    return `Boosting Art gain by ${format(tmp.br.effect2)}x` }, { 'font-size': '15px', 'color': 'silver'}
                ],
                ['display-text', function() {
                    if (player.br.buff.lte(1)) return 
                    if (player.br.buff.gte(2) && player.br.buff.lte(2)) return `Next buff unlocks at Level 9`
                    return `Boosting Super Boosters' effect by ${format(tmp.br.effect3, 4)}x` }, { 'font-size': '15px', 'color': 'silver'}
                ],
                ['display-text', function() {
                    if (player.br.buff.lte(2)) return 
                    if (player.br.buff.gte(3) && player.br.buff.lte(3)) return `Next buff unlocks at Level 12`
                    return `Boosting Honour gain by ${format(tmp.br.effect4)}x` }, { 'font-size': '15px', 'color': 'silver'}
                ],
                "blank",
                "buyables",
                "blank",
                "upgrades",
            ],
        },
    },
    doReset(pp) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[pp].row <= this.row) return;
    
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 21, Milestones
        let keptUpgrades = [];
    
        // Stage 3, track which main features you want to keep - milestones
        let keep = [];
        if (hasMilestone('i', 10)) keep.push("upgrades")
    
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
    
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades);
    },
    automate() {
        if (hasMilestone('i', 7) && player.br.buyableAuto && !player.crunch.crunched) {
            for (i=1;i<101;i++) {
                buyBuyable('br', 11)
                buyBuyable('br', 12)
            }
        }
    },  

    layerShown(){return hasUpgrade('h', 24) || player[this.layer].unlocked}
  }
)