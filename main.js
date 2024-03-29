// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

// Creates a new 'main' state that wil contain the game
var main_state = {

    preload: function() { 
			// the background game
			this.game.stage.backgroundColor = '#71c5cf';

			// load the bird sprite
			this.game.load.image('bird', 'assets/bird.png');
			this.game.load.image('pipe', 'assets/pipe.png');
			this.game.load.audio('jump', 'assets/jump.wav');
    },

    create: function() { 
    	// display the bird on the screen
    	this.bird = this.game.add.sprite(100, 245, 'bird');

    	// add gravity to the bird to make it fall
    	this.bird.body.gravity.y = 1000;
    	this.bird.anchor.setTo(-0.2, 0.5);

    	this.pipes = this.game.add.group();
    	this.pipes.createMultiple(30, 'pipe');

    	this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

    	this.score = 0;
    	var style = { font: '30px Arial', fill: '#FFFFFF' };
    	this.label_score = this.game.add.text(20, 20, '0', style);

    	this.jump_sound = this.game.add.audio('jump');

    	// call the 'jump' function when the spacebar key is hit
    	var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    	space_key.onDown.add(this.jump, this);
    },
    
    update: function() {
    	// if the bird is out of the world (too high or too low), call the restart_game function
    	if(this.bird.inWorld == false)
    		this.restart_game();

    	this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);

    	if(this.bird.angle < 20)
    		this.bird.angle++;
    },

    // make the bird jump
   	jump: function() {
   		if(this.bird.alive == false)
   			return;

   		this.jump_sound.play();

   		// add a vertical velocity to the bird
   		this.bird.body.velocity.y = -350;

   		var animation = this.game.add.tween(this.bird);

   		// set the animation to change to the angle of the sprite to -20 in 100 ms
   		animation.to({ angle: -20}, 100).start();
   	},

   	add_one_pipe: function(x, y) {
   		// get the first dead pipe of our group
   		var pipe = this.pipes.getFirstDead();
   		pipe.outOfBoundsKill = true;

   		// set the new position of the pipe
   		pipe.reset(x, y);

   		// add velocity to the pipe to make it move left
   		pipe.body.velocity.x = -200;

   		// kill the pipe when it's no longer visible
   	},

   	add_row_of_pipes: function() {

   		var hole 			= Math.floor(Math.random()*5)+1,
   				pipe_size = 60;

   		for(var i = 0; i < 10; i++)
   			if(i != hole && i != hole +1)
   				this.add_one_pipe(400, i*pipe_size);

   		this.score++;
   		this.label_score.content = this.score;
   	},

   	hit_pipe: function()
   	{
   		// set the alive property of the bird to false
   		this.bird.alive = false;

   		// prevent new pipes from appearing
   		this.game.time.events.remove(this.timer);

   		// go throgh all pipes, and stop their movement
   		this.pipes.forEachAlive(function(p) {
   			p.body.velocity.x = 0;
   		}, this);
   	},

   	// restart the game
   	restart_game: function() {
   		// start the 'main' state, which restarts the game
   		this.game.state.start('main');
   		this.game.time.events.remove(this.timer);
   	}
};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);  
game.state.start('main'); 