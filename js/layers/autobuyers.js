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
                    return (player.a.auto && hasMilestone("b", 0)) ? tmp.a.color : "#666666"
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
                    return (player.a.buyableAuto && hasMilestone("b", 2)) ? tmp.a.color : "#666666"
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
                    return (player.a.dimAuto && hasMilestone("h", 1)) ? tmp.a.color : "#666666"
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
                    return (player.b.auto && hasMilestone("h", 3)) ? tmp.b.color : "#666666"
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
                    return (player.g.auto && hasMilestone("h", 3)) ? tmp.g.color : "#666666"
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
                    return (player.g.buyableAuto && hasMilestone("h", 3)) ? tmp.g.color : "#666666"
                }
            },
        },
        31: {
            title: "Super Boosters",
            display() {
                return hasMilestone("i", 11) ? (player.sb.auto ? "On" : "Off") : "Locked"
            },
            unlocked() {
                return player.i.unlocked
            },
            canClick() {
                return hasMilestone("i", 11)
            },
            onClick() {
                player.sb.auto = !player.sb.auto
            },
            style: {
                "background-color"() {
                    return (player.sb.auto && hasMilestone("i", 11)) ? tmp.sb.color : "#666666"
                }
            },
        },
        32: {
            title: "Breakthroughs",
            display() {
                return hasMilestone("i", 11) ? (player.br.auto ? "On" : "Off") : "Locked"
            },
            unlocked() {
                return player.i.unlocked
            },
            canClick() {
                return hasMilestone("i", 11)
            },
            onClick() {
                player.br.auto = !player.br.auto
            },
            style: {
                "background-color"() {
                    return (player.br.auto && hasMilestone("i", 11)) ? tmp.br.color : "#666666"
                }
            },
        },
        33: {
            title: "Breakthrough Buyables",
            display() {
                return hasMilestone("i", 7) ? (player.br.buyableAuto ? "On" : "Off") : "Locked"
            },
            unlocked() {
                return player.h.unlocked
            },
            canClick() {
                return hasMilestone("i", 7)
            },
            onClick() {
                player.br.buyableAuto = !player.br.buyableAuto
            },
            style: {
                "background-color"() {
                    return (player.br.buyableAuto && hasMilestone("i", 7)) ? tmp.br.color : "#666666"
                }
            },
        },
    },
})