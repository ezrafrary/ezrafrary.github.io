
highscore = 0;
score = 0;


class scene1 extends Phaser.Scene {
    constructor() {
        super("gameScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.xcord = 400;
        this.ycord = 500;

        this.wavesCompleted = 0;

        this.projectileVelocityX = 0;
        this.projectileVelocityY = 0;
        this.firstPass = false;
        this.ammoCount = 1;
        this.maxAmmo = 1;

        this.aKey = null;
        this.dkey = null;


        this.borderLeft = 0;
        this.borderRight = 800;

        this.enemyArr = [];

        this.enemiesKilled = 0;
        this.level = 1;
        this.levelTimer = 10;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Monster Builder Pack"
        // https://kenney.nl/assets/monster-builder-pack
        this.load.setPath("./assets/");

        // Load sprite atlas
        this.load.image("character", "/PNG/playerShip1_blue.png");
        this.load.image("projectile", "/PNG/Lasers/laserBlue04.png");
        this.load.image("enemy", "/PNG/ufoRed.png");
        
        // update instruction text
        //document.getElementById('description').innerHTML = '<h2>Monster.js<br>S - smile // F - show fangs<br>A - move left // D - move right</h2>'
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
    
        //sprites
        my.sprite.character1 = this.physics.add.sprite(this.xcord, this.ycord, "character");
        my.sprite.shoot = this.physics.add.sprite(-100, -1000, "projectile");
        my.sprite.shoot.visible = false;

        my.sprite.enemy1 = this.physics.add.sprite(-100, 900, "enemy");
        this.enemyArr.push(my.sprite.enemy1);

        my.sprite.enemy2 = this.physics.add.sprite(-100, 950, "enemy");
        this.enemyArr.push(my.sprite.enemy2);

        my.sprite.enemy3 = this.physics.add.sprite(-100, 900, "enemy");
        this.enemyArr.push(my.sprite.enemy3);

        my.sprite.enemy4 = this.physics.add.sprite(-100, 950, "enemy");
        this.enemyArr.push(my.sprite.enemy4);

        my.sprite.enemy5 = this.physics.add.sprite(-100, 900, "enemy");
        this.enemyArr.push(my.sprite.enemy5);

        my.sprite.enemy6 = this.physics.add.sprite(-100, 950, "enemy");
        this.enemyArr.push(my.sprite.enemy6);

        my.sprite.enemy7 = this.physics.add.sprite(-100, 900, "enemy");
        this.enemyArr.push(my.sprite.enemy7);

        my.sprite.enemy8 = this.physics.add.sprite(-100, 950, "enemy");
        this.enemyArr.push(my.sprite.enemy8);

        my.sprite.enemy9 = this.physics.add.sprite(-100, 900, "enemy");
        this.enemyArr.push(my.sprite.enemy9);



        //buttons
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


        let kKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);

        kKey.on('down', (key, event) => {
            this.spawnEnemy(my.sprite.enemy1);
        });

        let spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        

        spaceKey.on('down', (key, event) => {
            this.fireProjectile();
        });



        this.init_game();
        
    }

    init_game(){
        
        let my = this.my;
        console.log("starting game");
        this.projectileVelocityX = 0;
        this.projectileVelocityY = -3;
        this.firstPass = false;
        this.ammoCount = 1;
        this.maxAmmo = 1;

        this.levelTimer - 10;

        this.borderLeft = 0;
        this.borderRight = 800;
        

        this.enemiesKilled = 0;
        this.level = 1;
        this.spawnEnemy(my.sprite.enemy1);
    }


    update() {
        let my = this.my;    // create an alias to this.my for readability
        this.levelTimer = this.levelTimer - 1;
        if(this.levelTimer < 0){
            this.levelTimer = 600;
            for (let i = 0; i < this.level; i++){
                
                this.spawnEnemy(this.enemyArr[i]);
                
                
            }
            this.wavesCompleted = this.wavesCompleted + 1;
        }
        if(this.wavesCompleted > 3){
            this.wavesCompleted = 0;
            this.level = this.level + 1;
        }
        
        let movementAmmount = 2;
        if(this.dKey.isDown){
            if(my.sprite.character1.x + movementAmmount < this.borderRight){
                my.sprite.character1.x = my.sprite.character1.x + movementAmmount;
            }
        }
        if(this.aKey.isDown){
            if(my.sprite.character1.x - movementAmmount > this.borderLeft){
                my.sprite.character1.x = my.sprite.character1.x - movementAmmount;
            }
        }

        this.handleProjectile();
        this.handleEnemy();

        //colisions
        this.physics.overlap(my.sprite.character1, my.sprite.shoot, this.handleCollisionPlayer1Shoot, null, this);
        
        
        
    }
    
    spawnEnemy(enemyName){
        let my = this.my;
        enemyName.x = this.getRndInteger(10,700);
        enemyName.y = 0;

    }

    killEnemy(enemyName){
        let my = this.my;


        this.enemiesKilled = this.enemiesKilled + 1;
        enemyName.x = -100;
        enemyName.y = -100;
    }

    handleEnemy(){
        let my = this.my;

        

        for (let element of this.enemyArr){
            element.y = element.y + 1;
            if(element.y > 700){
                element.y = 0;
            }
            if(this.physics.overlap(my.sprite.shoot, element)){
                if(my.sprite.shoot.visible){
                    this.killEnemy(element);
                }
            }
            if(this.physics.overlap(my.sprite.character1, element)){
                if(this.enemiesKilled > highscore){
                    highscore = this.enemiesKilled;
                }
                this.scene.start();

                this.scene.start('scene3');
                
            }
        }

    }
    

    handleCollisionPlayer1Shoot(){
        let my = this.my;
        if(!this.firstPass){
            my.sprite.shoot.visible = false;
            this.ammoCount = this.ammoCount + 1;
        }
    }

    fireProjectile(){
        if(this.ammoCount > 0){
            this.ammoCount = this.ammoCount - 1;
            let my = this.my;
            my.sprite.shoot.visible = true;
            my.sprite.shoot.x = my.sprite.character1.x;
            my.sprite.shoot.y = my.sprite.character1.y;
            this.projectileVelocityX = 0;
            this.projectileVelocityY = -10;
            this.firstPass = true;
        }
        
    }

    handleProjectile() {
        let my = this.my;
        my.sprite.shoot.x = my.sprite.shoot.x + this.projectileVelocityX;
        my.sprite.shoot.y = my.sprite.shoot.y + this.projectileVelocityY;
        
        
        
        if (my.sprite.shoot.y > my.sprite.character1.y){
            this.projectileVelocityY = this.projectileVelocityY - 0.5;
        }else{
            this.projectileVelocityY = this.projectileVelocityY + 0.1;
        }

        if(this.firstPass){
            if(this.projectileVelocityY > 0){
                this.firstPass = false;
            }
        }
        

        if(my.sprite.shoot.x > my.sprite.character1.x && !this.firstPass){
            this.projectileVelocityX = this.projectileVelocityX - 0.05;
        }
        if(my.sprite.shoot.x < my.sprite.character1.x && !this.firstPass){
            this.projectileVelocityX = this.projectileVelocityX + 0.05;
        }

        if(my.sprite.shoot.x > this.borderRight){
            this.projectileVelocityX = 0 - this.projectileVelocityX;
        }
        if(my.sprite.shoot.x < this.borderLeft){
            this.projectileVelocityX = 0 - this.projectileVelocityX;
        }
            
    }   

    

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
    
}






class scene2 extends Phaser.Scene{
    constructor(){
        super("scene2");
        this.my = {sprite: {}};

        
    }
    preload() {
        // Assets from Kenny Assets pack "Monster Builder Pack"
        // https://kenney.nl/assets/monster-builder-pack
        this.load.setPath("./assets/");
    }

    create(){

        this.add.text(100, 100, "Main Menu");

        this.add.text(100, 150, "press SPACE to start");

        this.add.text(100, 300, "High Score: " + highscore);
        this.add.text(150, 400, "Press A and D to move left and right. Space to shoot");

        let spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); 
        spaceKey.on('down', (key, event) => {
            this.scene.start('gameScene');
        });
    }

    update(){
    }

}

class scene3 extends Phaser.Scene{
    constructor(){
        super("scene3");
        this.my = {sprite: {}};
    }
    preload() {
        // Assets from Kenny Assets pack "Monster Builder Pack"
        // https://kenney.nl/assets/monster-builder-pack
        this.load.setPath("./assets/");
    }
    create(){
        this.add.text(100,100, "YOU DIED");
        this.add.text(100, 300, "press SPACE to return to main menu");
        let spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); 
        spaceKey.on('down', (key, event) => {
            this.scene.start('scene2');
        });
    }
    update(){

    }
}