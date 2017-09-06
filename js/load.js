// the loading screen for slower connections

let loadState = {

  preload: function() {
    //add the loading label on the screen
    let loadingLabel = game.add.text(game.width / 2, 150, 'loading ...', {
      font: '30px Ariel',
      fill: '#ffffff'
    });

    loadingLabel.anchor.setTo(0.5, 0.5);

    // Display the progress bar
    var progressBar = game.add.sprite(game.width / 2, 200,
      'progressBar');
    progressBar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(progressBar);
    game.load.image('background', 'assets/bg.png'); 
  },
  create: function() {
    game.state.start('menu')
  }
}
game.state.add('load', loadState);
