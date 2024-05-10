addLayer("h", {
    name: "Honour", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 2, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#E0B024",
    requires: new Decimal(1e50), // Can be a function that takes requirement increases into account
    resource: "Honours", // Name of prestige currency
    baseResource: "Arts", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.8, // Prestige currency exponent
    hotkeys: [ {key: "h", description: "H: Reset for Honours", onPress(){if (canReset(this.layer)) doReset(this.layer)}}, ],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(0.125)
    },
    directMult() { // Use here instead if you want to directly boost after exponent
        mult = new Decimal(1)
        return mult
    },
    effect() {
        let basepow = new Decimal(2.75)
        let effect = player[this.layer].points.add(1).pow(basepow)
        effect = softcap(effect, new Decimal(1), new Decimal(1).div(effect.add(10).log(10).div(8).add(1).pow(0.55)))
        return effect
    },
    effect2() {
        let basepow = new Decimal(1.5)
        let effect = player[this.layer].points.add(1).pow(basepow)
        effect = softcap(effect, new Decimal(1), new Decimal(1).div(effect.add(10).log(10).div(24).add(1).pow(0.125)))
        return effect
    },
    effectDescription(){
        return `boosting Art Progress by x${format(tmp[this.layer].effect)} and Generator Power gain by x${format(tmp[this.layer].effect2)}`     
    },
    autoUpgrade: true,
    upgrades: {
        11: {
            fullDisplay() {
                let d1 = `<h2>Honour Rem</h2><br>`
                if (hasUpgrade('h', 11)) return (d1 + `Boost the base multiplier of 'Experience Boost' based on your Artspace.<br>Requires 1e54 Art Points to unlock.<br>Current Boost: +${format(upgradeEffect('h', 11), 4)}`)
                else return (d1 + `Boost the base multiplier of 'Experience Boost' based on your Artspace.<br>Requires 1e54 Art Points to unlock.`)
            },
            cost: new Decimal(1e54),
            currencyInternalName: "points",
            currencyLayer: 'a',
            effect() {
                let power = player.a.artspace.add(10).log(10).minus(1).times(0.00167)
                return power
            },
            canAfford() {
                return player.a.points.gte(1e54)
            },
            pay() {
                return
            },
            unlocked(){ return player.h.unlocked },
        },
        12: {
            fullDisplay() {
                let d1 = `<h2>Honour Azusa Nakano</h2><br>`
                if (hasUpgrade('h', 12)) return (d1 + `Multiply Art Dimension 4's Efficiency based on your Generators.<br>Requires 1e70 Art Points to unlock.<br>Current Boost: ${format(upgradeEffect('h', 12))}x`)
                else return (d1 + `Multiply Art Dimension 4's Efficiency based on your Generators.<br>Requires 1e70 Art Points to unlock.`)
            },
            cost: new Decimal(1e70),
            currencyInternalName: "points",
            currencyLayer: 'a',
            effect() {
                let power = player.g.points.pow(1.2)
                return power
            },
            canAfford() {
                return player.a.points.gte(1e70)
            },
            pay() {
                return
            },
            unlocked(){ return player.h.unlocked },
        },
        13: {
            fullDisplay() {
                let d1 = `<h2>Honour Hideki Nishimura</h2><br>`
                if (hasUpgrade('h', 13)) return (d1 + `Divides Booster Requirement based on your Arts.<br>Requires 1e78 Art Points to unlock.<br>Current Boost: /${format(upgradeEffect('h', 13))}`)
                else return (d1 + `Divides Booster Requirement based on your Arts.<br>Requires 1e78 Art Points to unlock.`)
            },
            cost: new Decimal(1e78),
            currencyInternalName: "points",
            currencyLayer: 'a',
            effect() {
                let power = player.a.points.pow(0.162)
                softcap(power, new Decimal(1), new Decimal(1).div(power.add(10).log(10).div(60).add(1).pow(0.375)))
                return power
            },
            canAfford() {
                return player.a.points.gte(1e78)
            },
            pay() {
                return
            },
            unlocked(){ return player.h.unlocked },
        },
        14: {
            fullDisplay() {
                let d1 = `<h2>Honour Yoshino Himekawa</h2><br>`
                if (hasUpgrade('h', 14)) return (d1 + `Nerfs the softcap for Artspace boost to Art after 1e6 based on your Honours.<br>Requires 1e86 Art Points to unlock.<br>Current Boost: Power ${format(upgradeEffect('h', 14), 4)} from 0.625`)
                else return (d1 + `Nerfs the softcap for Artspace boost to Art after 1e6 based on your Honours.<br>Requires 1e86 Art Points to unlock.`)
            },
            cost: new Decimal(1e86),
            currencyInternalName: "points",
            currencyLayer: 'a',
            effect() {
                let power = new Decimal(0.125).add(new Decimal(0.5).pow(player.h.points.add(10).log(10).div(12).add(1)))
                if (power.lte(0.125)) power = new Decimal(0.125)
                return power
            },
            canAfford() {
                return player.a.points.gte(1e86)
            },
            pay() {
                return
            },
            unlocked(){ return player.h.unlocked },
        },
    },
    buyables: {


    },
    milestones: {
        0: {requirementDescription: "3 Honours",
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDescription: "Keep Art Upgrades on Row 3 Resets.",
        },
        1: {requirementDescription: "15 Honours",
            done() {return player[this.layer].best.gte(15)}, // Used to determine when to give the milestone
            effectDescription: "Unlock Art Dimension Autobuyer, and keep all Row 2 Milestones on Row 3 Resets.",
            onComplete(){
                player.a.dimAuto = true
            }
        },
        2: {requirementDescription: "50 Honours",
            done() {return player[this.layer].best.gte(50)}, // Used to determine when to give the milestone
            effectDescription: "Unlock Buy Max for Boosters and Generators, and Keep their upgrades on Row 3 Resets.",
        },
        3: {requirementDescription: "200 Honours",
            done() {return player[this.layer].best.gte(200)}, // Used to determine when to give the milestone
            effectDescription: "Unlock Auto Boosters, Generators and Generator Buyables.",
            onComplete(){
                player.g.buyableAuto = true
                player.g.auto = true
                player.b.auto = true
            }
        },
        4: {requirementDescription: "500 Honours",
            done() {return player[this.layer].best.gte(500)}, // Used to determine when to give the milestone
            effectDescription: "Unlock Art Dimension 5 and It's Autobuyer.",
        },
        5: {requirementDescription: "1000 Honours",
            done() {return player[this.layer].best.gte(1000)}, // Used to determine when to give the milestone
            effectDescription: "Boosters and Generators reset nothing.",
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ['display-text', function() {
                    return `<h2>Honours</h2>` }, { 'font-size': '15px', 'color': 'silver'}
                ],
                "blank",
                "upgrades"
            ],
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "milestones"
            ],
        },
    },
    layerShown() {return hasUpgrade('a', 24) || player[this.layer].unlocked}
    }
)
