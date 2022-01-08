addLayer("b", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "achievement power", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    effect(){
        let achpower = Decimal.pow(1.1, player[this.layer].points)
        if (hasChallenge('c', 21)) achpower = new Decimal(1).add(Decimal.pow(2, player[this.layer].points.times(player.points.add(2).log(1e100))))
        return achpower
    },
    effectDescription(){
        return "multiplying point gain by " + format(tmp[this.layer].effect)
        /*
          use format(num) whenever displaying a number
        */
      },
    achievementPopups: true,
    achievements: {
        11: {
            name: "2015 - The knowledge is growing",
            done() {return (hasUpgrade('a', 11))},  // This one is a freebie
            goalTooltip: "Get your first upgrade.", // Shows when achievement is not completed
            onComplete() {
                player.b.points = player.b.points.add(1) 
            },
        },
        12: {
            name: "Stellosphere",
            done() {return (hasUpgrade('a', 14))},  // This one is a freebie
            goalTooltip: "Get your 4th upgrade.", // Shows when achievement is not completed
            onComplete() {
                player.b.points = player.b.points.add(1) 
            },
        },
        13: {
            name: "Scientific Notation",
            done() {return player.points.gte(1e6)},  // This one is a freebie
            goalTooltip: "Get 1,000,000 points. Reward: add 1 to the base of point gain.", // Shows when achievement is not completed
            onComplete() {
                player.b.points = player.b.points.add(1)
            },
        },
        21: {
            name: "Happy New Year!",
            done() {return player.c.points.gte(1)},  // This one is a freebie
            goalTooltip: "Get 1 star. Reward: add 1 to the base of the upgrade 'Synergy'.", // Shows when achievement is not completed
            onComplete() {
                player.b.points = player.b.points.add(1)
            },
            doneTooltip() {
                let boost = player.points.add(2).pow(0.21)
                var string = "Currently"
                return string.concat(": ", format(boost), "x")
            }
        },
        22: {
            name: "Going to the nature",
            done() {return hasUpgrade('c', 11)},  // This one is a freebie
            goalTooltip: "Get upgrade 'Stargazing'.", // Shows when achievement is not completed
            onComplete() {
                player.b.points = player.b.points.add(1)
            },
        },
        23: {
            name: "Challenge!",
            done() {return Object.values(player.c.challenges).reduce((a,b) => a+b) >= 1},  // This one is a freebie
            goalTooltip: "Get upgrade 'Stargazing'.", // Shows when achievement is not completed
            onComplete() {
                player.b.points = player.b.points.add(1)
            },
        },
        24: {
            name: "Twinkle Twinkle Little Star",
            done() {return player.c.points.gte(10)},  // This one is a freebie
            goalTooltip: "Get 10 stars.", // Shows when achievement is not completed
            onComplete() {
                player.b.points = player.b.points.add(1)
            },
        },
        31: {
            name: "I have an Idea!",
            done() {return player.d.points.gte(1)},  // This one is a freebie
            goalTooltip: "Get your first Idea.", // Shows when achievement is not completed
            onComplete() {
                player.b.points = player.b.points.add(1)
            },
        },
    },
},)