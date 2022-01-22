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
    effect() {
        let effect_c = new Decimal(1)
        effect_c = effect_c.times(new Decimal(1.5).pow(player.c.points))
        return softcap(effect_c, new Decimal(1e10), new Decimal(1).div(new Decimal(effect_c).pow(0.1)))
    },
    effectDescription(){
            return "boosting Flora gain by x" + format(tmp[this.layer].effect) + " and boosting points gain by x" + format(tmp[this.layer].effect.pow(2).times(10))       
    },

    })
    