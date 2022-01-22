addLayer("c", {
    name: "Year 3",
    symbol: "Y3",
    position: 0, 
    branches: [],
    startData() { return {
    unlocked: true,
    points: new Decimal(0),
    best: new Decimal(0),
    total: new Decimal(0),
    resetTime: 0
    }},    
    color: "#d12216",
    requires: new Decimal(1e182),
    resource: "Power",
    baseResource: "points",
    baseAmount() {
    return player.points
    },
    type: "normal",
    exponent: 0.30102999566398,
    gainMult() {
    mult = new Decimal(1)
    return mult
    },
    gainExp() {
    exp = new Decimal(1)
    return exp
    },
    row: 2,
    hotkeys: [{
    key: "3", 
    description: "3: Reset for Year 3 points", 
    onPress() {
    if (canReset(this.layer)) doReset(this.layer)
    },
    unlocked() {
    return player[this.layer].unlocked
    },
    }],
    layerShown() {
    return hasUpgrade('a', 41) || player[this.layer].best.gte(1)
    },
    doReset(layer) {
    if (!(layers[layer].row > this.row)) return
    let keep = []
    layerDataReset(this.layer, keep)
    },
    softcap: new Decimal(1e10),
    softcapPower: 0.25,

    effect() {
        let effect_c = new Decimal(1)
        effect_c = effect_c.times(new Decimal(player.c.points).pow(1.5).add(2))
        effect_c = softcap(effect_c, new Decimal(1e6), new Decimal(1).div(new Decimal(effect_c).log(1e6).log(2).add(1)))
        if (hasUpgrade('c', 11)) effect_c = effect_c.times(12.5)
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
        }
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
            effectDescription: "Keep Mind-Generators on Year 3 resets, and unlock 4 new upgrades.",
        },

    },
    upgrades: {
        11: {
            title: "Lower Village Station",
            description: "Give a 12.5x boost to Power effect, which omits the softcap.",
            cost: new Decimal(3e7),
        },
    },

    })
    