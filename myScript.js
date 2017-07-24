var pause = false;
var TopHeight = 40;
var numofFood = 5;
var foodArray = [];
var bugArray = [];
var seconds_left = 60;
var raf;
var points = 0;
var index = window.location.href.lastIndexOf("=");
var level = window.location.href.substr(index + 1, 1);
var gameEnded = false;
var highscore = localStorage.getItem("highscore");

window.addEventListener("click", clicked);

init();

var interval = setInterval(
	function() {
		if (pause == false) {
			document.getElementById('timer').innerHTML = "Time Left:  " + --seconds_left;
		} else{
			document.getElementById('timer').innerHTML = "Time Left:  " + seconds_left;
		}
		
	},
	1000);

function init () {

	var canvas = document.getElementById("a");
	var context = canvas.getContext("2d");

	makeFood(context);
	if (pause) {
		drawPlayButton(context);
	} else{
		drawPauseButton(context);
	}
	createTop(context);
	mainLoop();
	
}

function mainLoop (context) {
	var canvas = document.getElementById("a");
	var context = canvas.getContext("2d");
	makeBug();

}

function gameOver () {
	var canvas = document.getElementById("a");
	var context = canvas.getContext("2d");
	context.clearRect(0,0, canvas.width, canvas.height);
	clearInterval(interval);
	gameEnded = true;

	context.strokeStyle = "black";
	context.font='bold 15px Arial';
	context.fillText("GameOver", 150, 200);
	context.fillText("Your Score is: " + points, 120, 250);
	context.fillText("Replay", 100, 300);
	context.fillText("Main menu", 210, 300);
	if(highscore !== null){
	   if (points > highscore) {
	      localStorage.setItem("highscore", points );
	      }
	}else{
	      localStorage.setItem("highscore", points );
	}
}

function clicked (event) {
	var canvas = document.getElementById("a");
	var context = canvas.getContext("2d");
	var x = event.clientX;
	var y = event.clientY;

	//play: x:201-207, y:23-35
	//pause: x:198-215, y:22-37
	if (pause == false) {
		//games on
		if ((x > 198) && (x < 217) && (y > 22 ) && (y < 37)){
			context.clearRect(0,0, 400, 40);
			pause = true;
			drawPlayButton(context);
		}
		//kill bug
		for (var i = 0; i < bugArray.length; i++) {
				var dis = Math.sqrt( ((x- bugArray[i].headxpos) * (x- bugArray[i].headxpos)) + ((y- bugArray[i].headypos) * (y- bugArray[i].headypos)) );
				if (dis < 5 + 30) {
					bugArray[i].alive = false;
					if (bugArray[i].bugtype == "blackBug") {
						points += 5;
					} else if (bugArray[i].bugtype == "redBug") {
						points += 3;
					} else {
						points += 1;
					}
					
				}
			}

	} else{
		//game stopped
		if ((x > 198) && (x < 217) && (y > 22 ) && (y < 37)){
			context.clearRect(0,0, 400, 40);
			pause = false;
			drawPauseButton(context);
		}
	}
	if (gameEnded == true) {
		if ((x > 100) && (x < 150) && (y > 300 ) && (y < 350)){
			location.reload();
		} else if ((x > 210) && (x < 270) && (y > 300 ) && (y < 350)) {
			window.location = "a2.html";
		}
	}

}

function drawPlayButton (context) {
	context.strokeStyle = "black";
	context.fillStyle = "black";

	context.beginPath();
	context.moveTo(190, 10);
	context.lineTo(210, 20);
	context.lineTo(190, 30);
	context.closePath();
	context.stroke();
	context.fill();
}

function drawPauseButton (context) {
	context.strokeStyle = "black";
	context.lineWidth = 5;
	context.beginPath();
	context.moveTo(195, 10);
	context.lineTo(195, 30);
	context.moveTo(205, 10);
	context.lineTo(205, 30);
	context.closePath();
	context.stroke();
}


function createTop (context) {
	context.beginPath();
	context.moveTo(0,TopHeight);
	context.lineTo(400,TopHeight);
	context.closePath();
	context.stroke();
}

function makeFood (context) {

	for (var i = 0; i < numofFood; i++) {
		var x = 20 + Math.random() * 300;
		var y = 160 + Math.random() * 450;

		context.fillStyle = "blue";
		context.beginPath();
		context.arc(x, y, 20, 0, 2*Math.PI);
		context.closePath();
		context.fill();
		context.lineWidth = 2;
		context.stroke();
		foodArray.push({x,y,alive:true});
	}
}

function makeBug () {
	var canvas = document.getElementById("a");
	var context = canvas.getContext("2d");

	setInterval(addBug, 1000 + Math.random() * 3000);

	function addBug () {
		var bug = {
		//head can start anywhere after the Top
		headxpos: 15 + Math.random() * 300,
		headypos: 45,
		//bodyxpos: this.headxpos,
		//bodyypos: 40,
		bugtype: null,
		probs:Math.random(),
		alive: true,
		color: null,

		draw: function() {

			context.fillStyle = bug.color;
		    context.beginPath();
		    context.arc(this.headxpos, this.headypos, 5, 0, Math.PI*2);
		    //context.arc(this.bodyxpos, this.bodyypos, 10, 0, Math.PI*2);
		    context.fill();
		    context.closePath();
		    context.stroke();
			}
		}
		if (pause == false) {
			bugArray.push(bug);
		}	
	}

	//make bug goes toward the closest food
	function draw () {
		context.clearRect(0,TopHeight, 400, 640);
		//countdown

		
		document.getElementById('score').innerHTML = "Score: " + points;

		for (var i = 0; i < foodArray.length; i++) {

			if (foodArray[i].alive == true) {
				var x = foodArray[i].x;
				var y = foodArray[i].y;

				context.fillStyle = "blue";
				context.beginPath();
				context.arc(x, y, 20, 0, 2*Math.PI);
				context.closePath();
				context.fill();
				context.lineWidth = 2;
				context.stroke();
			}
		}

		createTop(context);
		if (pause) {
			drawPlayButton(context);
		} else{
			drawPauseButton(context);
		}

		//bug.draw();
		var xVelocity;
		var yVelocity;

		for (var i = 0; i < bugArray.length; i++) {
			if (bugArray[i].alive == true) {
				//draw bugs
				bugArray[i].draw();

				var ori = Math.pow(400, 2) + Math.pow(640, 2); //max distance
				function cloestFood (bugx, bugy) {
					for (var i = 0; i < foodArray.length; i++) {
						if (foodArray[i].alive == true) {
							var dis = Math.pow(foodArray[i].x - bugx, 2) + Math.pow(foodArray[i].y - bugy, 2);
							if (dis < ori) {
								ori = dis;
								index = i;
							}
						}
						
					}
					//get the angle of the cloest food
					var dx = foodArray[index].x - bugx;
					var dy = foodArray[index].y - bugy;
					var angle = Math.atan2(dy, dx);
					return angle;
				}

				var angle = cloestFood(bugArray[i].headxpos, bugArray[i].headypos);
				//var type = Math.random();

				if (bugArray[i].probs < 0.3) {
					bugArray[i].bugtype = "blackBug";
					bugArray[i].color = "black";

					if (level == 1) {
						xVelocity = 1.5 * Math.cos(angle);
						yVelocity = 1.5 * Math.sin(angle);
					} else {
						xVelocity = 2 * Math.cos(angle);
						yVelocity = 2 * Math.sin(angle);
					}

					//needs to check level as well
					
				} else if (bugArray[i].probs < 0.6){
					bugArray[i].bugtype = "redBug";
					bugArray[i].color = "red";

					if (level == 1) {
						xVelocity = 0.75 * Math.cos(angle);
						yVelocity = 0.75 * Math.sin(angle);
					} else {
						xVelocity = 1 * Math.cos(angle);
						yVelocity = 1 * Math.sin(angle);
					}
					
				} else {
					bugArray[i].bugtype = "orangeBug";
					bugArray[i].color = "orange";

					if (level == 1) {
						xVelocity = 0.6* Math.cos(angle);
						yVelocity = 0.6 * Math.sin(angle);
					} else {
						xVelocity = 0.8 * Math.cos(angle);
						yVelocity = 0.8 * Math.sin(angle);
					}
					
				}

				if (pause == false) {
					bugArray[i].headxpos += xVelocity;
					bugArray[i].headypos += yVelocity;
				}

				function eatFood (x, y) {

					for (var i = 0; i < foodArray.length; i++) {

						var dis = Math.sqrt( ((x- foodArray[i].x) * (x- foodArray[i].x)) + ((y- foodArray[i].y) * (y- foodArray[i].y)) );

					    if (dis <= 20+5) {
					        //alert("touching");
					        foodArray[i].alive = false;
					        foodArray.splice(i, 1);
					        if (foodArray.length == 0) {
					        	gameOver();
					        }
					    }
					}

				}

				eatFood(bugArray[i].headxpos, bugArray[i].headypos);

				if (seconds_left <= 0){
				   	gameOver();
				}

				// bug.bodyxpos += xVelocity;
				// bug.bodyypos += yVelocity;

				// context.arc(headxpos, headypos, 5, 0, Math.PI*2);
				// context.arc(bodyxpos, bodyypos, 5, 0, Math.PI*2);

				//raf = window.requestAnimationFrame(draw);

			}
		}
		raf = window.requestAnimationFrame(draw);

	}
	raf = window.requestAnimationFrame(draw);

}
