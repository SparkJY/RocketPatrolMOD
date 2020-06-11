class Play extends Phaser.Scene {

    constructor() {

        super("playScene");

    }



    preload() {

        // load images/tile sprites

        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('spaceship2', './assets/spaceship2.png');
        this.load.image('starfield', './assets/background.png');

        this.load.audio('BGM', './assets/BGM.mp3');
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        // load spritesheet

        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});

    }



    create() {
        //play and loop BGM
        let bgm = this.sound.add('BGM', { volume: 0.8, loop: true });
        bgm.play();
        // place tile sprite

        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);



        // white rectangle borders

        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);

        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2 - 8, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);

        // add spaceships (x3)

        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new Spaceship2(this, game.config.width, 200, 'spaceship2', 0, 8).setScale(0.5, 0.5).setOrigin(0,0);


        // define keys for p1 and p2
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);    

        // animation config

        this.anims.create({

            key: 'explode',

            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),

            frameRate: 30

        });



        // player 1 score
        this.p1Score = 0;
        //this.p2Score = 0;
        this.hScore = highestScore;
        // score display

        let scoreConfig = {

            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100

        }

        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        //this.scoreRight = this.add.text(400, 54,"Highest: " + this.hScore, scoreConfig);
        // game over flag

        this.gameOver = false;
        
        
        
        // 30sec ship speed up
        this.clock = this.time.delayedCall(30000, ()=> {
            
            this.sound.play('sfx_select');
            game.settings.spaceshipSpeed += 2;
            //this.timer = this.add.text(520, 34, Math.floor((game.settings.gameTimer - this.clock.elapsed) / 1000), scoreConfig);
        }, null, this);

        // 60-second play clock

        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            
        }, null, this);

        //timer
        /*if(game.settings.gameTimer == 60000){

            this.timer= 60;



        } else{

            this.timer = 45;

        }*/


        //this.timer = this.add.text(260, 54, 'Time: '+ this.timeMe-this.clock.getElapsedSeconds(), scoreConfig);


         //add mouse control the rocket 
         this.input.on('pointerdown', function(pointer){

            this.input.mouse.requestPointerLock();

            if (!this.p1Rocket.isFiring && !this.gameOver && pointer.leftButtonDown()) {

                this.p1Rocket.type = 0;
                this.p1Rocket.isFiring = true;
                this.p1Rocket.sfxRocket.play();

            } else if (!this.p1Rocket.isFiring && !this.gameOver && pointer.rightButtonDown() && this.p1Rocket.rtypeNumber > 0) {

                this.p1Rocket.isFiring = true;
                this.p1Rocket.type = 1;
                this.p1Rocket.setFlipY(true); 
                this.p1Rocket.setScale(0.3);
                this.p1Rocket.rtypeNumber--;
                this.p1Rocket.sfxRocket.play();
            }

        }, this);

        //add using mouse to move and shoot rocket

        this.input.on('pointermove', function (pointer) {

           

                if (!this.p1Rocket.isFiring && !this.gameOver && this.input.mouse.locked) {

                    this.p1Rocket.x += pointer.movementX;
                    this.p1Rocket.x = Phaser.Math.Wrap(this.p1Rocket.x, 0, game.renderer.width);
                }
            

        }, this);


    


    }
    



    update() {

       // if(this.hScore <= this.p1Score){

          //  this.scoreRight.setText("Highest: " + this.p1Score) ;

        //}

        //this.timeLeft.text = Math.floor((game.settings.gameTimer - this.clock.elapsed) / 1000);
        //this.timeRight = this.game.settings.gameTimer/1000 - Math.floor(this.clock.elapsed/1000);
        // check key input for restart / menu

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {

            this.scene.restart();

        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {

            this.scene.start("menuScene");

        }



        

        this.starfield.tilePositionX -= 4;  // scroll tile sprite

        if (!this.gameOver) {               

            this.p1Rocket.update();         // update rocket sprite

            this.ship01.update();           // update spaceships (x3)

            this.ship02.update();

            this.ship03.update();
            this.ship04.update();
        }             

        // check collisions

        
        if(this.checkCollision(this.p1Rocket, this.ship04)) {

            this.p1Rocket.reset();

            this.shipExplode(this.ship04);   

        }


        if(this.checkCollision(this.p1Rocket, this.ship03)) {

            this.p1Rocket.reset();

            this.shipExplode(this.ship03);   

        }

        if (this.checkCollision(this.p1Rocket, this.ship02)) {

            this.p1Rocket.reset();

            this.shipExplode(this.ship02);

        }

        if (this.checkCollision(this.p1Rocket, this.ship01)) {

            this.p1Rocket.reset();

            this.shipExplode(this.ship01);

        }

    }



    checkCollision(rocket, ship) {

        // simple AABB checking

        if (rocket.x < ship.x + ship.width && 

            rocket.x + rocket.width > ship.x && 

            rocket.y < ship.y + ship.height &&

            rocket.height + rocket.y > ship. y) {

                return true;

        } else {

            return false;

        }

    }



    shipExplode(ship) {
        this.cameras.main.shake(500,0.01);      //Add camera shake

        ship.alpha = 0;                         // temporarily hide ship

        // create explosion sprite at ship's position

        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);

        boom.anims.play('explode');             // play explode animation

        boom.on('animationcomplete', () => {    // callback after animation completes

            ship.reset();                       // reset ship position

            ship.alpha = 1;                     // make ship visible again

            boom.destroy();                     // remove explosion sprite

        });

        // score increment and repaint

        this.p1Score += ship.points;
        //store socre

        this.scoreLeft.text = this.p1Score;     

        
        // play sound

        this.sound.play('sfx_explosion');  

    }

}