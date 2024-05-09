addLayer("h", {
    name: "Honour", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    branches: [],
    color: "#E09612",
    resource: "Honour", // Name of prestige currency
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    baseResource: "Arts",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.a.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e50),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
    exponent(){
        let exp = new Decimal(0.8)
        return exp
    }, 
    row: 2, // Row the layer is in on the tree (0 is the first row)
    position: 1,
    clickables: {
    },
    gainMult(){
        let multi = new Decimal(1)
        return multi
    },
    gainExp(){
        let exp = new Decimal(0.15)
        return exp
    },
    effect(){
        let effect = player[this.layer].points.add(1).pow(3)
        effect = effect = softcap(effect, new Decimal(1), new Decimal(1).div(effect.log(10).div(10).add(1).pow(0.09)))
        return effect
    },
    effectDescription(){
        return "boosting Artwork Progress and Generator Power gain by x" + format(tmp[this.layer].effect)        
    },
    update(delta) {
    },
    buyables: {


    },
    upgrades:{
    },
    milestones: {
        0: {requirementDescription: "1 Honour",
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: "Automatically gain 2% of your remaining available Generator Power space per second.",
        },
    },
    bars: {
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "upgrades",
            ],
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "milestones",
            ],
        },
    },
    doReset(prestige) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[prestige].row <= this.row) return;
    
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 21, Milestones
        let keptUpgrades = [];
    
        // Stage 3, track which main features you want to keep - milestones
        let keep = [];
    
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
    
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades);
    },

    layerShown(){return hasUpgrade('a', 24) || player[this.layer].unlocked}
})
