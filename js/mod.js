let modInfo = {
	name: "The Light Incremental",
	id: "akak2",
	author: "akivn",
	pointsName: "points",
	modFiles: ["layers/prestige.js", "layers/light.js", "layers/lightpower.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 24,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.10",
	name: "The Origin",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.10</h3><br>
		- Added Prestige system!<br>
		- Added Light, which requires Prestige points to process!<br>
		- Added Light Power, which starts generating Photons once you reach 5 Lights!`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

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

	let gain = new Decimal(1)
	if (hasUpgrade('p', 12)) gain = gain.times(upgradeEffect('p', 12))
	gain = gain.times(tmp.p.effect)
	gain = gain.times(buyableEffect('p', 11))
	gain = gain.times(tmp.l.effect.pow(1.5))
	gain = gain.times(tmp.lp.power.effect)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return hasUpgrade('p', 34)
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