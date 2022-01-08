addLayer("d", {
    name: "Year 3 (2017)", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Y3", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#4000ff",
    requires: new Decimal(1e40), // Can be a function that takes requirement increases into account
    branches: ["c"],
    resource: "Ideas", // Name of prestige currency
    baseResource: "knowledge", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.77, // Prestige currency exponent
    softcap: new Decimal(1),
    softcapPower(){return new Decimal(1).div(player.d.points.add(10).log(1e3))},

    effect(){
        let effect2 = new Decimal (1)
        if (player.d.points >= 1) effect2 = effect2.times(2).pow(player.d.points.log(3).add(0.1))
        if (inChallenge('c', 21)) effect2 = new Decimal(1)
        return effect2

  /*
    you should use this.layer instead of <layerID>
    Decimal.pow(num1, num2) is an easier way to do
    num1.pow(num2)
  */
    },
    effectDescription(){
        return "multiplying star effect by " + format(tmp[this.layer].effect) + " and raises the Knowledge gain to the power of " + format(tmp[this.layer].effect.log(10).add(1))
        /*
          use format(num) whenever displaying a number
        */
      },
    canBuyMax() {
        return (hasMilestone("d", 0))
        },
        
    milestones: {
            0: {requirementDescription: "3 Ideas",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "Year 3 prestiges resets nothing, and you can buy max ideas",
                effect() {
                    return player[this.layer].points.add(1).pow(0.22)
                },
                effect() {
                    return player.points.add(1).pow(0.21)
                },
            },
            1: {requirementDescription: "14 Ideas",
                done() {return player[this.layer].best.gte(14)},
                effectDescription: "Unlock 1 new Year 2 challenge",
                },
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "3", description: "3: Reset for Ideas", onPress(p){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            unlocked() {return player[this.layer].best.gte(1)},
            title: "Brain Wrinkle",
            description: "Gain more points based on your Ideas.",
            cost: new Decimal(3),
            effect() {
                return new Decimal(2).times(player.d.points).pow(player.d.points).add(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        12: {
            unlocked() {return player[this.layer].best.gte(1)},
            title: "Ice Highway",
            description: "Upgrade 'Premiere' is much stronger.",
            cost: new Decimal(13),
            effect() {
                return new Decimal(2).times(player.points.add(10).log(10)).pow(player.d.points).add(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
    },
    layerShown(){return player.a.best.gte(1e36) || player.d.best.gte(1)},
    resetsNothing() {
        return hasMilestone("d", 0)
        },
    doReset(resettingLayer) {
        let keep = []
        if (hasMilestone("d", 0)) keep.push("upgrades")
        if (hasMilestone("d", 0)) keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset("d", keep)
           },
    buyables: {
        
    }
})