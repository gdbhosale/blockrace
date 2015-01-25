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

var allOppCars = [];

// Creates a new 'main' state that will contain the game
var mainState = {

    // Function called first to load all the assets
    preload: function() {
        // Change the background color of the game
        game.stage.backgroundColor = '#71c5cf';

        // Load the bird sprite
        game.load.image('car', 'assets/car.png');
        game.load.image('car1', 'assets/car1.png');
        game.load.image('car2', 'assets/car2.png');
        game.load.image('car3', 'assets/car3.png');
        game.load.image('car4', 'assets/car4.png');
        game.load.image('car5', 'assets/car5.png');
        
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
        this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.jumpBreak, this);

        // Create a group of 20 pipes
        //this.pipes = game.add.group();
        //this.pipes.enableBody = true;
        //this.pipes.createMultiple(3, 'road');

        this.background1 = this.game.add.sprite(0, 0, 'road');
        this.background2 = this.game.add.sprite(0, -512, 'road');
        
        game.physics.arcade.enable(this.background1);
        game.physics.arcade.enable(this.background2);
        
        this.setSpeed(200);
        
        this.background1.body.maxVelocity.y = 1000;
        this.background2.body.maxVelocity.y = 1000;
        
        this.car.bringToTop();
        
        this.addOppsCars();
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
        
        if(this.background1.body.acceleration.y != 0) {
            if(this.background1.body.acceleration.y < 0 && this.background1.body.velocity.y <= 0) {
                this.background1.body.acceleration.y = 0;
                this.background2.body.acceleration.y = 0;
                this.setSpeed(0);
            } else if(this.background1.body.acceleration.y > 0 && this.background1.body.velocity.y >= 1000) {
                this.background1.body.acceleration.y = 0;
                this.background2.body.acceleration.y = 0;
                this.setSpeed(1000);
            }
        }
        
        
        
        // If the bird overlap any pipes, call 'restartGame'
        //game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);      
        game.physics.arcade.overlap(this.car, this.car1, this.restartGame, null, this);
        game.physics.arcade.overlap(this.car, this.car2, this.restartGame, null, this);
        game.physics.arcade.overlap(this.car, this.car3, this.restartGame, null, this);
        game.physics.arcade.overlap(this.car, this.car4, this.restartGame, null, this);
        game.physics.arcade.overlap(this.car, this.car5, this.restartGame, null, this);
        
        this.checkOppCarOverlap();
        
    },
    
    checkOppCarOverlap: function() {
        for(var i=0; i < this.allOppCars.length; i++) {
            for(var j=0; j < this.allOppCars.length; j++) {
                if(this.allOppCars[i].name != this.allOppCars[j].name) {
                    if(game.physics.arcade.overlap(this.allOppCars[i], this.allOppCars[j], null, null, this)) {
                        this.oppCarOverlap(this.allOppCars[i], this.allOppCars[j]);
                    }
                }
            }
        }
    },
    oppCarOverlap: function(car1, car2) {
        console.log("----oppCarOverlap----"+car1.y+" : "+car2.y);
        /*
        if((car2.y+car2.height) < 0) {
            this.setCarAgain(car2);
            return;
        } else if((car1.y+car1.height) < 0) {
            this.setCarAgain(car1);
            return;
        }
        */
        if(car1.y > car2.y) {
            car2.body.velocity.y = car1.body.velocity.y;
            car2.y = (car1.y - car1.height - 0);
        } else {
            car1.body.velocity.y = car2.body.velocity.y;
            car1.y = (car2.y - car2.height - 0);
        }
        console.log("----oppCarOverlap----"+car1.y+" : "+car2.y);
    },
    addOppsCars: function(speed) {
        this.car1 = this.game.add.sprite(LANE_1_X, -350, 'car1');
        this.car2 = this.game.add.sprite(LANE_3_X, -750, 'car2');
        this.car3 = this.game.add.sprite(LANE_3_X, -250, 'car3');
        this.car4 = this.game.add.sprite(LANE_2_X, -650, 'car4');
        this.car5 = this.game.add.sprite(LANE_2_X, -950, 'car5');
        
        this.car1.name = "Car 1";
        this.car2.name = "Car 2";
        this.car3.name = "Car 3";
        this.car4.name = "Car 4";
        this.car5.name = "Car 5";
        
        game.physics.arcade.enable(this.car1);
        game.physics.arcade.enable(this.car2);
        game.physics.arcade.enable(this.car3);
        game.physics.arcade.enable(this.car4);
        game.physics.arcade.enable(this.car5);
        
        this.car1.body.velocity.y = 200;
        this.car2.body.velocity.y = 300;
        this.car3.body.velocity.y = 500;
        this.car4.body.velocity.y = 400;
        this.car5.body.velocity.y = 250;
        
        this.car1.checkWorldBounds = true;
        this.car2.checkWorldBounds = true;
        this.car3.checkWorldBounds = true;
        this.car4.checkWorldBounds = true;
        this.car5.checkWorldBounds = true;
        
        this.car1.events.onOutOfBounds.add(this.setCarAgain, this);
        this.car2.events.onOutOfBounds.add(this.setCarAgain, this);
        this.car3.events.onOutOfBounds.add(this.setCarAgain, this);
        this.car4.events.onOutOfBounds.add(this.setCarAgain, this);
        this.car5.events.onOutOfBounds.add(this.setCarAgain, this);
        
        this.allOppCars = [];
        this.allOppCars.push(this.car1);
        this.allOppCars.push(this.car2);
        this.allOppCars.push(this.car3);
        this.allOppCars.push(this.car4);
        this.allOppCars.push(this.car5);
    },
    
    setCarAgain: function(carObj) {
        cx = parseInt(Math.random() * 3);
        cy = parseInt(Math.random() * -2000);
        
        if(cx == 0) {
            cx = LANE_1_X;
        } else if(cx == 1) {
            cx = LANE_2_X;
        } else if(cx == 2) {
            cx = LANE_3_X;
        }
        
        console.log("setCarAgain: ("+cx+", "+cy+")");
        carObj.x = cx;
        carObj.y = cy;
        //console.log(carObj);
        this.checkOppCarOverlap();
        carObj.bringToTop();
    },
    
    setSpeed: function(speed) {
        if(speed >= 0) {
            if(speed > this.background1.body.maxVelocity.y) {
                console.log("setSpeed: from: "+this.cntSpeed+" to: "+this.background1.body.maxVelocity.y);
                this.cntSpeed = this.background1.body.maxVelocity.y;
                this.background1.body.velocity.y = this.background1.body.maxVelocity.y;
                this.background2.body.velocity.y = this.background1.body.maxVelocity.y;
            } else {
                console.log("setSpeed: from: "+this.cntSpeed+" to: "+speed);
                this.cntSpeed = speed;
                this.background1.body.velocity.y = this.cntSpeed;
                this.background2.body.velocity.y = this.cntSpeed;
            }
        }
    },
    setAcceleration : function(accl) {
        //console.log("setAcceleration: set: "+accl);
        if(accl < 0 && (-accl) > this.background1.body.velocity.y) {
            accl = -this.background1.body.velocity.y;
        } else if(accl > 0 && accl > this.background1.body.maxVelocity.y) {
            accl = this.background1.body.maxVelocity.y;
        }
        //console.log("setAcceleration:  at: "+accl);
        this.background1.body.acceleration.y = accl;
        this.background2.body.acceleration.y = accl;
    },
    
    jumpBreak: function() {
        if(this.background1.body.acceleration.y == 0) {
            var accl = -100;
            this.setAcceleration(accl);
            this.cntSpeed = 0;
        } else {
            var accl = this.background1.body.acceleration.y - 100;
            this.setAcceleration(accl);
            this.cntSpeed = 0;
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
        console.log("Game Restart !!!");
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