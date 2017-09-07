console.log("booyah")
// phaser requires three things to exist in order to make a game (preload, create, and update). This is essentially the game.
// initialize phaser - give the game a size
let game = new Phaser.Game(400, 490);
let music;
let highScore = 0
let currentScore = 0


// this is the menu state for the game. the game starts and ends with this state
let menuState = {
  preload: function() {
    //code to pull in the assets (sounds, images)
    game.load.image('background', 'assets/bg.png');
  },

  create: function() {
    game.stage.backgroundColor = "71c5cf"
    game.add.image(0, 0, 'background')

    //display the name of the game
    let nameLabel = game.add.text(game.width / 2, 100, 'slappy fish', {
      font: '50px Helvetica',
      fill: '#ffffff',
    });

    //display the high score from the localStorage object
    let scoreLabel = game.add.text(game.width / 3 , game.height /3.5, "high score: " + localStorage.getItem('highScore'), {
      font: '25px Helvetica',
      fill: 'yellow',
    });

    //position of the name of the game
    nameLabel.anchor.setTo(0.5, 0.5);

    //display the instructions for play
    let startLabel = game.add.text(game.width / 2, game.height - 30,
      'Press spacebar to fly', {
        font: '30px Helvetica',
        fill: '#ffffff',
      });
    //position of the instructions
    startLabel.anchor.setTo(0.5, 0.5)

    let upKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    upKey.onDown.add(this.start, this);
  },

  start: function() {
    // Start the actual game
    game.state.start('main');
  },
};

game.state.add('menu', menuState);


let mainState = {
  preload: function() {
    //code to pull in the assets (sounds, images)
    game.load.image('bird', 'assets/cheep.png');
    game.load.image('pipe', 'assets/ppipe.png')
    game.load.audio('jump', 'assets/sfx_wing.wav')
    game.load.audio('hit', 'assets/sfx_hit.wav')
    // game.load.image('background', 'assets/bg.png');
    game.load.image('background2', 'assets/bg2.png');
    game.load.audio('joy', 'assets/joy.mp3')

  },
  create: function() {
    //code to set up the game and display sprites
    game.stage.backgroundColor = "71c5cf"

    //add the background to the game
    game.add.image(0, 0, 'background2')

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
      font: "50px Helvetica",
      fill: "#ffffff"
    });

    //for the tilt, move the anchor down and to the left
    this.bird.anchor.setTo(-0.2, 0.5)

    //pull in jump sound effect
    this.jumpSound = game.add.audio('jump');

    //pull in sound effect for hitting pipe
    this.hitSound = game.add.audio('hit')

    //pull in music
    music = game.add.audio('joy');

    //play music
    music.play()

  },
  update: function() {
    //this function is called 60 times per second. contains game logic.

    //if the bird is too high or low - call the restartGame function
    if (this.bird.y < 0 || this.bird.y > 490)
      this.restartGame();

    game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

    //make the bird tilt after flying
    if (this.bird.angle < 20)
      this.bird.angle += 1;
  },
  // function to make the bird jump
  jump: function() {
    //stop the bird from jumping if dead
    if (this.bird.alive == false)
      return;

    // add vertical velocity to the bird object
    this.bird.body.velocity.y = -350;

    //part of the bird tilt animation in ^ the update function
    let animation = game.add.tween(this.bird);

    //change the angle of the bird by 20 degrees at 100 milliseconds
    animation.to({
      angle: -20
    }, 100);

    //start the animation
    animation.start();

    //play the sound for jumping
    this.jumpSound.play('', 0, 0.5);

  },

  // allow the game to be restarted
  restartGame: function() {
    // Start the 'main' state, which restarts the game
    game.state.start('menu');
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
    // add one point when the user passes through the gap
    this.score += 1;

    // set the high score score
    currentScore = this.score

    this.labelScore.text = this.score;
    // console.log(currentScore)
  },
  hitPipe: function() {
    //lets the game know when a pipe is hit and what to do afterward

    //if the bird has already hit a pipe, don't do anything
    if (this.bird.alive == false)
      return;

    // set the alive to false
    this.bird.alive = false;

    // stop the music when the fish hits the pipe
    music.pause()

    //play the hit sound effect
    this.hitSound.play();

    //stop new pipes from generating
    game.time.events.remove(this.timer);

    //stop existing pipes from moving
    this.pipes.forEach(function(p) {
      p.body.velocity.x = 0;
    }, this)

    // if the current score exceeds the high score, save current score as high score
    if (currentScore >= highScore) {
      highScore = currentScore
      localStorage.setItem("highScore", highScore)
    }
    // console.log(highScore)
  }
};

// add the mainState (aka the game) to the game object
game.state.add('main', mainState);

// start the menu
game.state.start('menu')
