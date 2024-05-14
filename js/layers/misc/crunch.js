addLayer('crunch', {
    startData() { return {
        crunched: false
    }},
    tabFormat: [
        ['display-text', '<h1>Miki died and exploded into supernova because of excess Art content.</h1>'],
        ['display-image', 'https://i.ibb.co/9VCmhqJ/the-art-tree-rewritten-explode.png',{ 'height': '360px', 'width': '640px'}],
        ['clickable', 'crunch']
    ],

    update() {
        if(
           player.a.bestArt.gte(new Decimal(2).pow(1024).add(1)) && (player.i.infinities.lt(1) || inChallenge('i', 11) || inChallenge('i', 22))
        ) {
            options.forceOneTab = true;
            player.a.points = new Decimal(2).pow(1024).add(1e308)
            tmp.a.art.perSecond = new Decimal(0)
            player.crunch.crunched = true
            showTab('crunch');
        }
        if(
            player.a.bestArt.gte(1e154) && (inChallenge('i', 12))
         ) {
            options.forceOneTab = true;
            player.a.points = new Decimal(2).pow(1024).add(1e308)
            tmp.a.art.perSecond = new Decimal(0)
            player.crunch.crunched = true
            showTab('crunch');
         }
        if(
            player.a.bestArt.gte(1e186) && (inChallenge('i', 21))
        ) {
            options.forceOneTab = true;
            player.a.points = new Decimal(2).pow(1024).add(1e308)
            tmp.a.art.perSecond = new Decimal(0)
            player.crunch.crunched = true
            showTab('crunch');
        }
        if (player.a.bestArt.gte(new Decimal(2).pow(1024).add(1)) && !hasUpgrade('i', 91)) {
            player.a.points = new Decimal(2).pow(1024).add(1)
            tmp.a.art.perSecond = new Decimal(0)
            player.crunch.crunched = true
        }
    },
    clickables: {
        'crunch': {
            display() { return 'Big Crunch' },
            canClick() { return true },
            onClick() {
                player.i.fastestCrunch = Decimal.min(player.i.fastestCrunch, player.i.timeInCurrentInfinity);  
                if (inChallenge('i', 11)) {
                    completeChallenge('i', 11)
                    player.i.challenge1Best = Decimal.min(player.i.challenge1Best, player.i.challenge1Time);
                }
                if (inChallenge('i', 12)) {
                    completeChallenge('i', 12)
                    player.i.challenge2Best = Decimal.min(player.i.challenge2Best, player.i.challenge2Time);
                }
                if (inChallenge('i', 21)) {
                    completeChallenge('i', 21)
                    player.i.challenge3Best = Decimal.min(player.i.challenge3Best, player.i.challenge3Time);
                }
                if (inChallenge('i', 22)) {
                    completeChallenge('i', 22)
                    player.i.challenge4Best = Decimal.min(player.i.challenge4Best, player.i.challenge4Time);
                }             
                doReset('i')
                player.i.timeInCurrentInfinity = new Decimal(0);
                player.i.challenge1Time = new Decimal(0);
                player.i.challenge2Time = new Decimal(0);
                player.i.challenge3Time = new Decimal(0);
                player.i.challenge4Time = new Decimal(0);

                player.i.unlocked = true;
                player.i.infinities = player.i.infinities.plus(1);
                player.i.clickables.respecOnNextInfinity = 'OFF'

                player.a.points = new Decimal(0);
                player.a.bestArt = new Decimal(0);

                player.crunch.crunched = false;
                options.forceOneTab = false;
                showTab('a');
            },
            style() {
                return {
                    width: '500px',
                    height: '200px',
                    border: '8px solid orange !important',
                    'font-size': '72px'
                }
            }
        }
    }
}
)