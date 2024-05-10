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
        11: {
            title: "Auto Art Gain",
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
                    return player.a.auto ? tmp.a.color : "#666666"
                }
            },
        },
        12: {
            title: "Art Buyables",
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
                    return player.a.buyableAuto ? tmp.a.color : "#666666"
                }
            },
        },
        13: {
            title: "Art Dimensions",
            display() {
                return hasMilestone("h", 1) ? (player.a.dimAuto ? "On" : "Off") : "Locked"
            },
            unlocked() {
                return player.h.unlocked
            },
            canClick() {
                return hasMilestone("h", 1)
            },
            onClick() {
                player.a.dimAuto = !player.a.dimAuto
            },
            style: {
                "background-color"() {
                    return player.a.dimAuto ? tmp.a.color : "#666666"
                }
            },
        },
        21: {
            title: "Boosters",
            display() {
                return hasMilestone("h", 3) ? (player.b.auto ? "On" : "Off") : "Locked"
            },
            unlocked() {
                return player.h.unlocked
            },
            canClick() {
                return hasMilestone("h", 3)
            },
            onClick() {
                player.b.auto = !player.b.auto
            },
            style: {
                "background-color"() {
                    return player.b.auto ? tmp.b.color : "#666666"
                }
            },
        },
        22: {
            title: "Generators",
            display() {
                return hasMilestone("h", 3) ? (player.g.auto ? "On" : "Off") : "Locked"
            },
            unlocked() {
                return player.h.unlocked
            },
            canClick() {
                return hasMilestone("h", 3)
            },
            onClick() {
                player.g.auto = !player.g.auto
            },
            style: {
                "background-color"() {
                    return player.g.auto ? tmp.g.color : "#666666"
                }
            },
        },
        23: {
            title: "Generator Buyables",
            display() {
                return hasMilestone("h", 3) ? (player.g.buyableAuto ? "On" : "Off") : "Locked"
            },
            unlocked() {
                return player.h.unlocked
            },
            canClick() {
                return hasMilestone("h", 3)
            },
            onClick() {
                player.g.buyableAuto = !player.g.buyableAuto
            },
            style: {
                "background-color"() {
                    return player.g.buyableAuto ? tmp.g.color : "#666666"
                }
            },
        },
    },
})