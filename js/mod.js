let modInfo = {
	name: "The History Tree",
	id: "akivn",
	author: "akivn",
	pointsName: "points",
	modFiles: ["layers/a.js", "layers/b.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
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

	let gain = new Decimal(0)
	if(hasUpgrade('a', 11)) gain = new Decimal(1)
	if(hasUpgrade('a', 12)) gain = gain.times(upgradeEffect('a', 12))
	if(hasUpgrade('a', 14)) gain = gain.times(upgradeEffect('a', 14))
	if(hasUpgrade('a', 25)) gain = gain.times(upgradeEffect('a', 25))
	if(getBuyableAmount('a',11) >= (1)) gain = gain.times(buyableEffect('a', 11))
	if(getBuyableAmount('a',12) >= (1)) gain = gain.times(buyableEffect('a', 12))
	if(getBuyableAmount('a',21) >= (1)) gain = gain.times(buyableEffect('a', 21))
	if(getBuyableAmount('a',22) >= (1)) gain = gain.times(buyableEffect('a', 22))
	if(getBuyableAmount('a',31) >= (1)) gain = gain.times(buyableEffect('a', 31))
	gain = gain.times(new Decimal(tmp.b.effect))
    softcap(gain, new Decimal(1e63), new Decimal(1).div(player.points.div(1e63).add(10).log(1e19).pow(0.3)))
	softcap(gain, new Decimal(1e96), new Decimal(1).div(player.points.add(10).pow(3)))
	if(inChallenge('a', 12)) gain = gain.pow(0.5)
	if(inChallenge('a', 13)) gain = gain.pow(0.5)
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
	return player.points.gte(new Decimal("1.79e308"))
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