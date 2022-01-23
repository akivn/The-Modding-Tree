addLayer("d", {
    name: "Year 4",
    symbol: "Y4",
    position: 0, 
    branches: [],
    startData() { return {
    unlocked: true,
    points: new Decimal(0),
    best: new Decimal(0),
    total: new Decimal(0),
    resetTime: 0
    }},    
    color: "#808080",
    requires: new Decimal(150),
    resource: "Robotic Parts",
    baseResource: "stars",
    baseAmount() {
    return player.b.points
    },
    type: "static",
    exponent: 1.2,
    base: 1.016,
    gainMult() {
    mult = new Decimal(1)
    return mult
    },
    gainExp() {
    exp = new Decimal(1)
    return exp
    },
    passiveGeneration() {
        },   
    row: 3,
    hotkeys: [{
    key: "4", 
    description: "4: Reset for Year 4 points", 
    onPress() { if (player.c.unlocked) doReset("d") },
    unlocked() {
    return player[this.layer].unlocked
    },
    }],
    layerShown() {
    return hasChallenge('b', 42) || player[this.layer].best.gte(1)
    },
    doReset() {
    let keep = []
    },
    softcap: new Decimal(100),
    softcapPower: 0.25,

    effect() {
        let effect = new Decimal(1)
        return effect
    },
    effectDescription(){
            return "boosting Flora gain by x" + format(tmp[this.layer].effect) + " and boosting points gain by x" + format(tmp[this.layer].effect.pow(2).times(10))       
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                        function() {return 'Prestige to endgame RB5!'},
                        {"color": "white", "font-size": "17px"}],
                "upgrades",
            ],
        },
    },

    })