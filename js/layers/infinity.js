addLayer("i", {
    name: "Infinity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "∞", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 3, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        fastestCrunch: new Decimal(31415926),
        timeInCurrentInfinity: new Decimal(0),
        infinities: new Decimal(0),
        studyPoints: new Decimal(0),
    }},
    nodeStyle() {
        return options.imageNode ? {
            'color': 'white',
            'background-image': 'url("resources/Infinity.webp")',
            'background-position': 'center center',
            'background-size': '100%',
            'border': '1px solid white'
        } : {
            'background-image': 'radial-gradient(circle at center, orange, #e3bb29)'
        }
    },
    color: "orange",
    requires: new Decimal(2).pow(1024), // Can be a function that takes requirement increases into account
    resource: "Infinity Points", // Name of prestige currency
    branches: ['h'],
    baseResource: "Arts", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.001, // Prestige currency exponent
    hotkeys: [ {key: "i", description: "I: Reset for Infinity points", onPress(){if (canReset(this.layer)) doReset(this.layer)}}, ],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    maxStudyPoints() {
        return getBuyableAmount('i', 11).plus(getBuyableAmount('i', 12)).plus(getBuyableAmount('i', 13))
    },
    update(delta) {
        player.i.timeInCurrentInfinity = player.i.timeInCurrentInfinity.add(Decimal.times(new Decimal(1), delta))
    },
    upgrades: {
        11: {
            title: "Restart",
            description: "You get a boost on Art gain based on your Infinity Upgrade count.",
            cost: new Decimal(1),
            currencyDisplayName: "Study",
            currencyInternalName: "studyPoints",
            currencyLayer: "i",
            effect() {
                let length = new Decimal(0)
                for(i=1;i<5;i++){ //rows
                    for(v=1;v<4;v++){ //columns
                        if (hasUpgrade(this.layer, i+v*10)) length = length.add(1)
                      }
                }
                let power = length.add(1).pow(2.5)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return true},
            branches: [21, 22]
        },
        21: {
            title: "Doubling Clover",
            description: "'Effect Increaser' is now 1.2x more effective.",
            cost: new Decimal(1),
            currencyDisplayName: "Study",
            currencyInternalName: "studyPoints",
            currencyLayer: "i",
            canAfford() {return hasUpgrade('i', 11) && player.i.studyPoints.gte(tmp.i.upgrades[this.id].cost) && !hasUpgrade('i', 22)},
            unlocked(){ return true},
        },
        22: {
            title: "Stronger Dimensions",
            description: "Art Dimension Multiplier is now 2.2x.",
            canAfford() {return hasUpgrade('i', 11) && player.i.studyPoints.gte(tmp.i.upgrades[this.id].cost) && !hasUpgrade('i', 21)},
            cost: new Decimal(1),
            currencyDisplayName: "Study",
            currencyInternalName: "studyPoints",
            currencyLayer: "i",
            unlocked(){ return true},
        },
        31: {
            title: "Infinity Stackup",
            description: "Boost Art progress based on your Infinities",
            canAfford() {return (hasUpgrade('i', 21) || hasUpgrade('i', 22)) && player.i.studyPoints.gte(tmp.i.upgrades[this.id].cost)},
            cost: new Decimal(3),
            currencyDisplayName: "Studies",
            currencyInternalName: "studyPoints",
            currencyLayer: "i",
            effect() {
                let power = player.i.infinities.times(3).add(1)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return true},
            branches: [21, 22]
        },
    },
    buyables: {
        11: {
            cost() { return new Decimal(5.6438030941e102).pow(getBuyableAmount(this.layer, this.id).add(0.5)) },
            canAfford() { return player.a.points.gte(this.cost()) },
            display() { return `Get a Study from your Art amount.<br>Next at ${formatWhole(tmp.i.buyables[11].cost)} Arts` },
            buy() { player.i.studyPoints = player.i.studyPoints.plus(1); player.a.points = player.a.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '60px' } }
        },
        12: {
            cost() { return new Decimal(2).pow(getBuyableAmount(this.layer, this.id)) },
            canAfford() { return player.i.points.gte(this.cost()) },
            display() { return `Get a Study from your Infinity Points.<br>Next at ${formatWhole(tmp.i.buyables[12].cost)} Infinity Points` },
            buy() { player.i.studyPoints = player.i.studyPoints.plus(1); player.i.points = player.i.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '60px' } }
        },
        13: {
            cost() { return 0 },
            canAfford() { return false },
            display() { return `Get a Study from your Incrementy amount.<br>Locked` },
            buy() {  },
            style() { return { height: '60px' } }
        },
    },
    challenges: {


    },
    clickables: {
        'crunch': {
            display() { return 'Perform a Big Crunch' },
            canClick() { return true },
            onClick() {
                if(getClickableState('i', 'respecOnNextInfinity') === 'ON') {
                    player.i.studyPoints = tmp.i.maxStudyPoints;
                    player.i.upgrades = [];
                }
                doReset('i')
                player.i.fastestCrunch = Decimal.min(player.i.fastestCrunch, player.i.timeInCurrentInfinity);
                player.i.timeInCurrentInfinity = new Decimal(0);

                player.i.unlocked = true;
                player.i.infinities = player.i.infinities.plus(1);

                player.a.points = new Decimal(0);
                options.forceOneTab = false;
                if (player.i.infinities == new Decimal(1)) showTab('a');
            },
            style() {
                return {
                    width: '250px',
                    height: '100px',
                    border: '8px solid orange !important',
                    'font-size': '24px'
                }
            }
        },
        'respecOnNextInfinity': {
            onClick() { setClickableState(this.layer, this.id, getClickableState(this.layer, this.id) === 'OFF' ? 'ON' : 'OFF') }, 
            canClick() { return true; },
            display() { return `Respec Studies on next Infinity: ${getClickableState(this.layer, this.id)}` },
            style() {
                return {
                    minWidth: '125px',
                    minHeight: '50px',
                }
            }
        }
    },
    tabFormat: {
        "Upgrades": {
        content: [
            function() {    
                if(player.a.points.gte(new Decimal(2).pow(1024)) && player.i.infinities.gte(1)) {
                    return ['clickable', 'crunch']
                }
            },
            "main-display",
            "blank",
            ['raw-html', function() {
                if (player.i.studyPoints.gte(new Decimal(1)) && player.i.studyPoints.lte(new Decimal(1))) return `<div>You have <h2 v-bind>${formatWhole(player.i.studyPoints)}</h2> Study <br><br></div>`
                return `<div>You have <h2 v-bind>${formatWhole(player.i.studyPoints)}</h2> Studies <br><br></div>`}
            ],
            ["row", [["buyable", 11], ["buyable", 12], ["buyable", 13]]],
            "blank",
            ["clickable", 'respecOnNextInfinity'],
            "blank",
            ["upgrade-tree",
                [[11], [21,22], [31]]
            ]
        ],
    },},
    layerShown(){return player.i.infinities.gte(0.1)}
})
