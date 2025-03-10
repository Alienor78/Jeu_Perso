var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var game = new Phaser.Game(config);
var slime;
var chemin;
var obstacles;
var cursors;
var isJumping = false;
var moveCooldown = 0;

// Positions autorisées sur X
const positions = [200, 400, 600];
let currentPositionIndex = 1; // Départ au centre

function preload() {
    this.load.spritesheet("img_slime", "src/assets/Slime_sprite.png", { frameWidth: 32, frameHeight: 32 });
    this.load.image("img_chemin", "src/assets/Chemin 64x64.png");
    this.load.spritesheet("img_obstacle", "src/assets/Obstacles.png", {frameWidth: 64, frameHeight: 64});
}

function create() {

    chemin = this.add.tileSprite(400, 300, 800, 600, "img_chemin");

    slime = this.physics.add.sprite(positions[currentPositionIndex], 500, "img_slime");
    slime.setCollideWorldBounds(true);

    // Création de l'animation de mouvement
    this.anims.create({
        key: "anim_slime",
        frames: this.anims.generateFrameNumbers("img_slime", { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
    });

    // Création de l'animation de saut
    this.anims.create({
        key: "anim_jump",
        frames: this.anims.generateFrameNumbers("img_slime", { start: 2, end: 5 }),
        frameRate: 3,
        repeat: 0
    });

    // Lancer l'animation de base en boucle
    slime.anims.play("anim_slime");

    cursors = this.input.keyboard.createCursorKeys();

    obstacles = this.physics.add.group();

    this.time.addEvent({
        delay: 1000,
        callback: generateObstacle,
        callbackScope: this,
        loop: true
    });

    this.physics.add.collider(slime, obstacles, hitObstacle, null, this);

}

function update(time) {

    chemin.tilePositionY -= 3;
   

    if (moveCooldown < time) {
        if (cursors.left.isDown && currentPositionIndex > 0) {
            currentPositionIndex--;
            moveCooldown = time + 200; // Temps de cooldown pour éviter les déplacements trop rapides
        } else if (cursors.right.isDown && currentPositionIndex < positions.length - 1) {
            currentPositionIndex++;
            moveCooldown = time + 200;
        }
    }

    // Déplacer les obstacles verticalement
    obstacles.getChildren().forEach(obstacle => {
        obstacle.y += 2;
        if (obstacle.y >= 600) {
            obstacle.destroy();
        }
    });
    
    // Déplacement fluide vers la nouvelle position
    this.tweens.add({
        targets: slime,
        x: positions[currentPositionIndex],
        duration: 150,
        ease: 'Power2'
    });

    // Gestion du saut
    if (cursors.up.isDown && !isJumping) {
        isJumping = true;
        slime.anims.play("anim_jump");
        slime.setVelocityY(-200);
    }

     // Vérifier si le slime touche le sol pour arrêter l'état de saut
     if (slime.body.blocked.down || slime.body.touching.down) {
        if (isJumping) {
            isJumping = false;
            slime.anims.play("anim_slime", true);
        }
    }
}

function generateObstacle() {
    let randomPosition = Phaser.Math.RND.pick(positions);
    let obstacle = obstacles.create(randomPosition, 0, "img_obstacle"); // Position Y en haut de l'écran
    // obstacle.setVelocityX(-200); // Supprimer la vitesse horizontale
    obstacle.setCollideWorldBounds(true);
    obstacle.allowGravity = false;
    obstacle.setFrame(Phaser.Math.RND.integerInRange(0, 3));
}

function hitObstacle(slime, obstacle) {
    console.log("Collision avec un obstacle !");
    this.scene.pause();
}

manger_gratuit34

 
