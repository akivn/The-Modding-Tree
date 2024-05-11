addLayer('crunch', {
    tabFormat: [
        ['display-text', '<h1>Miki died and exploded into supernova because of excess Art content.</h1>'],
        ['display-image', 'https://i.ibb.co/9VCmhqJ/the-art-tree-rewritten-explode.png',{ 'height': '360px', 'width': '640px'}],
        ['clickable', 'crunch']
    ],

    update() {
        if(
           player.a.points.gte(new Decimal(2).pow(1024).add(1)) && player.i.infinities.lt(1)
        ) {
            options.forceOneTab = true;
            player.a.points = new Decimal(2).pow(1024).add(1e308)
            tmp.a.art.perSecond = new Decimal(0)
            showTab('crunch');
        }
        if (player.a.points.gte(new Decimal(2).pow(1024).add(1))) {
            player.a.points = new Decimal(2).pow(1024).add(1)
            tmp.a.art.perSecond = new Decimal(0)
        }
    },
    clickables: {
        'crunch': {
            display() { return 'Big Crunch' },
            canClick() { return true },
            onClick() {
                doReset('i')
                player.i.fastestCrunch = Decimal.min(player.i.fastestCrunch, player.i.timeInCurrentInfinity);
                player.i.timeInCurrentInfinity = new Decimal(0);

                player.i.unlocked = true;
                player.i.infinities = player.i.infinities.plus(1);

                player.a.points = new Decimal(0);
                
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