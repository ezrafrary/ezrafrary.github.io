class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
        this.keyA = null;
        this.keyS = null;
        this.keyD = null;
        this.keyW = null;
    }
 
    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 600;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 1.6;
        this.coinsCollected = 0;
        this.levelsCompleted = 0;
        this.cameraStartX = 0;
        this.cameraStartY = 0;
        this.Level1Done = false;
        
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);
        

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.hiddenLayer1 = this.map.createLayer("hiddenLayer1", this.tileset, 0, 0);
        this.hiddenLayer2 = this.map.createLayer("hiddenLayer2", this.tileset, 0, 0);
        this.hiddenLayer3 = this.map.createLayer("hiddenLayer3", this.tileset, 0, 0);
        this.hiddenLayer4 = this.map.createLayer("hiddenLayer4", this.tileset, 0, 0);
        this.hiddenLayer5 = this.map.createLayer("hiddenLayer5", this.tileset, 0, 0);
        
        this.winnerScreen = this.map.createLayer("winnerscreen", this.tileset, 0, 0);



        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });
        this.hiddenLayer1.setCollisionByProperty({
            collides: false
        });
        this.hiddenLayer2.setCollisionByProperty({
            collides: false
        });
        this.hiddenLayer3.setCollisionByProperty({
            collides: false
        });
        this.hiddenLayer4.setCollisionByProperty({
            collides: false
        });
        this.hiddenLayer5.setCollisionByProperty({
            collides: false
        });
        this.winnerScreen.setCollisionByProperty({
            collides: false
        });
        this.winnerScreen.setAlpha(0);
        this.hiddenLayer5.setAlpha(0);
        this.hiddenLayer4.setAlpha(0);
        this.hiddenLayer3.setAlpha(0);
        this.hiddenLayer2.setAlpha(0);
        this.hiddenLayer1.setAlpha(0); //make it invisible



        

        // TODO: Add createFromObjects here
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });
        this.flags = this.map.createFromObjects("Objects", {
            name: "flag",
            key: "tilemap_sheet",
            frame: 111
        });
        this.shields = this.map.createFromObjects("Objects", {
            name: "forcefield",
            key: "tilemap_sheet",
            frame: 54
        });
        


        // TODO: Add turn into Arcade Physics here
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.flags, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.shields, Phaser.Physics.Arcade.STATIC_BODY);
        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);
        this.flagGroup = this.add.group(this.flags);
        this.shieldGroup = this.add.group(this.shields);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 345, "platformer_characters", "tile_0000.png");
        my.sprite.playerHelper = this.physics.add.sprite(1100, 345, "platformer_characters", "tile_0002.png");

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.hiddenLayer1);
        this.physics.add.collider(my.sprite.player, this.hiddenLayer2);
        this.physics.add.collider(my.sprite.player, this.hiddenLayer3);
        this.physics.add.collider(my.sprite.player, this.hiddenLayer4);
        this.physics.add.collider(my.sprite.player, this.hiddenLayer5);
        this.physics.add.collider(my.sprite.player, this.winnerScreen);

        this.physics.add.collider(my.sprite.player, my.sprite.playerHelper);

        
        this.physics.add.collider(my.sprite.playerHelper, this.groundLayer);
        this.physics.add.collider(my.sprite.playerHelper, this.hiddenLayer1);
        this.physics.add.collider(my.sprite.playerHelper, this.hiddenLayer2);
        this.physics.add.collider(my.sprite.playerHelper, this.hiddenLayer3);
        this.physics.add.collider(my.sprite.playerHelper, this.hiddenLayer4);
        this.physics.add.collider(my.sprite.playerHelper, this.hiddenLayer5);
        this.physics.add.collider(my.sprite.playerHelper, this.winnerScreen);


        // TODO: Add coin collision handler
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            this.coinsCollected = this.coinsCollected + 1;
            this.makeNewLayersVisible();
        });

        this.physics.add.overlap(my.sprite.player, this.flagGroup, (obj1, obj2) => {
            obj2.destroy();
            this.levelsCompleted = this.levelsCompleted + 1;
            this.makeNewLayersVisible();
        });

        this.physics.add.overlap(my.sprite.player, this.shieldGroup, (obj1, obj2) => {
            console.log(my.sprite.player.body.velocity.x);
            if(my.sprite.player.body.velocity.x > 600){
                console.log("test")
            }else{
                
                my.sprite.player.setAccelerationX(-10);
                my.sprite.player.setVelocityX(-500);
            }
        })

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        this.physics.world.drawDebug = false;
        // debug key listener (assigned to F key)
        this.input.keyboard.on('keydown-F', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // TODO: Add movement vfx here
        my.vfx.walking = this.add.particles(1, 5, "kenny-particles", {
            frame: ['circle_01.png', 'circle_01.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.1},
            maxAliveParticles: 14,
            lifespan: 350,
            gravityY: 100,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();

        // TODO: add camera code here
        //level 1: 48 x 18 = 864 450
        console.log(this.map.heightInPixels);
        this.cameras.main.setBounds(this.cameraStartX, this.cameraStartY, 864, 468);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);



        //tutorial
        const text1 = this.add.text(150,300, 'press the arrow keys to move');
        const text2 = this.add.text(1000,350, 'use WASD to move blue guy')
        const text3 = this.add.text(1330, 55, 'You will need to be going ');
        const text4 = this.add.text(1330, 70, 'fast to get through the shield');
        const text5 = this.add.text(1330, 500, 'Thanks for playing! Press R to restart');
        const test6 = this.add.text(1330, 515, 'Created by Ezra Frary');
        const text7 = this.add.text(100,700, 'EZ GAME');

    }
    
    makeNewLayersVisible(){
        console.log(this.levelsCompleted)
        if(this.levelsCompleted == 1){
            this.cameras.main.setBounds(0, 0, this.map.widthInPixels, 468);
        }
        if(this.levelsCompleted == 2){
            this.cameras.main.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels);
        }
        if(this.levelsCompleted == 0){
            if(this.coinsCollected == 1){
                this.hiddenLayer1.setAlpha(100);
                this.hiddenLayer1.setCollisionByProperty({collides: true});
            }
            if(this.coinsCollected == 2){
                this.hiddenLayer2.setAlpha(100);
                this.hiddenLayer2.setCollisionByProperty({collides: true});
            }
            if(this.coinsCollected == 3){
                this.hiddenLayer3.setAlpha(100);
                this.hiddenLayer3.setCollisionByProperty({collides: true});
            }
        }
        if(this.levelsCompleted == 1){
            if(this.coinsCollected == 4){
                this.hiddenLayer4.setAlpha(100);
                this.hiddenLayer4.setCollisionByProperty({collides: true});
            }
            if(this.coinsCollected == 5){
                this.hiddenLayer5.setAlpha(100);
                this.hiddenLayer5.setCollisionByProperty({collides: true});
            }
        }
        
        
    }

    withinRange(leftValue, midValue, rightValue){
        if(leftValue < midValue && midValue < rightValue){
            return true
        }
        return false;
    }

    update() {

        if(this.levelsCompleted > 0){
            if(this.keyA.isDown) {
                my.sprite.playerHelper.setAccelerationX(-this.ACCELERATION);
            } else if(this.keyD.isDown) {
                my.sprite.playerHelper.setAccelerationX(this.ACCELERATION);
            }else{
                my.sprite.playerHelper.setAccelerationX(0);
                my.sprite.playerHelper.setDragX(this.DRAG);
            }         
            if(Phaser.Input.Keyboard.JustDown(this.keyW)) {
                if(my.sprite.playerHelper.body.blocked.down || (this.withinRange(my.sprite.player.x - 25, my.sprite.playerHelper.x, my.sprite.player.x + 25)) && this.withinRange(my.sprite.player.y - 25, my.sprite.playerHelper.y, my.sprite.player.y)){
                    my.sprite.playerHelper.body.setVelocityY(this.JUMP_VELOCITY);
                }
            }
        }
        

        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }
            

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // TODO: have the vfx stop playing
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if(my.sprite.player.body.blocked.down || (this.withinRange(my.sprite.playerHelper.x - 25, my.sprite.player.x, my.sprite.playerHelper.x + 25) && this.withinRange(my.sprite.playerHelper.y - 25, my.sprite.player.y, my.sprite.playerHelper.y))){
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            }
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}