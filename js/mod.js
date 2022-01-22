let modInfo = {
	name: "The History Tree",
	id: "akivn",
	author: "akivn",
	pointsName: "points",
	modFiles: ["layers/year1.js", "layers/year2.js","layers/year3.js", "layers/Flowers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.30",
	name: "Rewritten-Beta-3",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.3</h3> - Flora update<br>
		1. Added 5 new upgrades in Y1.<br>
		2. Added 2 new upgrades in Y2.<br>
		3. Added 1 challenge in Y2.<br>
		4. Added Flowers!<br>
		5. Year 3 IS HERE!<br>`

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
	if(hasUpgrade('a', 22)) gain = gain.times(upgradeEffect('a', 22))
	if(getBuyableAmount('a', 11).gte(1)) gain = gain.times(buyableEffect('a', 11))
	if(getBuyableAmount('a', 12).gte(1)) gain = gain.times(buyableEffect('a', 12))
	if(getBuyableAmount('a', 21).gte(1)) gain = gain.times(buyableEffect('a', 21))
	gain = gain.times(tmp.b.effect)
	if (player.c.points.gte(1)) gain = gain.times(tmp.c.effect.pow(2).times(10))
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
	return player.points.gte(new Decimal("1e185"))
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