// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(512, 512, Phaser.AUTO, 'gameDiv');

// Lane Constants
var LANE_1 = 0;
var LANE_2 = 1;
var LANE_3 = 2;

// Lane Horizontal Positions
var LANE_1_X = 153;
var LANE_2_X = 231;
var LANE_3_X = 309;

var carLaneChangeSpeed = 200;
var cntSpeed = 200;

// Creates a new 'main' state that will contain the game
var mainState = {

    // Function called first to load all the assets
    preload: function() {
        // Change the background color of the game
        game.stage.backgroundColor = '#71c5cf';

        // Load the bird sprite
        game.load.image('car', 'assets/car.png');

        // Load the pipe sprite
        game.load.image('road', 'assets/road.png');
    },

    // Fuction called after 'preload' to setup the game 
    create: function() {
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird on the screen
        this.car = this.game.add.sprite(LANE_2_X, 350, 'car');
        this.car.cntLane = LANE_2;

        // Add gravity to the bird to make it fall
        game.physics.arcade.enable(this.car);
        //this.bird.body.gravity.y = 700;

        // Call the 'jump' function when the spacekey is hit
        //var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        //spaceKey.onDown.add(this.jump, this); 

        this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.jumpUp, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.jumpDown, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.jumpLeft, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.jumpRight, this);

        // Create a group of 20 pipes
        //this.pipes = game.add.group();
        //this.pipes.enableBody = true;
        //this.pipes.createMultiple(3, 'road');

        this.background1 = this.game.add.sprite(0, 0, 'road');
        this.background2 = this.game.add.sprite(0, -512, 'road');
        
        game.physics.arcade.enable(this.background1);
        game.physics.arcade.enable(this.background2);
        
        this.setSpeed(200);
        
        this.car.bringToTop();
        
        //this.ground = new Ground(this.game, 0, 400, 335, 112);

        //this.addRowOfPipes();
        //this.addRoadSeg();


        // Timer that calls 'addRowOfPipes' ever 1.5 seconds
        //this.timer = this.game.time.events.loop(5000, this.addRoadSeg, this);

        //this.game.time.events.loop(2000, this.printPipes, this);    

        // Add a score label on the top left of the screen
        //this.score = 0;
        //this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  
    },
    // This function is called 60 times per second
    update: function() {
        // If the bird is out of the world (too high or too low), call the 'restartGame' function
        //if (this.car.inWorld == false) this.restartGame(); 
        
        if(this.background2.y > 512) {
            this.background2.y = -512;
            this.background1.y = 0;
            this.car.bringToTop();
        } else if(this.background1.y > 512) {
            this.background1.y = -512;
            this.background2.y = 0;
            this.car.bringToTop();
        }
        
        if(this.car.body.velocity.x != 0) {
            if(this.car.cntLane == LANE_3) {
                if(this.car.body.velocity.x > 0) {
                    if(this.car.x >= LANE_3_X) {
                        this.car.body.velocity.x = 0;
                        this.car.x = LANE_3_X;
                    }
                } else {
                    this.car.body.velocity.x = 0;
                    this.car.x = LANE_3_X;
                }
            } else if(this.car.cntLane == LANE_2) {
                if(this.car.body.velocity.x > 0) {
                    if(this.car.x >= LANE_2_X) {
                        this.car.body.velocity.x = 0;
                        this.car.x = LANE_2_X;
                    }
                } else {
                    if(this.car.x <= LANE_2_X) {
                        this.car.body.velocity.x = 0;
                        this.car.x = LANE_2_X;
                    }
                }
            } else {
                if(this.car.body.velocity.x < 0) {
                    if(this.car.x <= LANE_1_X) {
                        this.car.body.velocity.x = 0;
                        this.car.x = LANE_1_X;
                    }
                } else {
                    this.car.body.velocity.x = 0;
                    this.car.x = LANE_1_X;
                }
            }
        }
        
        // If the bird overlap any pipes, call 'restartGame'
        //game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);      
    },
    
    setSpeed: function(speed) {
        if(speed >= 0) {
            console.log("setSpeed: from: "+this.cntSpeed+" to: "+speed);
            this.cntSpeed = speed;
            this.background1.body.velocity.y = this.cntSpeed;
            this.background2.body.velocity.y = this.cntSpeed;
        }
    },
    
    jumpUp: function() {
        this.setSpeed(this.cntSpeed + 20);
    },
    
    jumpDown: function() {
        this.setSpeed(this.cntSpeed - 20);
    },
    jumpLeft: function() {
        if(this.car.cntLane == LANE_3) {
            this.car.cntLane = LANE_2;
            //this.car.x = LANE_2_X;
            this.car.body.velocity.x = -carLaneChangeSpeed;
        } else if(this.car.cntLane == LANE_2) {
            this.car.cntLane = LANE_1;
            //this.car.x = LANE_1_X;
            this.car.body.velocity.x = -carLaneChangeSpeed;
        } else {
            
        }
    },
    jumpRight: function() {
        if(this.car.cntLane == LANE_1) {
            this.car.cntLane = LANE_2;
            //this.car.x = LANE_2_X;
            this.car.body.velocity.x = carLaneChangeSpeed;
        } else if(this.car.cntLane == LANE_2) {
            this.car.cntLane = LANE_3;
            //this.car.x = LANE_3_X;
            this.car.body.velocity.x = carLaneChangeSpeed;
        } else {
            
        }
    },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },

    // Add a pipe on the screen
    addOnePipe: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.y = +200;

        // Kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    // Add a row of 6 pipes with a hole somewhere in the middle

    addRoadSeg: function() {
        console.log(this.pipes);
        for (var i = 0; i < 2; i++) {
            var lx = 0;
            var ly = -(i * 512);
            this.addOnePipe(lx, ly);
            console.log("Add bg: (" + lx + ", " + ly + ")");
        }
        //this.score += 1;
        //this.labelScore.text = this.score;  
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');