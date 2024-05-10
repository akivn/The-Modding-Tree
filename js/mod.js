let modInfo = {
	name: "The Art Tree Rewritten",
	id: "mikiart2",
	author: "akivn",
	pointsName: "Experience",
	modFiles: ["layers/art.js", "layers/breakthrough.js", "layers/infinity.js", "layers/misc/crunch.js", "layers/superbooster.js", "layers/honour.js", "layers/booster.js", "layers/generator.js", "layers/autobuyers.js", "layers/achievement.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.011",
	name: "Beta Jumpscare",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.011</h3><br>
		- Added 7 layers across 4 rows!<br>
		- Added more features!<br>
		- Endgame at infinite APs!`

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
	let gain = new Decimal(0)
	if (player.a.progress) gain = new Decimal(tmp.a.art.perSecond)
	if (hasUpgrade('g', 11)) gain = gain.times(upgradeEffect('g', 11))
	if (hasUpgrade('g', 14)) gain = gain.times(upgradeEffect('g', 14))
	if (hasUpgrade('a', 21)) gain = gain.times(upgradeEffect('a', 21))
	if (hasUpgrade('a', 31)) gain = gain.times(upgradeEffect('a', 31))
	gain = gain.times(tmp.b.effect)
	gain = gain.times(tmp.ac.effect)
	if (hasAchievement('ac', 15)) gain = gain.times(achievementEffect('ac', 15))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function() {
		return `Current Art: ${format(player.a.points)}`
	},
	function() {
		if (player.a.bulk) return `You are gaining ${format(tmp.a.artworkPerSecond.perSecond.times(tmp.a.multi.pow(tmp.a.exp).times(tmp.a.multi2).floor()))} Arts per second`
	},
	function() {
		if (player.a.points.gte(1e281) && options.dandereMode) return `Jumpscare Incoming at 1.80e308 Arts!`
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.i.points.gte(1)
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