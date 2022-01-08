addLayer("c", {
    name: "Year 2 (2016)", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Y2", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#0080ff",
    requires: new Decimal(6e6), // Can be a function that takes requirement increases into account
    branches: ["a"],
    resource: "Stars", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2.44, // Prestige currency exponent
    softcap: new Decimal(8), 
        softcapPower: new Decimal(0.22),
    effect(){
        let effect1 = new Decimal (1)
        if (player.c.points >= 1) effect1 = effect1.times(2).pow(player.c.points)
        if (hasChallenge('c', 11)) effect1 = effect1.times(player.c.points).pow(3)
        if (hasUpgrade('a', 24)) effect1 = effect1.times(upgradeEffect('a', 24))
        if (inChallenge('c', 11)) effect1 = Math.sqrt(effect1)
        if (inChallenge('c', 12)) effect1 = Math.sqrt(effect1)
        if (inChallenge('c', 21)) effect1 = Math.sqrt(effect1)
        effect1 = new Decimal(effect1)
        if (hasMilestone('c', 1)) effect1 = effect1.times(tmp.c.milestones[1].effect)
        if (player.d.points >= 1) effect1 = effect1.times(tmp.d.effect)
        return effect1

  /*
    you should use this.layer instead of <layerID>
    Decimal.pow(num1, num2) is an easier way to do
    num1.pow(num2)
  */
    },
    effectDescription(){
        return "multiplying point gain by " + format(tmp[this.layer].effect)
        /*
          use format(num) whenever displaying a number
        */
      },
    canBuyMax() {
        return hasChallenge("c", 12)
        },
        
    milestones: {
            0: {requirementDescription: "5 Stars",
                done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
                effectDescription: "Year 2 prestiges resets nothing.",
            },
            1: {requirementDescription: "14 Stars",
                unlocked() {return hasMilestone(this.layer, 0)},
                done() {return player[this.layer].best.gte(14)},
                effectDescription: "Get a boost on the layer boost formula",
                effect() {
                    let mpower_b1 = player[this.layer].points.add(1).pow(6)
                    return mpower_b1
                },
                },
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "2", description: "2: Reset for Stars", onPress(p){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            unlocked() {return player[this.layer].best.gte(1)},
            title: "Stargazing",
            description: "Gain more knowledge based on your Stars.",
            cost: new Decimal(7),
            effect() {
                let power_b11 = player[this.layer].points.add(1).pow(player.c.points).pow(0.53)
                if (hasUpgrade('a', 33)) power_b11 = power_b11.times(new Decimal(upgradeEffect('a', 33))) 
                
                return power_b11
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        12: {
            unlocked() { return (hasUpgrade(this.layer, 11))},
            title: "Star Projector",
            description: "Gain even more points based on your Stars.",
            cost: new Decimal(10),
            effect() {
                let power_b12 = player.points.add(1).log(player.c.points.pow(0.1)).add(10)
                if (hasUpgrade('a', 33)) power_b12 = power_b12.times(new Decimal(upgradeEffect('a', 33))) 
                
                return power_b12
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
        13: {
            unlocked() { return (hasUpgrade(this.layer, 12))},
            title: "Primary 4",
            description: "Further boost point gain based on your effect of 'Stargazing'.",
            cost: new Decimal(14),
            effect() {
                let power_b13 = new Decimal(3).times(upgradeEffect('c', 11).pow(4.8)).add(10)
                if (hasUpgrade('a', 33)) power_b13 = power_b13.times(new Decimal(upgradeEffect('a', 33))) 
                return power_b13
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
        },
    },
    challenges: {
        11: {
            name: "Degenerate Era",
            challengeDescription: "The effect of stars have been square rooted.",
            canComplete: function() {return player.points.gte(1e22)},
            goalDescription: '1e22 points',
            rewardDescription: 'Get a boost on Star boost formula.'
        },
        12: {
            name: "Alpha Decay",
            challengeDescription: "All effects from the previous challenges + Point gain is squared",
            canComplete: function() {return player.points.gte(2e21)},
            goalDescription: '2e21 points',
            rewardDescription: 'The upgrade "Village Searching" uses a better formula and you can now buy max Stars.'
        },
        21: {
            name: "Soul loneliness",
            unlocked() {return (hasMilestone('d', 1))},
            challengeDescription: "All effects from the previous challenges + Ideas boost effect disabled",
            canComplete: function() {return player.points.gte(1e197)},
            goalDescription: '1e197 points',
            rewardDescription: 'Achievement power is much stronger based on your points.'
        },
    },
    layerShown(){return true},
})