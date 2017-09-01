console.log("booyah")
// phaser requires three things to exist in order to make a game (preload, create, and update). This is essentially the game.
let mainState = {
  preload: function() {
    //code to pull in the assets (sounds, images)
    game.load.image('bird', 'assets/Flappy_Bird.png');
    game.load.image('pipe', 'assets/ppipe.png')
    // game.load.image("background", 'assets/bg.png');
  },
  create: function() {
    //code to set up the game and display sprites
    game.stage.backgroundColor = "71c5cf"

    //set physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //display the bird
    this.bird = game.add.sprite(100, 245, 'bird')

    //physics of the bird
    game.physics.arcade.enable(this.bird);

    //add gravity to the bird such that it falls down
    this.bird.body.gravity.y = 1000;

    //invoke jump function when spacebar is pressed
    let spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);

    //add pipes to the game -- empty "group"
    this.pipes = game.add.group();

    //call addRowOfPipes function every so often
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    //score counter
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", {
      font: "50px impact",
      fill: "#ffffff"
    });
  },
  update: function() {
    //this function is called 60 times per second. contains game logic.

    //if the bird is too high or low - call the restartGame function
    if (this.bird.y < 0 || this.bird.y > 490)
      this.restartGame();

    game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);

    //make the bird tilt after flying
    if (this.bird.angle < 20)
    this.bird.angle += 1;
  },
  // function to make the bird jump
  jump: function() {

    // add vertical velocity to the bird object
    this.bird.body.velocity.y = -350;

    //part of the bird tilt animation in ^ the update function
    let animation = game.add.tween(this.bird);

    //change the angle of the bird by 20 degrees at 100 milliseconds
    animation.to({angle: -20}, 100);

    //start the animation
    animation.start();

  },

  // allow the game to be restarted
  restartGame: function() {
    // Start the 'main' state, which restarts the game
    game.state.start('main');
  },
  addOnePipe: function(x, y) {
    //create pipe at x, y
    let pipe = game.add.sprite(x, y, 'pipe');

    //add pipe to the pipes "group"
    this.pipes.add(pipe);

    //turn on physics engine for the pipe
    game.physics.arcade.enable(pipe);

    //add velocity to the pipe such that it moves left
    pipe.body.velocity.x = -200;

    //remove the pipe when it is no longer visibile
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },
  addRowOfPipes: function() {
    //pick a random number up to 5 -- this is the gap position
    let gap = Math.floor(Math.random() * 5) + 1;

    //add 6 pipes -- pipe at position gap and gap +1
    for (var i = 0; i < 8; i++) {
      if (i != gap && i != gap + 1)
        this.addOnePipe(400, i * 60 + 10)
    }
    this.score += 1;
    this.labelScore.text = this.score;
  }
};

// initialize phaser - give the game a size
let game = new Phaser.Game(400, 490);

// add the 'mainState' to the game
game.state.add('main', mainState);

//start the state to begin the game
game.state.start('main')
