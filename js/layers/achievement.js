addLayer("ac", {
    startData() { return {                 
        unlocked: true,                     
        points: new Decimal(0),             
    }},
    name: "Achievement",
    symbol: "a",
    color: "#ffff00",                      
    resource: "Achievement Points",           
    row: "side",                                            

    type: "none",     
    effect() {
        let effect = new Decimal(1.025).pow(player[this.layer].points)
        return effect
    },
    effect2() {
        let completedRows = new Decimal(0)
        for(i=1;i<7;i++){ //rows
            for(v=1;v<6;v++){ //columns
                let completed = true
                if (!hasAchievement(this.layer, i*10+v)) completed = false
                if (completed && v==5) completedRows = completedRows.add(1)
            }
        }
        effect = new Decimal(1.1).pow(completedRows)
        return effect
    },
    effectDescription(){
        return "boosting Experience gain by x" + format(tmp[this.layer].effect)      
    },                                           

    layerShown() { return true },
    achievements: {
        11: {
            name: "Start your Journey",
            tooltip: "Create an art.",
            done() { return player.a.totalArt.gte(1) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        12: {
            name: "Expansion",
            tooltip: "Expand your art size.",
            done() { return tmp.a.bars.Art.req.gte(10.001) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        13: {
            name: "100 Art is a lot",
            tooltip: "Create 100 arts.",
            done() { return player.a.totalArt.gte(100) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        14: {
            name: "Effort Payoff",
            tooltip: "Buy the upgrade 'Fruition'.",
            done() { return hasUpgrade('a', 13) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        15: {
            name: "Art McQueen",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Get your Art progress above 95/s. Reward: Gain a small bonus based on your total Artwork done. Currently: ${format(achievementEffect('ac', 15))}x`
                else return `Get your Art progress above 95/s. Reward: Gain a small Experience bonus based on your total Artwork done.`
            },
            done() { return player.a.totalArt.gte(95) },
            effect() {
                let power = new Decimal(player.a.totalArt.add(10).log(10).pow(0.1))
                return power
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        21: {
            name: "Boosting Effect",
            tooltip: "Unlock Boosters.",
            done() { return player.b.unlocked },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        22: {
            name: "That's Massive",
            tooltip: "Make your Artwork size >1e6.",
            done() { return tmp.a.bars.Art.req.gte(1e6) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        23: {
            name: "Persistent Support",
            tooltip: "Unlock Generators",
            done() { return player.g.unlocked },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        24: {
            name: "Is this the limit?",
            tooltip: "Increase your Generator Limit.",
            done() { return tmp.g.limit.effect.gte(50.001) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        25: {
            name: "Dragon Ball Z, but Artist",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Get your Artwork/s over 9,000. Reward: Gain a small bonus on Booster base on your total Generator Power. Currently: +${format(achievementEffect('ac', 25))}`
                else return `Get your Artwork/s over 9,000. Reward: Gain a small bonus on Booster base on your Generator Power.`
            },
            done() { return tmp.a.artworkPerSecond.perSecond.gte(9000) },
            effect() {
                let power = player.g.power.add(10).log(10).div(100)
                return power
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        31: {
            name: "Antimatter Dimensions???",
            tooltip: "Unlock Art Dimensions.",
            done() { return hasUpgrade('g', 13) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        32: {
            name: "100 Artspace is really a lot",
            tooltip: "Create 100 artspace.",
            done() { return player.a.artspace.gte(100) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        33: {
            name: "Maybe a Trillion?",
            tooltip: "Have 1e12 Generator Power.",
            done() { return player.g.power.gte(1e12) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        34: {
            name: "Where's the Dimension Shift?",
            tooltip: "Have 2 Art Dimension 4.",
            done() { return getBuyableAmount('a', 104).gte(2) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        35: {
            name: "Slow Turtle",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Have your Artwork/sec below 1 while having over 1e10 Artwork Progress/sec. Reward: Artspace Production is 1.2x stronger.`
                else return `Have your Artwork/sec below 1 while having over 1e10 Artwork Progress/sec. Reward: Artspace Production is 1.2x stronger.`
            },
            done() { return tmp.a.artworkPerSecond.perSecond.lte(1) && tmp.a.art.perSecond.gte(1e10) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        41: {
            name: "Honourize!",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Unlock Honour. Reward: Gain 1% of your remaining available Generator Power every second.`
                else return `Unlock Honour. Reward: Gain 1% of your remaining available Generator Power every second.`
            },
            done() { return player.h.unlocked },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        42: {
            name: "Greet from your maid",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Unlock an Honour perk.`
                else return `Unlock an Honour perk.`
            },
            done() { return hasUpgrade('h', 11) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        43: {
            name: "Miki is getting tired",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Get 1e100 Art. Reward: A slight boost of +0.003 base mulltiplier on 'Experience Boost'.`
                else return `Get 1e100 Art. Reward: A slight boost of +0.001 base mulltiplier on 'Experience Boost'.`
            },
            done() { return player.a.points.gte(1e100) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        44: {
            name: "Faster than a Potato",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Get 1e29 artspace per second.`
                else return `Get 1e29 artspace per second.`
            },
            done() { return tmp.a.artspace.perSecond.gte(1e29) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        45: {
            name: "You don't need it anyway",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Get 1e50 Arts without Boosters/Generators. Reward: Honour boosts are powered to ^1.005.`
                else return `Get 1e50 Arts without Boosters/Generators. Reward: Honour boosts are powered to ^1.005.`
            },
            done() { return player.a.points.gte(1e50) && player.b.points.lte(0) && player.g.points.lte(0) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        51: {
            name: "Anata ni Anrokku!",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Unlock Breakthrough.`
                else return `Unlock Breakthrough.`
            },
            done() { return player.br.unlocked },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        52: {
            name: "More experienced",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Reach Breakthrough Level 10.`
                else return `Reach Breakthrough Level 10.`
            },
            done() { return player.br.level.gte(10) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        53: {
            name: "90 degrees to Explosion",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Get 2 Art Dimension 8s. Reward: Art Dimensions are 1% stronger.`
                else return `Get 2 Art Dimension 8s. Reward: Art Dimensions are 1% stronger.`
            },
            done() { return player.a.buyables[108].gte(2) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        54: {
            name: "ERROR 666: DEVIL DOES NOT EXIST",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Get 6.66e66x artwork expansion from Art Amplifier. Reward: Art Dimension 6 is stronger based on your Boosters. Currently: ${format(achievementEffect('ac', 54))}x`
                else return `Get 6.66e66x artwork expansion from Art Amplifier. Reward: Art Dimension 6 is stronger based on your Boosters.`
            },
            done() { return buyableEffect('a', 'enlarge').gte(6.66e66) },
            effect() {
                let power = player.b.points.add(1).pow(0.25)
                return power
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        55: {
            name: "All Shugo Charas are with you.",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Get 3 Amulet upgrades.`
                else return `Get 3 Amulet upgrades.`
            },
            done() { return hasUpgrade('br', 11) && hasUpgrade('br', 12) && hasUpgrade('br', 13)},
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        61: {
            name: "Jumpscared, aren't you? Let's go Infinity!",
            tooltip() {
                if (hasAchievement(this.layer, this.id)) return `Big Crunch. Reward: x2 Art gain and divide Boosters/Generators cost by 10.`
                else return `Big Crunch. Reward: x2 Art gain and divide Boosters/Generators cost by 10.`
            },
            done() { return player.i.infinities.gte(1)},
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        
        
    },
    tabFormat: {
        "Upgrades": {
        content: [
            "main-display",
            ['display-text', function() {
                return `Every completed row also boosts Art gain by 1.1x, Currently: x${format(tmp.ac.effect2)}` }, { 'font-size': '15px', 'color': 'silver'}
            ],
            "blank",
            "achievements",
            ],
        },
    },
    
})
