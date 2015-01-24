Game.End = function (game) { };

Game.End.prototype = {
	create: function () {
		game.stage.backgroundColor = '#000';

		if (score > best_score)
			best_score = score;

		this.cursor = this.game.input.keyboard.createCursorKeys();
		var label = game.add.text(w/2, h/2-100, 'You Died', { font: '60px Arial', fill: '#fff', align: 'center' });
		label.anchor.setTo(0.5, 0.5);
		label.scale.setTo(0, 0);
		game.add.tween(label.scale).to({ x:1, y:1 }, 1000, Phaser.Easing.Bounce.Out).start();

		var label2 = game.add.text(w/2, h-220, 'score: '+score+'\nbest score: '+best_score, { font: '25px Arial', fill: '#fff', align: 'center' });
		label2.anchor.setTo(0.5, 0.5);
		label2.alpha = 0;
		game.add.tween(label2).delay(500).to({ alpha: 1}, 500).start();		

		var label3 = game.add.text(w/2, h-120, 'press up arrow key to restart', { font: '25px Arial', fill: '#fff', align: 'center' });
		label3.anchor.setTo(0.5, 0.5);
		label3.alpha = 0;
		game.add.tween(label3).delay(500).to({ alpha: 1}, 500).start();	
		game.add.tween(label3).to({y: h-100}, 500).to({y: h-75}, 500).loop().start();

		this.time = this.game.time.now + 500;
	},

	update: function() {
		if (this.cursor.up.isDown && this.time < this.game.time.now) {
			dead_s.stop();
			game.state.start('Play');	
		}
				
	}
};
