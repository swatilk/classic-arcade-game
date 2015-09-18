/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefining the variables we'll be using within this scope,
     * creating the canvas element, grabbing the 2D context for that canvas
     * setting the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;
    canvas.width = 505;
    canvas.height = 606;

    /**
    * @description Serves as the kickoff point for the game loop itself
    * and handles properly calling the update and render methods.
    */
    function main() {
        /* Gets the time delta information which is required if the game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is)
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        if(startPage){
            document.getElementById("lives-div").style.display = "none";
            document.getElementById("start-button").onclick = function(){
                document.getElementById("start-page").style.display = "none";
                startPage = false;
                gameOver = false;
                if(startPage === false || document.getElementById("start-page").style.display == "none"){
                    doc.body.appendChild(canvas);
                }
                document.getElementById("lives-div").style.display = "block";
                if(gameOver){
                    player.displayGameOver();
                }
                else if(!startPage && !gameOver)
                {
                    doc.body.appendChild(canvas);
                    /* Calls update/render functions, passing along the time delta to
                     * the update function since it may be used for smooth animation.
                     */
                    update(dt);
                    render();
                    /* Sets our lastTime variable which is used to determine the time delta
                     * for the next time this function is called.
                     */
                    lastTime = now;
                    /* Using the browser's requestAnimationFrame function to call main
                     * function again as soon as the browser is able to draw another frame.
                     */
                    win.requestAnimationFrame(main);
                }
            }
        }
        else if(gameOver){
            player.displayGameOver();
        }
        else if(!startPage && !gameOver)
        {
            update(dt);
            render();
            lastTime = now;
            win.requestAnimationFrame(main);
        }
    };

    /** This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }

    /** @description This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data.
     */
    function update(dt) {
        if(!gameOver && !startPage){
            updateEntities(dt);
            checkCollisions();
        }
    }

    /**
    * @description This is called by the update function  and loops through all of the
    * objects within your allEnemies array as defined in app.js and calls
    * their update() methods. It will then call the update function for your
    * player object. These update methods update the data/properties related to  the object.
    */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /**
    * @description Checks for enemy and player collision using the collision
    * detection algorithm. When the lives of player are exhausted, player's
    * displayGameOver function is called which resets player properties and
    * displays start page.
    */
    function checkCollisions(){
        player.rect = [player.x, player.y, player.width, player.height];
        for(var i=0; i < allEnemies.length; i++){
            allEnemies[i].rect = [allEnemies[i].x,allEnemies[i].y, 50, 27];
            if(player.rect[0] < allEnemies[i].rect[0] + allEnemies[i].rect[2] &&
                player.rect[0] + player.rect[2] > allEnemies[i].rect[0] &&
                player.rect[1] < allEnemies[i].rect[1] + allEnemies[i].rect[3] &&
                player.rect[1] + player.rect[3] > allEnemies[i].rect[1]){
                    player.x = 200;
                    player.y = 390;
                    if(player.lives === 0){
                        gameOver = true;
                        player.displayGameOver();
                        startPage = true;
                        ctx.clearRect(0, 0, 650, 700);
                        doc.canvas.style.display = "none";
                        document.getElementById("lives-div").style.display = "none";
                        document.getElementById("start-page").style.display = "block";
                        player.lives = 0;
                    }
                    else{
                        player.lives = player.lives - 1;
                        if(player.lives == 0){
                           player.displayGameOver();
                           startPage = true;
                           ctx.clearRect(0, 0, 650, 700);
                           doc.canvas.style.display = "none";
                           document.getElementById("lives-div").style.display = "none";
                           document.getElementById("start-page").style.display = "block";
                        }
                    }
                    document.getElementById("lives").innerHTML = player.lives;
            }
        }
    }

     /**
     * @description Initially draws the "game level", it will then call
     * the renderEntities function. Because the animation is created by
     * drawing the entire screen over and over.
     */
    function render() {
        if(gameOver){
            player.displayGameOver();
        }
        else{
            /* This array holds the relative URL to the image used
             * for that particular row of the game level.
             */
            var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

            /* Loops through the number of rows and columns we've defined above
             * and, using the rowImages array, draws the correct image for that
             * portion of the "grid"
             */
            for (row = 0; row < numRows; row++) {
                for (col = 0; col < numCols; col++) {
                    /* The drawImage function of the canvas' context element
                     * requires 3 parameters: the image to draw, the x coordinate
                     * to start drawing and the y coordinate to start drawing.
                     * We're using our Resources helpers to refer to the images
                     * so that we get the benefits of caching these images, since
                     * we're using them over and over.
                     */
                    ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                }
            }
            renderEntities();
        }
    }

    /**
    * @description Called by the render function and is called on each game
    * tick. It's purpose is to then call the render functions defined
    * on the enemy and player entities within app.js
    */
    function renderEntities() {
        /* Loops through all of the objects within the allEnemies array and calls
         * the render function defined.
         */
        if(!gameOver){
            allEnemies.forEach(function(enemy) {
                enemy.render();
            });

            player.render();
        }
    }

    /**
    * @description Resets the game after player has lost all lives. Resets the
    * game by setting the lives back to the initial value and by calling the main
    * function which will start the animation by calling update and render functions
    */
     win.reset = function() {
        document.getElementById("start-page").style.display = "none";
        startPage = false;
        gameOver = false;
        player.lives = 3;
        document.getElementById("lives-div").style.display = "block";
        main();
        return;
    }

    /* Loads all the images that we will need for our game level. Then sets init as the callback
     * method, so that when all of these images are properly loaded the game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Gem Blue.png',
        'images/Gem Green.png'
    ]);
    Resources.onReady(init);

    /* Assigns the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
