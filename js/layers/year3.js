addLayer("c", {
    name: "Year 3",
    symbol: "Y3",
    position: 0, 
    branches: ["d"],
    startData() { return {
    unlocked: true,
    points: new Decimal(0),
    best: new Decimal(0),
    total: new Decimal(0),
    resetTime: 0
    }},    
    color: "#d12216",
    requires: new Decimal(1e200),
    resource: "Power",
    baseResource: "points",
    baseAmount() {
    return player.points
    },
    type: "normal",
    exponent: 0.30102999566398,
    gainMult() {
    mult = new Decimal(1)
    if (hasUpgrade('a', 45)) mult = mult.times(upgradeEffect('a', 45))
    return mult
    },
    gainExp() {
    exp = new Decimal(1)
    return exp
    },
    passiveGeneration() {
        return hasMilestone("s", 0) ? 0.3:0
        },   
    row: 2,
    hotkeys: [{
    key: "3", 
    description: "3: Reset for Year 3 points", 
    onPress() { if (player.c.unlocked) doReset("c") },
    unlocked() {
    return player[this.layer].unlocked
    },
    }],
    layerShown() {
    return hasUpgrade('a', 41) || player[this.layer].best.gte(1)
    },
    doReset() {
    let keep = []
    },
    softcap: new Decimal(1e10),
    softcapPower: 0.25,

    effect() {
        let effect_c = new Decimal(1)
        effect_c = effect_c.times(new Decimal(player.c.points).pow(1.5).add(2))
        effect_c = softcap(effect_c, new Decimal(1e6), new Decimal(1).div(new Decimal(effect_c).log(1e6).log(2).add(1)))
        if (hasUpgrade('c', 11)) effect_c = effect_c.times(12.5)
        if (hasUpgrade('c', 12)) effect_c = effect_c.times(upgradeEffect('c', 12))
        if (getBuyableAmount('c', 11).gte(1)) effect_c = effect_c.times(buyableEffect('c', 11))
        if (getBuyableAmount('c', 12).gte(1)) effect_c = effect_c.times(buyableEffect('c', 12))
        if (inChallenge('b', 41)) effect_c = new Decimal(1)
        if (inChallenge('b', 42)) effect_c = new Decimal(1)
        return effect_c
    },
    effectDescription(){
            return "boosting Flora gain by x" + format(tmp[this.layer].effect) + " and boosting points gain by x" + format(tmp[this.layer].effect.pow(2).times(10))       
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
                "milestones"
            ],
        },
        "Robots": {
            content: [
                "main-display",
                "prestige-button",
                "buyables",
            ],
        },
    },
    milestones: {
        0: {
            requirementDescription: "1 Power",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "You can now buy max Stars.",
        },
        1: {
            requirementDescription: "5 Power",
            done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
            effectDescription: "Keep Everything of Year 2 on Year 3 resets.",
        },
        2: {
            requirementDescription: "10,000,000 Power",
            done() {return player[this.layer].best.gte(1e7)}, // Used to determine when to give the milestone
            effectDescription: "Keep Mind-Generators and Flowers on Year 3 resets, unlock 4 new upgrades, and automates the gain of Year 2 Stars.",
        },
        3: {
            requirementDescription: "1e17 Power",
            done() {return player[this.layer].best.gte(1e17)}, // Used to determine when to give the milestone
            effectDescription: "Flowers now Autobuys.",
        },
        4: {
            requirementDescription: "1e40 Power",
            done() {return player[this.layer].best.gte(1e40)}, // Used to determine when to give the milestone
            effectDescription: "SG now Autobuys.",
        },

    },
    upgrades: {
        11: {
            title: "Lower Village Station",
            description: "Give a 12.5x boost to Power effect, which omits the softcap.",
            cost: new Decimal(1e14),
        },
        12: {
            title: "Rainbow Bridge",
            description: "My first Minecraft Bridge. It boosts the effect of Power based on your brain cells. Omits the softcap.",
            cost: new Decimal(3e14),
            effect() {
                let effect = new Decimal(10).pow(player.a.points.add(1).log(1e30))
                if (hasUpgrade('a', 35)) effect = effect.pow(2)
                effect = softcap(effect, new Decimal(1e10), new Decimal(1).div(4.5))
                if (hasChallenge('b', 12)) effect = effect.pow(2.5)
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked (){
                return hasMilestone('c', 2)
            }
        },
        13: {
            title: "Ice Highway",
            description: "My first Minecraft Builds. It unlocks 7 new challenges in Year 2. ",
            cost: new Decimal(1e16),
            unlocked (){
                return hasMilestone('c', 2)
            }
        },
        14: {
            title: "Upper Primary Transition",
            description: "Boost Star effect based on your Flora amount. (Omits the softcap.) ",
            cost: new Decimal(1e20),
            effect() {
                let effect = new Decimal(3).pow(player.fl.points.add(1).log(1e6))
                effect = softcap(effect, new Decimal(1e40), new Decimal(1).div(2.4))
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked (){
                return hasMilestone('c', 2)
            }
        },
        15: {
            title: "Supernova boost",
            description: "Unlock 7 new upgrades for Year 1, 5 new upgrades for Year 3, and boost Dandelion production based on your stars. (Omits the softcap.) ",
            cost: new Decimal(1e21),
            effect() {
                let effect = new Decimal(3.3).pow(player.b.points)
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked (){
                return hasMilestone('c', 2)
            }
        },
        21: {
            title: "Gen-3 boost",
            description: "Nerfs the 2nd softcap of the Flora boost by ^1.5. ",
            cost: new Decimal(3e51),
            unlocked (){
                return hasUpgrade('c', 15)
            }
        },
        22: {
            title: "Route 104",
            description: "SG effect is boosted based on your stars. ",
            cost: new Decimal(1e104),
            effect() {
                let effect = new Decimal(1.4).pow(player.b.points).add(1)
                effect = softcap(effect, new Decimal(1e25), new Decimal(0.4))
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked (){
                return hasUpgrade('c', 15)
            }
        },
        23: {
            title: "Metropolis Station",
            description: "My first Terminus-Level station. It boosts Star effect by ^4. ",
            cost: new Decimal(1e119),
            unlocked (){
                return hasUpgrade('c', 15)
            }
        },
        24: {
            title: "Nature Reservation",
            description: "Fauna production is boosted based on your Power, and Fauna buyables now autobuys. ",
            cost: new Decimal(1e129),
            effect() {
                let effect = new Decimal(player.c.points).pow(0.1)
                effect = softcap(effect, new Decimal(1e14), new Decimal(0.4))
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked (){
                return hasUpgrade('c', 15)
            }
        },
        25: {
            title: "The Zenith",
            description: "SGs are boosted by ^10 (omits the softcap), and now boost Brain cells gain.",
            cost: new Decimal(6e130),
            unlocked (){
                return hasUpgrade('c', 15)
            }
        },
    },
    buyables:{
        11: {
            title: "Robot 1",
            cost(x) { 
                let cost = new Decimal(4.166666666666666666e55).times(new Decimal(1.2).pow(x.add(1)))
                cost = softcap(cost, new Decimal(1e57), new Decimal(1.2).add(cost.pow(0.002).pow(x.pow(0.2)))) 
                return softcap(cost, new Decimal(1e75), new Decimal(1.2).add(cost.pow(0.01).pow(x.pow(0.4)))) 
            },
            effect(x){
                let power = new Decimal(1).mul(new Decimal(100).pow(x))
                return softcap(power, new Decimal(1e5), new Decimal(0.4))
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " brain cells\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Power effect by " + format(buyableEffect(this.layer, this.id))+"x"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        12: {
            title: "Robot 2",
            cost(x) { 
                let cost = new Decimal(1e75).times(new Decimal(1.6).pow(x.add(1)))
                return softcap(cost, new Decimal(1e100), new Decimal(1.2).add(cost.pow(0.0045).pow(x.pow(0.2)))) 
            },
            effect(x){
                let power = new Decimal(1).mul(new Decimal(100).pow(x))
                return softcap(power, new Decimal(1e5), new Decimal(0.4))
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " brain cells\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Power effect by " + format(buyableEffect(this.layer, this.id))+"x"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },

    })
    