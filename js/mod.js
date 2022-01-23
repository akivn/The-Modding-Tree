let modInfo = {
	name: "The History Tree",
	id: "akivn",
	author: "akivn",
	pointsName: "points",
	modFiles: ["layers/year1.js", "layers/year2.js","layers/year3.js", "layers/year4.js", "layers/Flowers.js", "func.js", "layers/Fauna.js", "layers/SuperGenerator.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.4",
	name: "Rewritten-Beta-5 - Year 4 Update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.3</h3> - Flora update<br>
		1. Added 5 new upgrades in Y1.<br>
		2. Added 2 new upgrades in Y2.<br>
		3. Added 1 challenge in Y2.<br>
		4. Added Flowers!<br>
		5. Year 3 IS HERE!<br>
	<h3>v0.31-cEP1</h3> - Flora update<br>
		1. Fixed the 1 star softlock by increasing the base of Star effect to 3.<br>
		2. Added 1 new upgrade to Year 3.
	<h3>v0.4</h3> - Year 4 update<br>
		1. 7 new Upgrades to Year 1.<br>
		2. 9 new Upgrades to Year 3.<br>
		3. 7 new Challenges to Year 2.<br>
		4. Super-Generators and Faunas! Their reincaranations and faunas can help you boost Mind-Generators!<br>
		5. but most importantly... YEAR 4 IS HERE!!!`
		

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
	if(getBuyableAmount('a', 22).gte(1)) gain = gain.times(buyableEffect('a', 22))
	if(getBuyableAmount('a', 31).gte(1)) gain = gain.times(buyableEffect('a', 31))
	gain = gain.times(tmp.b.effect)
	if (player.c.points.gte(1)) gain = gain.times(tmp.c.effect.pow(2).times(10))
	if(inChallenge('b', 22)) gain = gain.pow(0.5)
	if(inChallenge('b', 31)) gain = gain.pow(0.5)
	if(inChallenge('b', 32)) gain = gain.pow(0.5)
	if(inChallenge('b', 42)) gain = gain.pow(0.5)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"<br>",
	function() { return `<h3>Current Endgame: </h3> ${GetEffectText("h3", 1, tmp.d.color)} Robotic Part` },
]

// Determines when the game "ends"
function isEndgame() {
	return player.d.points.gte(1)
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