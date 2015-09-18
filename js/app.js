var gameOver = false;
var startPage = true;
var playerX = 200;
var playerY = 390;
var allEnemies =[];

/**
* @description Represents an Enemy
* @constructor
* @param {number} x - The x position of the enemy
* @param {number} y - The author of the enemy
* @param {number} speed - The initial speed of the enemy
*/
var Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = 50;
    this.height = 27;
    this.rect = [this.x, this.y, this.width, this.height];
}

/**
* @description Updates the speed, x and y positions of enemy
*/
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt * 2;
    this.y = this.y;
    if (this.x >= 500){
        this.x = -70;
        this.speed = 85 * Math.floor(Math.random() * (6 - 1)) + 1;
        while(this.speed < 5){
            this.speed = 85 * Math.floor(Math.random() * (6 - 1)) + 1;
        }
    }
}

/**
* @description draws the enemy on the screen
*/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
* @description Represents a Player
* @constructor
*/
var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = playerX;
    this.y = playerY;
    this.width = 50;
    this.height = 27;
    this.rect = [this.x, this.y, this.width, this.height];
    this.lives = 3;
}

/**
* @description Updates the lives left, x and y positions of the player
*/

Player.prototype.update = function(){
    this.x = this.x;
    this.y = this.y;
    document.getElementById("lives").innerHTML = this.lives;
}

/**
* @description draws the player on the screen
*/
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
* @description Displays the Start Page and calls reset function when
* all the lives of the player are exhausted
*/
Player.prototype.displayGameOver = function(){
    ctx.clearRect(0, 0, 650, 700);
    document.getElementById("lives-div").style.display = "none";
    document.getElementById("start-page").style.display = "block";
    document.getElementById("start-button").onclick = function(){
        reset();
        if(!startPage && !gameOver)
        {
            update(dt);
            render();
        }
    }
}

/**
* @description Handles the key inputs from the user
* @param {string} key - The code of the key pressed by the user
*/
Player.prototype.handleInput = function(key){
    switch(key){
        case 'left':
            this.x = this.x - 100;
            if(this.x < 0){
                this.x = this.x + 100;
            }
            break;

        case 'right':
            this.x = this.x + 100;
            if(this.x > 420){
                this.x = this.x - 100;
            }
            break;

        case 'up':
            this.y = this.y - 80;
            if(this.lives == 0){
                gameOver = true;
                this.displayGameOver();
            }
            else{
                if(this.y <= -10){
                    this.lives = this.lives - 1;
                    document.getElementById("lives").innerHTML = this.lives;
                    this.y = playerY;
                }
                else{
                    document.getElementById("lives").innerHTML = this.lives;
                }
            }
            break;
        case 'down':
            this.y = this.y + 80;
            if(this.y > 420){
                this.y = this.y - 80;
            }
            break;

        default:
            console.log("invalid key press, Use arrow keys");
            break;
    }
}

/**
* Pushes all the enemy objects into the array allEnemies
*/
for(var i=1; i<4; i++){
    var enemySpeed;
    /**
    * @description Computes speed for the enemy objects
    */
    function computeSpeed(){
        enemySpeed = 85 * Math.floor(Math.random() * 5) + 1;
        while(enemySpeed < 5){
            enemySpeed = 85 * Math.floor(Math.random() * (6 - 1)) + 1;
        }
        return enemySpeed;
    }
    var enemyX = Math.floor(Math.random() * (-80 -(-10)))- 10;
    allEnemies.push(new Enemy(enemyX,((i*60)+(i*10)),computeSpeed()));
}

var player = new Player();

/**
* @description Listens to the key press
*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
