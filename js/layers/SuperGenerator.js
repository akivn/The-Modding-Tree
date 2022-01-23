addLayer("s", {
    name: "Super-Generator",
    symbol: "SG",
    position: 0, 
    branches: [],
    startData() { return {
    unlocked: true,
    points: new Decimal(0),
    best: new Decimal(0),
    total: new Decimal(0),
    resetTime: 0
    }},    
    color: "#2266aa",
    requires: new Decimal(1e280),
    resource: "Reincaranations",
    baseResource: "Brain Cells",
    baseAmount() {
    return player.a.points
    },
    type: "static",
    exponent: 1,
    base: 1e40,
    softcap: 10,
    softcapPower: 0.5,
    gainMult() {
    mult = new Decimal(1)
    return mult
    },
    gainExp() {
    exp = new Decimal(1)
    return exp
    },
    row: 1,
    hotkeys: [{
    key: "s", 
    description: "s: Reset for Reincaranations", 
    onPress() { if (player.s.unlocked) doReset("s") },
    unlocked() {
    return player[this.layer].unlocked
    },
    }],
    layerShown() {
    return hasChallenge('b', 21) || player[this.layer].best.gte(1)
    },
    doReset(layer) {
    if (!(layers[layer].row > this.row)) return
    let keep = []
    layerDataReset(this.layer, keep)
    },
    effect() {
        let effect = new Decimal(1)
        effect = effect.times(10).pow(player.s.points)
        effect = softcap(effect, new Decimal(1e10), new Decimal(0.5))
        if (inChallenge('b', 31)) effect = new Decimal(1)
        if (inChallenge('b', 32)) effect = new Decimal(1)
        if (hasUpgrade('c', 22)) effect = effect.times(upgradeEffect('c', 22))
        if (hasUpgrade('c', 25)) effect = effect.pow(10)
        if (inChallenge('b', 42)) effect = new Decimal(1)
        return effect
    },
    effectDescription(){
            return "boosting Mind-Generators by x" + format(tmp[this.layer].effect)     
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "milestones",
            ],
        },
    },
    milestones: {
        0: {
        requirementDescription: "20 Reincaranations",
            done() {return player[this.layer].best.gte(20)}, // Used to determine when to give the milestone
            effectDescription: "You can buy max SGs, and get 30% of Power every second.",
        },

    },
    autoPrestige() {
        return hasMilestone('c', 4)
    },
    canBuyMax() {
        return hasMilestone('s', 0)
    }

    })