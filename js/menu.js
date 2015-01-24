Game.Menu = function (game) { };

Game.Menu.prototype = {

	create: function() {
		game.stage.backgroundColor = '#fff';
		this.cursor = this.game.input.keyboard.createCursorKeys();

		var label = game.add.text(w/2, h/2-100, 'Crazy Snake', { font: '60px Arial', fill: '#2c2c2c', align: 'center' });
		label.anchor.setTo(0.5, 0.5);
		label.scale.setTo(0, 0);
		game.add.tween(label.scale).to({ x:1, y:1 }, 1000, Phaser.Easing.Bounce.Out).start();

		var label = game.add.text(w/2, h-150, 'press the UP arrow key to start', { font: '25px Arial', fill: '#2c2c2c' });
		label.anchor.setTo(0.5, 0.5);
		label.alpha = 0;
		game.add.tween(label).delay(500).to({ alpha: 1}, 500).start();
		game.add.tween(label).to({y: h-150}, 500).to({y: h-125}, 500).loop().start();

		this.sound_toggle = this.game.add.button(w-50, 50, 'sound', this.toggle_sound, this);
		this.sound_toggle.anchor.setTo(1, 0);
		this.sound_toggle.alpha = 0;
		game.add.tween(this.sound_toggle).delay(500).to({ alpha: 1}, 500).start();
	},

	update: function() {
		if (this.cursor.up.isDown)
			this.game.state.start('Play');		
	},

	toggle_sound: function() {
		if (this.sound_toggle.frame == 0) {
			this.sound_toggle.frame = 1;
			sound = false;
		}
		else {
			this.sound_toggle.frame = 0;
			sound = true;			
		}
	}
};