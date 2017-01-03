var level;
var levelNum;
var tileSize;
var title;

var debug = false;

function setup() {
	var w = window.innerWidth-100;
	var h = window.innerHeight-100;
	var canvas = createCanvas(w, h);
	canvas.class("center");
	canvas.parent(document.getElementById('content'));

	levelNum = 0;
	if(debug) levelNum = Levels.length-1;
	level = new Level(Levels[levelNum]);


	textFont('Quicksand');
	title = new Title(level.name, 1000);
}

function draw() {
	push();
	level.show();
	pop();
	title.show();
}

function keyPressed(){ 
	var v = 1;
	if (keyCode === LEFT_ARROW) {
		level.move(-v, 0);
	}
	if (keyCode === RIGHT_ARROW) {
		level.move(v, 0);
	}
	if (keyCode === UP_ARROW) {
		level.move(0, -v);
	}
	if (keyCode === DOWN_ARROW) {
		level.move(0, v);
	}

	if(key  === 'R'){
		level.reset();
	}

	if(debug){
		if(key  === 'S'){
			rndLevel = randomLevel();
			console.log(rndLevel, JSON.stringify(rndLevel, null, '\t'));
			level.loadLevel(rndLevel);
		}	

		if(key  === 'A'){
			levelNum += Levels.length-1;
			levelNum %= Levels.length;
			level = new Level(Levels[levelNum]);
			title.newTitle(level.name);
		}

		if(key  === 'D'){
			levelNum += Levels.length+1;
			levelNum %= Levels.length;
			level = new Level(Levels[levelNum]);
			title.newTitle(level.name);
		}
	}
}

var touchMovement;

function touchStarted() {
	touchMovement = createVector();
	return false;
}

function touchMoved() {
	touchMovement.add(createVector((ptouchX-touchX)*1./width, (ptouchY-touchY)*1./height));
	return false;
}

function touchEnded() {
	var x = 0;
	var y = 0;
	var dx = Math.abs(touchMovement.x);
	var dy = Math.abs(touchMovement.y);
	var len = touchMovement.mag();
	if(len < 80) return;
	if(Math.abs(touchMovement.x) > Math.abs(touchMovement.y)){
		x = (touchMovement.x > 0)? -1 : 1;
	} else {
		y = (touchMovement.y > 0)? -1 : 1;
	}
	level.move(x, y);
	return false;
}


class Level {
	constructor(json) {
		this.json = json;
		this.loadLevel(json);
	}

	show() {
		background("#5B5EEA");
		translate((width-this.width)/2, (height-this.height)/2);
		noStroke();
		stroke("#5B5EEA");
		fill("#393c95");
		rect(0, 0, this.width, this.height);

		noStroke();
		fill("#5B5EEA");
		for(var i = 0; i < this.grid.length; i++) {
			for(var j = 0; j < this.grid[0].length; j++) {
				if(this.grid[i][j] == 1) {
					//rect(Math.round(i*tileSize-0.5), Math.round(j*tileSize-0.5), Math.ceil(tileSize+0.5), Math.ceil(tileSize+0.5));
					rect(i*tileSize-0.5, j*tileSize-0.5, tileSize+0.5, tileSize+0.5);
				}
			}
		}

		for(var i = 0; i < this.goals.length; i++) {
			this.goals[i].update();
			this.goals[i].show();
		} 

		for(var i = 0; i < this.balls.length; i++) {
			this.balls[i].update();
			this.balls[i].show();
			if(this.balls[i].remove){
				this.balls.splice(i--, 1);
				this.checkWin();
			}
		} 

		if(debug) {
			textAlign(LEFT, TOP);
			textSize(20);
			fill(255);
			text("Movements:"+this.movements, 20, 20);
		}

	}

	reset(time){
		setTimeout(function(level){
			level.loadLevel(level.json);
			title.newTitle(level.name);
		}, time, this);
	}

	lose() {
		this.block = true;
		title.newTitle("LOSE");
		this.reset(title.timeView);
	}

	loadLevel(json) {
		this.json = json;
		this.name = json.name;
		this.movements = 0;
		this.w = json.width; 
		this.h = json.height;
		this.win = false;
		this.block = false;
		this.width;
		this.height;

		this.createGrid(json.grid);

		this.balls = [];
		for(var i = 0; i < json.balls.length; i++){
			var x = json.balls[i].x*tileSize+tileSize*0.5;
			var y = json.balls[i].y*tileSize+tileSize*0.5;
			var col = color(json.balls[i].color);
			this.balls.push(new Ball(x, y, col));
		}

		this.goals = [];
		for(var i = 0; i < json.goals.length; i++){
			var x = json.goals[i].x*tileSize+tileSize*0.5;
			var y = json.goals[i].y*tileSize+tileSize*0.5;
			var col = color(json.goals[i].color);
			this.goals.push(new Goal(x, y, col));
		}
	}

	createGrid(json){
		tileSize = min(width/this.w, height/this.h);
		this.width = this.w*tileSize;
		this.height = this.h*tileSize;
		this.grid = new Array(this.w);
		for(var i = 0; i < this.w; i++) {
			this.grid[i] = new Array(this.h);
			for(var j = 0; j < this.h; j++) {
				this.grid[i][j] = json[j][i];//(Math.random() < 0.2)? 0 : 1;
			}
		}
	}

	randLevel() {
		tileSize = min(width/this.w, height/this.h);
		this.width = this.w*tileSize;
		this.height = this.h*tileSize;
		this.grid = new Array(this.w);
		for(var i = 0; i < this.w; i++) {
			this.grid[i] = new Array(this.h);
			for(var j = 0; j < this.h; j++) {
				this.grid[i][j] = (Math.random() < 0.2)? 1 : 0;
			}
		}
		this.balls = [];
		for(var i = 0; i < 50; i++){
			var x = parseInt(random(this.grid.length))*tileSize+tileSize*0.5;
			var y = parseInt(random(this.grid[0].length))*tileSize+tileSize*0.5;
			this.balls.push(new Ball(x, y, color(random(255), random(255), random(255))));
		}
	}

	clearRepeats() {
		for(var i = 0; i < this.balls.length; i++) {
			if(this.balls[i].parent != null) continue;
			for(var j = i+1; j < this.balls.length; j++) {
				if(this.balls[j].parent != null) continue;
				if(Math.abs(this.balls[i].nx-this.balls[j].nx) < 0.3 && Math.abs(this.balls[i].ny-this.balls[j].ny) < 0.3) {
					var nc = lerpColor(this.balls[i].col, this.balls[j].col, 0.5);
					nc = color(red(nc), green(nc), blue(nc), 255);
					this.balls[i].col = this.balls[j].col = nc;
					if(dist(this.balls[i].nx, this.balls[i].ny, this.balls[i].x, this.balls[i].y) < dist(this.balls[j].nx, this.balls[j].ny, this.balls[j].x, this.balls[j].y)) {
						this.balls[j].setParent(this.balls[i]);
					} else {
						this.balls[i].setParent(this.balls[j]);
					}
				}
			}	
		}	
	}

	move(x, y){
		if(this.block) return;

		var moving = false;
		for(var i = 0; i < this.balls.length; i++) {
			if(this.balls[i].move(x*tileSize, y*tileSize)) moving = true;
		} 

		if(moving){
			this.movements++;
			this.clearRepeats()
			this.checkWin();
		}
	}

	checkWin(){
		var count = 0;
		for(var i = 0; i < this.goals.length; i++) {
			this.goals[i].check(this.balls);
			if(this.goals[i].complet) count++;
		} 

		if(this.balls.length < this.goals.length) this.lose();
		if(this.balls.length != this.goals.length) return;

		if(count == this.goals.length) {
			this.block = true;
			this.win = true;

			setTimeout(function(){
				levelNum++;
				levelNum = levelNum%Levels.length;
				level.loadLevel(Levels[levelNum]);
				title.newTitle(level.name);
			}, 500);
		}
	}
}

class Ball {
	constructor(x, y, col){
		this.x = x; 
		this.y = y;
		this.col = col;
		this.nx = x;
		this.ny = y;
		this.s = tileSize*0.65;
		this.remove = false;
		this.parent = null;
	}

	update() {
		if(this.parent === null) {
			this.x += (this.nx-this.x)*0.2;
			this.y += (this.ny-this.y)*0.2;
		} else {
			var dx = this.parent.x-this.x;
			var dy = this.parent.y-this.y;
			this.x += (dx)*0.35;
			this.y += (dy)*0.35;
			if(Math.abs(dx+dy) < 1) this.remove = true;
		}
	}

	show() {
		noStroke();
		fill(this.col);
		ellipse(this.x, this.y, this.s, this.s);
	}

	move(x, y){
		if(this.parent != null) return false;
		var nx = this.nx+x;
		var ny = this.ny+y;
		if(nx <= 0 || nx >= level.width || ny <= 0 || ny > level.height) return;
		nx = parseInt(nx/tileSize);
		ny = parseInt(ny/tileSize);
		if(level.grid[nx][ny] == 0) {
			this.nx += x;
			this.ny += y;
			return true;
		}
		return false;
	}

	setParent(parent){
		this.parent = parent;
	}
}

class Goal {
	constructor(x, y, col){
		this.x = x; 
		this.y = y; 
		this.s = tileSize*0.8;
		this.col = col;
		this.complet = false;
	}

	update() {

	}

	show() {
		strokeWeight(this.s*0.02);
		stroke(this.col);
		noFill();
		fill(red(this.col), green(this.col), blue(this.col), (this.complet)? 80 : 10);
		ellipse(this.x, this.y, this.s, this.s);
	}

	check(balls) {
		this.complet = false;
		for(var i = 0; i < balls.length; i++){
			var dx = Math.abs(balls[i].nx-this.x);
			var dy = Math.abs(balls[i].ny-this.y);
			if(dx+dy < 2){
				var cd = Math.abs(red(this.col)-red(balls[i].col))+Math.abs(green(this.col)-green(balls[i].col))+Math.abs(blue(this.col)-blue(balls[i].col));
				if(Math.abs(cd) < 2){
					this.complet = true;
				}
			}
		}
	}
}

class Title{
	constructor(title, timeView){
		this.title = title;
		this.timeView = timeView;
		this.calls = 0;
		this.show2();
	}

	show() {
		if(!this.view) return;
		var ss = (width*0.5)/9
		textAlign(CENTER, CENTER);
		textStyle(NORMAL);
		textSize(ss);
		//fill(0);
		//text(this.title, width/2, height/2+ss*0.05);
		fill(255);
		text(this.title, width/2, height/2);
	}

	show2(){
		this.view = true;
		this.calls++;
		setTimeout(function(title){
			title.hide();
		}, this.timeView, this);
	}

	hide() {
		this.calls--;
		if(this.calls <= 0){
			this.calls = 0;
			this.view = false;
		}
	}

	newTitle(title){
		this.title = title;
		this.show2();
	}
}

function randomLevel() {
	var nl = new Object();
	var n = "RND"
	nl.name = n;
	var w = parseInt(2+Math.random()*6);
	var h = parseInt(2+Math.random()*6);
	nl.width = w;
	nl.height = h;
	///////////////
	var g = new Array(h);
	for (var i = 0; i < h; i++) {
  		g[i] = new Array(w);
		for (var j = 0; j < w; j++) {
			g[i][j] = 0;
		}
	}
	///////////////
	var b = parseInt(Math.random()*(w*h)*0.9);
	for(var i = 0; i < b; i++) {
		var x = parseInt(Math.random()*w);
		var y = parseInt(Math.random()*h);
		if(g[y][x] == 1) i--;
		g[y][x] = 1;
	}
	nl.grid = g;

	var p = Math.max(2, parseInt(Math.random()*(w*h-b)*0.8*Math.random()));
	nl.balls = [];
	var c = "#FF1A55";
	for(var i = 0; i < p; i++){
		var search = true;
		var ball = new Object();
		ball.color = c;
		do{
			search = false;
			var x = parseInt(Math.random()*w);
			var y = parseInt(Math.random()*h);
			ball.x = x;
			ball.y = y;
			if(g[y][x] == 1) search = true;
			if(!search) {
				for(var j = 0; j < nl.balls.length; j++) {
					if(nl.balls[j].x == x && nl.balls[j].y == y) {
						search = true;
						break;
					}
				}
			}
		} while(search);
		nl.balls.push(ball);
	}
	nl.goals = [];
	for(var i = 0; i < p; i++){
		var search = true;
		var goal = new Object();
		goal.color = c;
		do{
			search = false;
			var x = parseInt(Math.random()*w);
			var y = parseInt(Math.random()*h);
			goal.x = x;
			goal.y = y;
			if(g[y][x] == 1) search = true;
			if(!search) {
				for(var j = 0; j < nl.goals.length; j++) {
					if(nl.goals[j].x == x && nl.goals[j].y == y) {
						search = true;
						break;
					}
				}
			}
		} while(search);
		nl.goals.push(goal);
	}
	return nl;
}


