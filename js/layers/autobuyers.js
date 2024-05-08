addLayer("ab", {
    startData() {
        return {
            unlocked: true
        }
    },
    color: "yellow",
    symbol: "AB",
    row: "side",
    layerShown() {
        return player.b.unlocked
    },
    tooltip: "Autobuyers",
    clickables: {
        rows: 8,
        cols: 4,
        11: {
            title: "Art",
            display() {
                return hasMilestone("b", 0) ? (player.a.auto ? "On" : "Off") : "Locked"
            },
            unlocked() {
                return player.b.unlocked
            },
            canClick() {
                return hasMilestone("b", 0)
            },
            onClick() {
                player.a.auto = !player.a.auto
            },
            style: {
                "background-color"() {
                    return player.a.auto ? "#6e64c4" : "#666666"
                }
            },
        },
        11: {
            title: "Art Buyable",
            display() {
                return hasMilestone("b", 2) ? (player.a.buyableAuto ? "On" : "Off") : "Locked"
            },
            unlocked() {
                return player.b.unlocked
            },
            canClick() {
                return hasMilestone("b", 2)
            },
            onClick() {
                player.a.buyableAuto = !player.a.buyableAuto
            },
            style: {
                "background-color"() {
                    return player.a.auto ? "#6e64c4" : "#666666"
                }
            },
        },
    },
})