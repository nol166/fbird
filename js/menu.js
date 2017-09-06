let menuState = {
    create: function() {
      game.add.image(0, 0, 'background')

      //display the name of the game
      let nameLabel = game.add.text(game.width / 2, 80, 'fbird', {
        font: '50px Arial',
        fill: '#ffffff',
      });
      nameLabel.anchor.setTo(0.5, 0.5);

      let startLabel = game.add.text(game.width / 2, game.height - 80,
        'Press spacebar to fly.', {
          font: '25px Arial',
          fill: '#ffffff',
        });

    startLabel.anchor.setTo(0.5, 0.5)

    let upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(this.start, this);
  },

  start: function() {
    // Start the actual game
    game.state.start('main');
  },
};

game.state.add('menu', menuState);
