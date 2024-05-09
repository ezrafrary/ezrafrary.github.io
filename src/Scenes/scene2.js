class scene2 extends Phaser.Scene{
    constructor(){
        super("1dscene");
        this.my = {sprite: {}};


    }
    preload() {
        // Assets from Kenny Assets pack "Monster Builder Pack"
        // https://kenney.nl/assets/monster-builder-pack
        this.load.setPath("./assets/");
    }

    create(){
        let spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        spaceKey.on('down', (key, event) => {
            this.scene.start('scene1');
        });
    }

    update(){

    }

}