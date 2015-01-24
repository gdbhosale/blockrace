Game = {};

var w = 500;
var h = 500;
var score = 0;
var best_score = 0;
var sound = 1;
var dead_s;

function rand(num){ return Math.floor(Math.random() * num) };


Game.Boot = function (game) { };

Game.Boot.prototype = {
	preload: function () {
		game.stage.backgroundColor = '#fff';
		game.load.image('loading', 'images/loading.png');
		game.load.image('loading2', 'images/loading2.png');
	},
	create: function() {
		this.game.state.start('Load');
	}
};

Game.Load = function (game) { };

Game.Load.prototype = {
	preload: function () {
	    label2 = game.add.text(Math.floor(w/2)+0.5, Math.floor(h/2)-15+0.5, 'loading...', { font: '30px Arial', fill: '#fff' });
		label2.anchor.setTo(0.5, 0.5);

		preloading2 = game.add.sprite(w/2, h/2+15, 'loading2');
		preloading2.x -= preloading2.width/2;
		preloading = game.add.sprite(w/2, h/2+19, 'loading');
		preloading.x -= preloading.width/2;
		game.load.setPreloadSprite(preloading);

		game.load.image('player', 'images/player.png');
		game.load.image('coin', 'images/coin.png');
		game.load.spritesheet('bg', 'images/bg.png', 350, 350);
		game.load.spritesheet('sound', 'images/sound.png', 28, 22);

		game.load.audio('music', 'sounds/music.wav');
		game.load.audio('coin', 'sounds/coin.wav');
		game.load.audio('death', 'sounds/death.wav');
	},
	create: function () {
		game.state.start('Menu');
	}
};
