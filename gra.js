var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '', {preload: preload, create: create, update: update});

function preload(){
	game.load.image('sky', 'assets/background.jpg');
	game.load.image('paddle', 'assets/paddle.png');
	game.load.image('ball', 'assets/ball.png');
	game.load.image('brick0', 'assets/brick0.png');
	game.load.image('brick1', 'assets/brick1.png');
	game.load.image('brick2', 'assets/brick2.png');
	game.load.image('brick3', 'assets/brick3.png');
	game.load.image('brick4', 'assets/brick4.png');

}

var bricks;
var paddle;
var ball;
var bop = true;
var lvl=.3;
var score=0;




function create(){


	ESC = game.input.keyboard.addKey(Phaser.Keyboard.ESC);



	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.checkCollision.down = false;

	var background = this.game.add.sprite(0,0,	'sky');
	background.width=game.world.width;
	background.height=game.world.height;
	
	paddle = game.add.sprite(game.world.centerX,game.world.height-8,'paddle');
	game.physics.enable(paddle);
	paddle.body.collideWorldBounds	= true;
	paddle.anchor.setTo(0.5,0.5);
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;




	ball = game.add.sprite(game.world.centerX,paddle.y-10,'ball');
	game.physics.arcade.enable(ball);

	ball.body.bounce.x	= 0.2;
	game.physics.enable(ball);
	ball.anchor.set(0.5);
	ball.body.collideWorldBounds = true;
	    ball.body.bounce.set(1);
	

	bricks=game.add.group();
	bricks.enableBody = true;
	bricks.physicsBodyType = Phaser.Physics.ARCADE;

	// fx to startowe x dla cegieł a fy to ilość rzędów
	var fx= (((game.world.width-((Math.floor(game.world.width/36)-3)*36)))/2);
	var fy= (Math.floor((Math.floor(game.world.height/52))));
	var cegua;

	for (var y=0; y<fy; y++){
		for (var x=0; x<Math.floor(game.world.width/36)-3; x++){
			cegua = bricks.create(fx +(x*36), 50+(y*32),randomBrick());
			cegua.body.immovable = true;
		}
	}

	 game.input.onDown.add(releaseBall, this);
	 scoreText = game.add.text(10, 10, 'Wynik: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });

}


function update(){
	game.physics.arcade.collide(ball, bricks, destruct, null, this);

//paletka jeździ
	paddle.x = game.input.x-(paddle.width/2);
    if (paddle.x < 30)
    {
        paddle.x = 30;
    }
    else if (paddle.x > game.width - 24)
    {
        paddle.x = game.width - 24;
    }

//kulka śmiga na paletce
    if (bop)
    {
    	ball.x=paddle.x;
    }
    else{
    	game.physics.arcade.collide(ball, paddle, ballpaddle, null, this);
    }



}

function destruct(ball,brick){
	score+=100;
	scoreText.text = 'score: ' + score;
	brick.kill();
}

function randomBrick(){

	return "brick"+randomInterval(0,4);

}


function randomInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}


function releaseBall () {


    if (bop){
        bop = false;
        var f = Math.floor(game.world.height*lvl);
        ball.body.velocity.y = -f;
    }

}

function ballpaddle(ball,paddle){
	 var d = 0;

    if (ball.x < paddle.x)
    {
        d = paddle.x - ball.x;
        ball.body.velocity.x = (-10 * d);
    }
    else if (ball.x > paddle.x)
    {

        d = ball.x -paddle.x;
        ball.body.velocity.x = (10 * d);
    }
    else
    {

        ball.body.velocity.x = 2 + Math.random() * 8;
    }
}




