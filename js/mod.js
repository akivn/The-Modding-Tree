let modInfo = {
	name: "The OR History Tree Incremental",
	id: "on9_1a12",
	author: "akivn",
	pointsName: "points",
	modFiles: ["layers/Year2015.js", "func.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "2016 update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the present and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	multi = new Decimal(1.01)
	if (hasUpgrade('a', 11)) multi = multi.add(upgradeEffect('a', 11))
	if (hasUpgrade('a', 12)) multi = multi.add(upgradeEffect('a', 12))
	if (hasUpgrade('a', 13)) multi = multi.add(upgradeEffect('a', 13))
	if (hasUpgrade('a', 14)) multi = multi.add(upgradeEffect('a', 14))
	if (hasUpgrade('a', 32)) multi = multi.times(upgradeEffect('a', 32))
	if (hasUpgrade('a', 33)) multi = multi.times(upgradeEffect('a', 33))
	if (hasUpgrade('a', 41)) multi = multi.times(upgradeEffect('a', 41))
	if (hasUpgrade('a', 42)) multi = multi.times(upgradeEffect('a', 42))
	if (hasUpgrade('a', 43)) multi = multi.pow(upgradeEffect('a', 43))
	if (hasUpgrade('a', 44)) multi = multi.pow(upgradeEffect('a', 44))
	if (hasUpgrade('a', 51)) multi = multi.pow(upgradeEffect('a', 51))
	if (hasUpgrade('a', 52)) multi = multi.pow(upgradeEffect('a', 52))
	if (hasUpgrade('a', 53)) multi = multi.pow(upgradeEffect('a', 53))
	if (hasUpgrade('a', 54)) multi = multi.pow(upgradeEffect('a', 54))

	
	
	let gain = new Decimal(multi.minus(1)).times(player.points)
	if (!hasUpgrade('a', 22)) gain = softcap(gain, new Decimal(10), new Decimal(1).div(gain.log(1e10).add(1)))
	if (!hasUpgrade('a', 31)) gain = softcap(gain, new Decimal(1e22), new Decimal(1).div(gain.log(1e75).add(1)))
	if (hasUpgrade('a', 31) && !hasUpgrade('a', 32) && !hasUpgrade('a', 42)) gain = softcap(gain, new Decimal(1e22), new Decimal(1).div(gain.log('1e375').add(1)))
	if (hasUpgrade('a', 31) && hasUpgrade('a', 32) && !hasUpgrade('a', 42)) gain = softcap(gain, new Decimal(1e22), new Decimal(1).div(gain.log('1e750').add(1)))
	if (hasUpgrade('a', 42) && !hasUpgrade('a', 51)) gain = softcap(gain, new Decimal('1e500'), new Decimal(1).div(gain.log('1e10000').add(1).pow(0.01)))
	if (hasUpgrade('a', 51)) gain = softcap(gain, new Decimal('1e500'), new Decimal(1).div(gain.log('1e10000').add(1).pow(0.0004)))
	if (!hasUpgrade('a', 54)) gain = softcap(gain, new Decimal('ee10'), new Decimal(1).div(gain.log(10).log(10)))
	if (hasUpgrade('a', 21)) gain = gain.add(upgradeEffect('a', 21))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"<br>",
	function() { return `<h0>Multiplier:</h0> ${GetEffectText("h0", format(multi), tmp.a.color)}x` },	
]

// Determines when the game "ends"
function isEndgame() {
	return multi.gte(new Decimal("eeeee10"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}