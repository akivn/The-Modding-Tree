addLayer("a", {
    name: "Art", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        progress: false,
        art: new Decimal(0),
        totalArt: new Decimal(0),
        auto() {
            if (!player.a.auto || !hasMilestone('b', 0)) return false
            else return true
        },
        buyableAuto() {
            if (!player.a.buyableAuto || !hasMilestone('b', 2)) return false
            else return true
        },
        dimAuto() {
            if (!player.a.dimAuto) return false
            else return true
        },
        bulk: false,
        artworkPerSecond: new Decimal(0),
        artspace: new Decimal(0),
        bought1: new Decimal(0),
        bought2: new Decimal(0),
        bought3: new Decimal(0),
        bought4: new Decimal(0),
        bought5: new Decimal(0),
        bought6: new Decimal(0),
        bought7: new Decimal(0),
        bought8: new Decimal(0),
        dimshift: new Decimal(0),
        dimboost: new Decimal(0),
    }},
    nodeStyle() {
        return options.imageNode ? {
            'color': 'white',
            'background-image': 'url("resources/water-color-background-png_71008.jpg")',
            'background-position': 'center center',
            'background-size': '160%',
            'border': '1px solid white'
        } : {
            'background-image': 'radial-gradient(circle at center, #20A0D4, #10506A)'
        }
    },
    branches: ['b', 'g', 'h'],
    color: "#20A0D4",
    resource: "Arts", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    clickables: {
        'art': {
            title() {return "Make an art"},
            onClick() {
                player.a.progress = true
            },
            canClick() {return !player.a.progress},
            style: {
                minWidth: "120px",
                minHeight: "120px",
            },
        }
    },
    multi(){
        let multi = new Decimal(1)
        multi = multi.times(tmp.a.bars.Art.req).div(10)
        if (hasUpgrade('a', 13)) multi = multi.times(upgradeEffect('a', 13))
        if (hasUpgrade('b', 13)) multi = multi.times(upgradeEffect('b', 13))
        if (hasUpgrade('a', 31)) multi = multi.times(upgradeEffect('a', 31))
        multi = multi.times(tmp.b.effect)
        multi = multi.times(tmp.a.artspace.effect)
        return multi
    },
    exp(){
        let exp = new Decimal(1)
        if (hasUpgrade('b', 21)) exp = exp.times(1.2)
        if (hasUpgrade('a', 22)) exp = exp.times(1.05)
        return exp
    },
    multi2() {
        let multi = new Decimal(1)
        if (player.br.buff.gte(2)) multi = multi.times(tmp.br.effect2)
        if (hasUpgrade('i', 11)) multi = multi.times(upgradeEffect('i', 11))
        if (hasAchievement('ac', 61)) multi = multi.times(2)
        multi = multi.times(tmp.ac.effect2)
        return multi
    },
    art: {
        perSecond() {
            let perSecond = new Decimal(1)
            perSecond = perSecond.times(tmp.a.buyables["expboost"].effect)
            if (hasUpgrade('a', 11)) perSecond = perSecond.times(upgradeEffect('a', 11))
            if (hasUpgrade('b', 11)) perSecond = perSecond.times(upgradeEffect('b', 11))
            if (hasMilestone('b', 1)) perSecond = perSecond.times(4)
            perSecond = perSecond.times(tmp.g.power.effect)
            perSecond = perSecond.times(tmp.h.effect)
            if (player.a.resetTime<=0.07) perSecond = new Decimal(0)
            return perSecond
        }
    },
    artworkPerSecond: {
        perSecond() {
            let perSecond = tmp.a.art.perSecond.div(tmp.a.bars.Art.req)
            if (perSecond.gte(10) && hasMilestone('b', 1)) player.a.bulk = true
            else player.a.bulk = false
            return perSecond
        }
    },
    artspace: {
        perSecond() {
            let perSecond = buyableEffect('a', 101)
            if (player.a.resetTime<=0.07) perSecond = new Decimal(0)
            return perSecond
        },
        effect() {
            let effect = player.a.artspace.pow(0.4).add(1)
            let base = new Decimal(0.625)
            if (hasUpgrade('br', 11)) base = upgradeEffect('br', 11)
            else if (hasUpgrade('h', 14)) base = upgradeEffect('h', 14)
            effect = effect = softcap(effect, new Decimal(1e6), new Decimal(1).div(effect.log(10).div(4).add(1).pow(base)))  
            return effect
        },
    },
    update(delta) {
        if (hasMilestone('b', 0) && player.a.auto) player.a.progress = true
        if (player.a.progress && !player.a.bulk) player.a.art = player.a.art.add(Decimal.times(tmp.a.art.perSecond, delta));
        if (tmp.a.bars.Art.progress>=1 && !player.a.bulk) {
            player.a.points = player.a.points.add(tmp.a.multi.pow(tmp.a.exp).times(tmp.a.multi2)).floor()
            player.a.totalArt = player.a.totalArt.add(1)
            player.a.art = new Decimal(0)
            if (!hasMilestone('b', 0) || !player.a.auto) player.a.progress = false
        };
        if (player.a.bulk) {
            player.a.points = player.a.points.add((tmp.a.multi.pow(tmp.a.exp).times(tmp.a.multi2)).floor().times(Decimal.times(tmp.a.artworkPerSecond.perSecond, delta)))
            player.a.totalArt = player.a.totalArt.add(Decimal.times(tmp.a.artworkPerSecond.perSecond, delta))
        };
        player.a.artspace = player.a.artspace.add(Decimal.times(tmp.a.artspace.perSecond, delta));
        player.a.buyables[101] = player.a.buyables[101].add(Decimal.times(tmp.a.buyables[102].effect, delta));
        player.a.buyables[102] = player.a.buyables[102].add(Decimal.times(tmp.a.buyables[103].effect, delta));
        player.a.buyables[103] = player.a.buyables[103].add(Decimal.times(tmp.a.buyables[104].effect, delta));
        player.a.buyables[104] = player.a.buyables[104].add(Decimal.times(tmp.a.buyables[105].effect, delta));
        player.a.buyables[105] = player.a.buyables[105].add(Decimal.times(tmp.a.buyables[106].effect, delta));
        player.a.buyables[106] = player.a.buyables[106].add(Decimal.times(tmp.a.buyables[107].effect, delta));
        player.a.buyables[107] = player.a.buyables[107].add(Decimal.times(tmp.a.buyables[108].effect, delta));
        if (!hasMilestone('b', 0)) player.a.auto = false
        if (!hasMilestone('b', 2)) player.a.buyableAuto = false
        if (!hasMilestone('h', 1)) player.a.dimAuto = false
        if (!hasMilestone("h", 3)) player.b.auto = false
        if (!hasMilestone("h", 3)) player.g.auto = false
        if (!hasMilestone("h", 3)) player.g.buyableAuto = false

    },
    buyables: {
        "expboost": {
            title: "Experience Boost",
            cost(x) { 
                let base = new Decimal(5)
                let cost = new Decimal(base).pow(x)
                return cost 
            },
            effect(x){
                let power = new Decimal(x.pow(0.7)).times(player.points.add(10).log(10).pow(1.5))
                let base = new Decimal(1.6)
                if (hasUpgrade('h', 11)) base = base.add(upgradeEffect('h', 11))
                if (hasAchievement('ac', 43)) base = base.add(0.001)
                if (hasUpgrade('b', 12)) power = new Decimal(base).pow(x).times(player.points.add(10).log(10))
                if (hasUpgrade('b', 12)) power = softcap(power, new Decimal(1), new Decimal(1).div(power.log(10).div(10).add(1).pow(0.15)))  
                if (x.lte(0) && x.gte(0)) power = new Decimal(1)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + format(data.cost) + " Arts"
                if (data.cost.lte(1) && data.cost.gte(1)) d1 = "Cost: " + format(data.cost) + " Art"
                return d1 + "\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies your Artwork progress gain by " + format(buyableEffect(this.layer, this.id))+"x based on your Experience"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
            }, 
        },
        "enlarge": {
            title: "Art Amplifier",
            cost(x) { 
                let base = new Decimal(10)
                let cost = new Decimal(base).pow(x.add(1))
                return cost 
            },
            effect(x){
                let base = new Decimal(2)
                if (hasUpgrade('h', 22)) base = new Decimal(2.25)
                let power = new Decimal(base).pow(x)
                if (x.lte(0) && x.gte(0)) power = new Decimal(1)
                return power
            },
            effect2(){
                let power = tmp.a.buyables[this.id].effect
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + format(data.cost) + " Arts"
                if (data.cost.lte(1) && data.cost.gte(1)) d1 = "Cost: " + format(data.cost) + " Art"
                return d1 + "\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Requires " + format(tmp.a.buyables["enlarge"].effect)+"x more progress, but gain more Art"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return getBuyableAmount('a', "expboost").gte(1) || getBuyableAmount('a', "enlarge").gte(1)
            },
            style() {
            }, 
        },
        101: {
            title: "Art Dimension 1",
            cost() { 
                let base = new Decimal(1e3)
                let cost = new Decimal(base).pow(player.a.bought1).times(1e24)
                cost = softcap(cost, new Decimal(2).pow(1024), new Decimal(1).add(cost.add(2).log(2).minus(512).div(512).minus(1)).pow(0.1))
                return cost 
            },
            effect2(){
                let base = new Decimal(2)
                if (hasUpgrade('i', 22)) base = new Decimal(2.2)
                let power = new Decimal(base).pow(player.a.bought1)
                if (hasUpgrade ('b', 23)) power = power.times(upgradeEffect('b', 23))
                if (hasUpgrade ('a', 24)) power = power.times(upgradeEffect('a', 24))
                if (hasUpgrade ('h', 23)) power = power.times(upgradeEffect('h', 23))
                if (hasAchievement('ac', 35)) power = power.times(1.2)
                if (hasAchievement('ac', 53)) power = power.times(1.01)
                return power
            },
            effect(x){
                let power = tmp[this.layer].buyables[this.id].effect2.times(x)
                return power
            },
            effect(x){
                let power = tmp[this.layer].buyables[this.id].effect2.times(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + format(data.cost) + " Arts"
                return `${d1}\n\
                Amount: ${format(getBuyableAmount(this.layer, this.id), 2)} (${commaFormat(player.a.bought1, 0)})\n\
                ${format(tmp[this.layer].buyables[this.id].effect2, 2)}x`
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.a.bought1 = player.a.bought1.add(1)
            },
            style() {
                return {height: '66px', width: '200px'}
            }, 
        },
        102: {
            title: "Art Dimension 2",
            cost() { 
                let base = new Decimal(1e5)
                let cost = new Decimal(base).pow(player.a.bought2).times(1e28)
                cost = softcap(cost, new Decimal(2).pow(1024), new Decimal(1).add(cost.add(2).log(2).minus(512).div(512).minus(1)).pow(0.1))
                return cost 
            },
            effect2(){
                let base = new Decimal(2)
                if (hasUpgrade('i', 22)) base = new Decimal(2.2)
                let power = new Decimal(base).pow(player.a.bought2)
                if (hasUpgrade ('b', 23)) power = power.times(upgradeEffect('b', 23))
                if (hasUpgrade ('h', 23)) power = power.times(upgradeEffect('h', 23))
                if (hasAchievement('ac', 53)) power = power.times(1.01)
                return power
            },
            effect(x){
                let power = tmp[this.layer].buyables[this.id].effect2.times(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + format(data.cost) + " Arts"
                return `${d1}\n\
                Amount: ${format(getBuyableAmount(this.layer, this.id), 2)} (${commaFormat(player.a.bought2, 0)})\n\
                ${format(tmp[this.layer].buyables[this.id].effect2, 2)}x`
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.a.bought2 = player.a.bought2.add(1)
            },
            style() {
                return {height: '66px', width: '200px'}
            }, 
        },
        103: {
            title: "Art Dimension 3",
            cost() { 
                let base = new Decimal(1e7)
                let cost = new Decimal(base).pow(player.a.bought3).times(1e32)
                cost = softcap(cost, new Decimal(2).pow(1024), new Decimal(1).add(cost.add(2).log(2).minus(512).div(512).minus(1)).pow(0.1))
                return cost 
            },
            effect2(){
                let base = new Decimal(2)
                if (hasUpgrade('i', 22)) base = new Decimal(2.2)
                let power = new Decimal(base).pow(player.a.bought3)
                if (hasUpgrade ('b', 23)) power = power.times(upgradeEffect('b', 23))
                if (hasUpgrade ('h', 23)) power = power.times(upgradeEffect('h', 23))
                if (hasAchievement('ac', 53)) power = power.times(1.01)
                return power
            },
            effect(x){
                let power = tmp[this.layer].buyables[this.id].effect2.times(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + format(data.cost) + " Arts"
                return `${d1}\n\
                Amount: ${format(getBuyableAmount(this.layer, this.id), 2)} (${commaFormat(player.a.bought3, 0)})\n\
                ${format(tmp[this.layer].buyables[this.id].effect2, 2)}x`
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.a.bought3 = player.a.bought3.add(1)
            },
            style() {
                return {height: '66px', width: '200px'}
            }, 
        },
        104: {
            title: "Art Dimension 4",
            cost() { 
                let base = new Decimal(1e9)
                let cost = new Decimal(base).pow(player.a.bought4).times(1e36)
                cost = softcap(cost, new Decimal(2).pow(1024), new Decimal(1).add(cost.add(2).log(2).minus(512).div(512).minus(1)).pow(0.1))
                return cost 
            },
            effect2(){
                let base = new Decimal(2)
                if (hasUpgrade('i', 22)) base = new Decimal(2.2)
                let power = new Decimal(base).pow(player.a.bought4)
                if (hasUpgrade ('b', 23)) power = power.times(upgradeEffect('b', 23))
                if (hasUpgrade ('h', 12)) power = power.times(upgradeEffect('h', 12))
                if (hasUpgrade ('h', 23)) power = power.times(upgradeEffect('h', 23))
                if (hasAchievement('ac', 53)) power = power.times(1.01)
                return power
            },
            effect(x){
                let power = tmp[this.layer].buyables[this.id].effect2.times(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + format(data.cost) + " Arts"
                return `${d1}\n\
                Amount: ${format(getBuyableAmount(this.layer, this.id), 2)} (${commaFormat(player.a.bought4, 0)})\n\
                ${format(tmp[this.layer].buyables[this.id].effect2, 2)}x`
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.a.bought4 = player.a.bought4.add(1)
            },
            style() {
                return {height: '66px', width: '200px'}
            }, 
        },
        105: {
            title: "Art Dimension 5",
            cost() { 
                let base = new Decimal(1e11)
                let cost = new Decimal(base).pow(player.a.bought5).times(1e72)
                cost = softcap(cost, new Decimal(2).pow(1024), new Decimal(1).add(cost.add(2).log(2).minus(512).div(512).minus(1)).pow(0.1))
                return cost 
            },
            effect2(){
                let base = new Decimal(2)
                if (hasUpgrade('i', 22)) base = new Decimal(2.2)
                let power = new Decimal(base).pow(player.a.bought5)
                if (hasUpgrade ('b', 23)) power = power.times(upgradeEffect('b', 23))
                if (hasUpgrade ('h', 23)) power = power.times(upgradeEffect('h', 23))
                if (hasAchievement('ac', 53)) power = power.times(1.01)
                return power
            },
            effect(x){
                let power = tmp[this.layer].buyables[this.id].effect2.times(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + format(data.cost) + " Arts"
                return `${d1}\n\
                Amount: ${format(getBuyableAmount(this.layer, this.id), 2)} (${commaFormat(player.a.bought5, 0)})\n\
                ${format(tmp[this.layer].buyables[this.id].effect2, 2)}x`
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.a.bought5 = player.a.bought5.add(1)
            },
            style() {
                return {height: '66px', width: '200px'}
            },
            unlocked() {return hasMilestone('h', 4)} 
        },
        106: {
            title: "Art Dimension 6",
            cost() { 
                let base = new Decimal(1e13)
                let cost = new Decimal(base).pow(player.a.bought6).times(1e104)
                cost = softcap(cost, new Decimal(2).pow(1024), new Decimal(1).add(cost.add(2).log(2).minus(512).div(512).minus(1)).pow(0.1))
                return cost 
            },
            effect2(){
                let base = new Decimal(2)
                if (hasUpgrade('i', 22)) base = new Decimal(2.2)
                let power = new Decimal(base).pow(player.a.bought6)
                if (hasUpgrade ('b', 23)) power = power.times(upgradeEffect('b', 23))
                if (hasUpgrade ('h', 23)) power = power.times(upgradeEffect('h', 23))
                if (hasAchievement('ac', 54)) power = power.times(achievementEffect('ac', 54))
                if (hasAchievement('ac', 53)) power = power.times(1.01)
                return power
            },
            effect(x){
                let power = tmp[this.layer].buyables[this.id].effect2.times(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + format(data.cost) + " Arts"
                return `${d1}\n\
                Amount: ${format(getBuyableAmount(this.layer, this.id), 2)} (${commaFormat(player.a.bought6, 0)})\n\
                ${format(tmp[this.layer].buyables[this.id].effect2, 2)}x`
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.a.bought6 = player.a.bought6.add(1)
            },
            style() {
                return {height: '66px', width: '200px'}
            },
            unlocked() {return hasMilestone('h', 6)} 
        },
        107: {
            title: "Art Dimension 7",
            cost() { 
                let base = new Decimal(1e15)
                let cost = new Decimal(base).pow(player.a.bought7).times(1e128)
                cost = softcap(cost, new Decimal(2).pow(1024), new Decimal(1).add(cost.add(2).log(2).minus(512).div(512).minus(1)).pow(0.1))
                return cost 
            },
            effect2(){
                let base = new Decimal(2)
                if (hasUpgrade('i', 22)) base = new Decimal(2.2)
                let power = new Decimal(base).pow(player.a.bought7)
                if (hasUpgrade ('b', 23)) power = power.times(upgradeEffect('b', 23))
                if (hasUpgrade ('h', 23)) power = power.times(upgradeEffect('h', 23))
                if (hasAchievement('ac', 53)) power = power.times(1.01)
                return power
            },
            effect(x){
                let power = tmp[this.layer].buyables[this.id].effect2.times(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + format(data.cost) + " Arts"
                return `${d1}\n\
                Amount: ${format(getBuyableAmount(this.layer, this.id), 2)} (${commaFormat(player.a.bought7, 0)})\n\
                ${format(tmp[this.layer].buyables[this.id].effect2, 2)}x`
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.a.bought7 = player.a.bought7.add(1)
            },
            style() {
                return {height: '66px', width: '200px'}
            },
            unlocked() {return hasMilestone('h', 7)} 
        },
        108: {
            title: "Art Dimension 8",
            cost() { 
                let base = new Decimal(1e17)
                let cost = new Decimal(base).pow(player.a.bought8).times(1e160)
                cost = softcap(cost, new Decimal(2).pow(1024), new Decimal(1).add(cost.add(2).log(2).minus(512).div(512).minus(1)).pow(0.1))
                return cost 
            },
            effect2(){
                let base = new Decimal(2)
                if (hasUpgrade('i', 22)) base = new Decimal(2.2)
                let power = new Decimal(base).pow(player.a.bought8)
                if (hasUpgrade ('b', 23)) power = power.times(upgradeEffect('b', 23))
                if (hasUpgrade ('h', 23)) power = power.times(upgradeEffect('h', 23))
                if (hasAchievement('ac', 53)) power = power.times(1.01)
                return power
            },
            effect(x){
                let power = tmp[this.layer].buyables[this.id].effect2.times(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                let d1 = "Cost: " + format(data.cost) + " Arts"
                return `${d1}\n\
                Amount: ${format(getBuyableAmount(this.layer, this.id), 2)} (${commaFormat(player.a.bought8, 0)})\n\
                ${format(tmp[this.layer].buyables[this.id].effect2, 2)}x`
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.a.bought8 = player.a.bought8.add(1)
            },
            style() {
                return {height: '66px', width: '200px'}
            },
            unlocked() {return hasMilestone('h', 8)} 
        },
    },
    
    upgrades:{
        11: {
            title: "Motivation",
            description: "Boost Artwork progress based on total artworks done.",
            cost: new Decimal(15),
            effect() {
                let power = new Decimal(player.a.totalArt.add(10).log(10).pow(2))
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return getBuyableAmount('a', "enlarge").gte(1) || player.b.unlocked },
        },
        12: {
            title: "Ambition",
            description: "Increase artwork size based on your Experience.",
            cost: new Decimal(40),
            effect() {
                let power = new Decimal(player.points.add(10).log(10))
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return hasUpgrade('a', 11) || player.b.unlocked },
        },
        13: {
            title: "Fruition",
            description: "Art gain per Artwork is boosted based on the Art Size.",
            cost: new Decimal(250),
            effect() {
                let power = new Decimal(tmp.a.bars.Art.req.add(10).log(10).pow(1.3))
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return hasUpgrade('a', 12) || player.b.unlocked },
        },
        14: {
            title: "Booster",
            description: "Unlock Boosters.",
            cost: new Decimal(500),
            unlocked(){ return hasUpgrade('a', 13) || player.b.unlocked },
        },
        21: {
            title: "Re: Motivation",
            description: "Art boosts Experience gain.",
            cost: new Decimal(1e33),
            effect() {
                let base = new Decimal(0.0375)
                let power = player.a.points.add(1).pow(base)
                power = softcap(power, new Decimal(1), new Decimal(1).div(power.log(10).div(5).add(1).pow(0.075)))  
                if (hasUpgrade('br', 12)) power = power.pow(1.3)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){ return hasUpgrade('b', 24) },
        },
        22: {
            title: "Better Powerup!",
            description: "Generator's Effect Increaser is more powerful.",
            cost: new Decimal(1e37),
            unlocked(){ return hasUpgrade('b', 24) },
        },
        23: {
            title: "Generator Tomozaki",
            description: "Generator's base to Generator Power gain is increased based on your Art.",
            cost: new Decimal(1e43),
            effect() {
                let power = player.a.points.add(10).log(10).div(30)
                return power
            },
            effectDisplay() { return `+${format(upgradeEffect(this.layer, this.id), 4)}` },
            unlocked(){ return hasUpgrade('b', 24) },
        },
        24: {
            title: "Receive Honour",
            description: "Unlock a new layer, and Artspace production is boosted by your Boosters.",
            cost: new Decimal(1e47),
            effect() {
                let power = new Decimal(1.222).pow(player.b.points)
                if (player.br.buff.gte(1)) power = power.pow(tmp.br.effect1)
                power = softcap(power, new Decimal(1), new Decimal(1).div(power.log(10).div(10).add(1).pow(0.167)))  
                return power
            },
            effectDisplay() { return `${format(upgradeEffect(this.layer, this.id))}x` },
            unlocked(){ return hasUpgrade('b', 24) },
        },
        31: {
            title: "Upgrade Mastery",
            description: "Each bought Art Upgrade give a 1.3x boost to both Art and Experience. (Affected by exponents!)",
            cost: new Decimal(1e203),
            effect() {
                let length = new Decimal(0)
                for(i=1;i<5;i++){ //rows
                    for(v=1;v<4;v++){ //columns
                        if (hasUpgrade(this.layer, i+v*10)) length = length.add(1)
                      }
                }
                let power = new Decimal(1.3).pow(length) 
                return power
            },
            effectDisplay() { return `${format(upgradeEffect(this.layer, this.id))}x` },
            unlocked(){ return hasUpgrade('sb', 12) },
        },
        32: {
            title: "Everyday Level Up!!",
            description: "Super Boosters affect Breakthrough XP gain. (nb: This is a reference to ご注文はうさぎですか？？)",
            cost: new Decimal(1e228),
            effect() {
                let power = new Decimal(1.5).pow(player.sb.points)
                return power
            },
            effectDisplay() { return `${format(upgradeEffect(this.layer, this.id))}x` },
            unlocked(){ return hasUpgrade('sb', 12) },
        },
        33: {
            title: "Generation II",
            description: "Divide Generator requirement based on your Breakthrough Level.",
            cost: new Decimal(1e253),
            effect() {
                let power = new Decimal(10).pow(player.br.level)
                return power
            },
            effectDisplay() { return `/${format(upgradeEffect(this.layer, this.id))}` },
            unlocked(){ return hasUpgrade('sb', 12) },
        },
        34: {
            title: "Colourful Canvas!",
            description: "All buffs in Breakthrough are raised to ^1.1.",
            cost: new Decimal(1e278),
            unlocked(){ return hasUpgrade('sb', 12) },
        },
    },
    bars: {
        Art: {
            direction: RIGHT,
            width: 450,
            height: 30,
            req(){
                let req = new Decimal(10)
                req = req.times(tmp.a.buyables["enlarge"].effect)
                if (hasUpgrade('a', 12)) req = req.times(upgradeEffect('a', 12))
                if (hasUpgrade('g', 11)) req = req.times(upgradeEffect('g', 11))
                return req
            },
            progress() {
                if (player.a.bulk) return 1
                else return (player.a.art.div(tmp.a.bars.Art.req))
            },
            unlocked() { return true },
            display() {
                if (player.a.bulk) return `Drawing ${format(tmp.a.artworkPerSecond.perSecond)} Artworks per second`
                return `Artwork progress: ${format(player.a.art)} / ${format(tmp.a.bars.Art.req)} (${format(100-tmp[this.layer].bars.Art.progress, 2)}%)`
            },
            fillStyle() {
                let r = 32
                let g = 160
                let b = 212
                return {
                    "background-color": ("rgb(" + r + ", " + g + ", " + b + ")")
                }
            },
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                ['display-text', function() {
                    return `All Art gains are rounded down.` }, { 'font-size': '15px', 'color': 'silver'}
                ],
                "blank",
                ["bar", "Art"],
                "blank",
                ['display-text', function() {
                    if (!player.a.progress && !player.a.auto) return
                    else return `Artwork progress: ${format(tmp.a.art.perSecond)} / sec` }, { 'font-size': '15px', 'color': 'silver'}
                ],
                "blank",
                ['display-text', function() {
                    return `Total Artworks completed: ${format(player.a.totalArt)}` }, { 'font-size': '15px', 'color': 'silver'}],
                ['display-text', function() {
                    return `You gain ${format(tmp.a.multi.pow(tmp.a.exp).times(tmp.a.multi2).floor())} Art per completed Artwork` }, { 'font-size': '15px', 'color': 'silver'}],
                ['display-text', function() {
                    if (player.a.bulk) return `You are gaining ${format(tmp.a.artworkPerSecond.perSecond.times(tmp.a.multi.pow(tmp.a.exp).times(tmp.a.multi2).floor()))} Arts per second`
                    else return }, { 'font-size': '15px', 'color': 'silver'}],
                "blank",
                function() {if (!player.a.auto) return ["clickable", "art"]},
                "blank",
                ["row", [["buyable", "expboost"], "blank", ["buyable", "enlarge"]]],
                "blank",
                "upgrades",
            ],
        },
        "Dimensions": {
            content: [
                "main-display",
                ['raw-html', function() {
                    return `<div><span v-if="player.a.artspace.lt('1e1000')">You have </span><h2 v-bind>${format(player.a.artspace)}</h2> Artspaces<br><br></div>`}
                ],
                ['display-text', function() {
                    return `Your Artspace is boosting Art gain by ${format(tmp.a.artspace.effect)}x`}, { 'font-size': '15px', 'color': 'silver'}],
                ['display-text', function() {
                    return `Artspace gain: ${format(tmp.a.artspace.perSecond)} / sec` }, { 'font-size': '15px', 'color': 'silver'}
                ],
                "blank",
                ["buyable", 101],
                ["buyable", 102],
                ["buyable", 103],
                ["buyable", 104],
                ["buyable", 105],
                ["buyable", 106],
                ["buyable", 107],
                ["buyable", 108],
            ],
            unlocked() {return hasUpgrade('g', 13)}
        },
    },
    doReset(prestige) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[prestige].row <= this.row) return;
    
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 21, Milestones
        let keptUpgrades = [];
            for(i=4;i<5;i++){ //rows
                for(v=1;v<2;v++){ //columns
                    if (hasUpgrade(this.layer, i+v*10)) keptUpgrades.push(i+v*10)
                  }
            }
    
        // Stage 3, track which main features you want to keep - milestones
        let keep = [];
        if (((hasMilestone('b', 2) && layers[prestige].position == 1) || (hasMilestone('g', 0) && layers[prestige].position == 2)) && layers[prestige].row <= 1) keep.push("upgrades")
        if (hasMilestone('h', 0)) keep.push("upgrades")
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
    
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades);
        if (!hasMilestone('b', 0)) player.a.auto = false
        if (!hasMilestone('b', 2)) player.a.buyableAuto = false
        if (!hasMilestone('h', 1)) player.a.dimAuto = false
    },
    automate() {
        if (hasMilestone('h', 1) && player.a.dimAuto) {
            for (i=1;i<101;i++) {
                buyBuyable('a', 101)
                buyBuyable('a', 102)
                buyBuyable('a', 103)
                buyBuyable('a', 104)
                if (tmp.a.buyables[105].unlocked) buyBuyable('a', 105)
                if (tmp.a.buyables[106].unlocked) buyBuyable('a', 106)
                if (tmp.a.buyables[107].unlocked) buyBuyable('a', 107)
                if (tmp.a.buyables[108].unlocked) buyBuyable('a', 108)
            }
        }
        if (player.a.buyableAuto && hasMilestone("b", 2)) {
            for(i=1;i<101;i++){
                buyBuyable("a", "expboost")
                buyBuyable("a", "enlarge")
            }
        };
    },

    layerShown(){return true}
})
