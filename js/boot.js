let bootState = {
  // code to allow the loading bar asset to exist for the loading state
  preload: function() {
    game.load.image('progressBar', 'https://media.giphy.com/media/bbr1n5lZGTpYc/giphy.gif');
  },

  create: function() {
    game.stage.backgroundColor = 'black'

    game.physics.startSystem(Phaser.Physics.ARCADE)

    game.renderer.renderSession.roundPixels = true;

    //start the load state
    // game.state.start('load')
  },
  start: function() {
    // Start the actual game
    game.state.start('load');
  },
}



game.state.add('boot', bootState);
