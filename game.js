window.onload = function() {	
	var game = new Phaser.Game(320, 480, Phaser.CANVAS);
	var player;
     // player gravity, will make player fall if you don't flap
	var playerGravity = 800;
     // horizontal player speed
	var playerSpeed = 125;
     // flap thrust
	var playerFlapPower = 250;
     // milliseconds between the creation of two pipes
	var pipeInterval = 2000;
     // hole between pipes, in puxels
	var pipeHole =200;
	var pipeGroup;
	var score=0;
	var scoreText;
    var topScore;
     
    var play = function(game){}
     
     play.prototype = {
		preload:function(){
			/* existing images 
			game.load.image("bird", "bird.png"); 
			game.load.image("pipe", "pipe.png");	
			*/
			
			// Change the background color of the game
			game.stage.backgroundColor = '#000';

			// Load the player sprite
			game.load.image('player', 'assets/player.png');  

			// Load the pipe sprite
			game.load.image('pipe', 'assets/pipe.png');   

			// Load the extraPoints image
			game.load.image('extraPoints', 'assets/extraPoints.png');   
			
			// //Load audio
			// game.load.audio('blaster', 'assets/audio/blaster.mp3');
			
		},
		create:function(){
			pipeGroup = game.add.group();
			score = 0;
			topScore = localStorage.getItem("topFlappyScore")==null?0:localStorage.getItem("topFlappyScore");
			scoreText = game.add.text(10,10,"-",{
				font:"bold 16px Arial", fill: "#ffffff" 
			});
			updateScore();
			//game.stage.backgroundColor = "#87CEEB";
			game.stage.disableVisibilityChange = true;
			game.physics.startSystem(Phaser.Physics.ARCADE);
			player = game.add.sprite(80,240,"player");
			player.anchor.set(0.5);
			game.physics.arcade.enable(player);
			player.body.gravity.y = playerGravity;
			game.input.onDown.add(flap, this);
			game.time.events.loop(pipeInterval, addPipe); 
			addPipe();
		},
		update:function(){
			game.physics.arcade.collide(player, pipeGroup, die);
			if(player.y>game.height){
				die();
			}	
		}
	}
     
     game.state.add("Play",play);
     game.state.start("Play");
     
    function updateScore(){
		scoreText.text = "Score: "+score+"\nBest: "+topScore;	
	}
     
	function flap(){
		player.body.velocity.y = -playerFlapPower;	
	}
	
	function addPipe(){
		var pipeHolePosition = game.rnd.between(50,430-pipeHole);
		var upperPipe = new Pipe(game,320,pipeHolePosition-480,-playerSpeed);
		game.add.existing(upperPipe);
		pipeGroup.add(upperPipe);
		var lowerPipe = new Pipe(game,320,pipeHolePosition+pipeHole,-playerSpeed);
		game.add.existing(lowerPipe);
		pipeGroup.add(lowerPipe);
	}
	
	function die(){
		localStorage.setItem("topFlappyScore",Math.max(score,topScore));	
		
		//try to add image
		// Add Game Over label at the centre of the screen
		game.labelGameOver = game.add.text(320/3, 480/4, "Game Over", { font: "20px Arial", fill: "#ffffff" });  

		// Add Game Over label at the centre of the screen (game.world.centerX)
		restartButton = game.add.button(320/2, 480/3, 'player', restart, this);

		//end try
		function restart() {
			game.state.start("Play");	
		}
	}
	
	Pipe = function (game, x, y, speed) {
		Phaser.Sprite.call(this, game, x, y, "pipe");
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.velocity.x = speed;
		this.giveScore = true;	
	};
	
	Pipe.prototype = Object.create(Phaser.Sprite.prototype);
	Pipe.prototype.constructor = Pipe;
	
	Pipe.prototype.update = function() {
		if(this.x+this.width<player.x && this.giveScore){
			score+=0.5;
			updateScore();
			this.giveScore = false;
		}
		if(this.x<-this.width){
			this.destroy();
		}
	};	
}