var level;
var levelNum;
var tileSize;
var title;

function setup() {
	var w = window.innerWidth-100;
	var h = window.innerHeight-100;
	var canvas = createCanvas(w, h);
	canvas.class("center");

	levelNum = Levels.length-1;
	level = new Level(Levels[levelNum]);

	title = new Title(level.name, 1);
}

function draw() {
	push();
	level.show();
	pop();
	title.update();
	title.show();
}

function keyPressed(){ 
	var v = tileSize;
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
		level = new Level(Levels[levelNum]);
	}
}

class Level {
	constructor(json) {
		this.loadLevel(json);
	}

	show() {
		background("#5B5EEA");
		translate((width-this.width)/2, (height-this.height)/2);
		noStroke();
		fill("#393c95");
		rect(0, 0, this.width, this.height);

		stroke("#5B5EEA");
		fill("#5B5EEA");
		for(var i = 0; i < this.grid.length; i++) {
			for(var j = 0; j < this.grid[0].length; j++) {
				if(this.grid[i][j] == 1) {
					rect(i*tileSize, j*tileSize, tileSize, tileSize);
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
			}
		} 


	}

	loadLevel(json) {
		this.name = json.name;
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

		for(var i = 0; i < this.balls.length; i++) {
			this.balls[i].move(x, y);
		} 
		this.clearRepeats()

		this.checkWin();
	}

	checkWin(){
		var count = 0;
		for(var i = 0; i < this.goals.length; i++) {
			this.goals[i].check(this.balls);
			if(this.goals[i].complet) count++;
		} 

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
		textFont('Quicksand');
	}

	update() {
		if(this.parent === null) {
			this.x += (this.nx-this.x)*0.2;
			this.y += (this.ny-this.y)*0.2;
		} else {
			var dx = this.parent.x-this.x;
			var dy = this.parent.y-this.y;
			this.x += (dx)*0.3;
			this.y += (dy)*0.3;
			if(Math.abs(dx+dy) < 1) this.remove = true;
		}
	}

	show() {
		noStroke();
		fill(this.col);
		ellipse(this.x, this.y, this.s, this.s);
	}

	move(x, y){
		if(this.parent != null) return;
		var nx = this.nx+x;
		var ny = this.ny+y;
		if(nx <= 0 || nx >= level.width || ny <= 0 || ny > level.height) return;
		nx = parseInt(nx/tileSize);
		ny = parseInt(ny/tileSize);
		if(level.grid[nx][ny] == 0) {
			this.nx += x;
			this.ny += y;
		}
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
				var cd = red(this.col)-red(balls[i].col)+green(this.col)-green(balls[i].col)+blue(this.col)-blue(balls[i].col);
				if(Math.abs(cd) < 5){
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
		this.time = timeView; 
		this.view = true;
	}

	update() {
		this.time -= 1/60.;
		if(this.time < 0){
			this.view = false;
		}
	}

	show() {
		if(!this.view) return;
		textSize((width*0.5)/10);
		textAlign(CENTER, CENTER);
		textStyle(NORMAL);
		fill(0);
		text(this.title, width/2, height/2+4);
		fill(255);
		text(this.title, width/2, height/2);
	}

	newTitle(title){
		this.title = title;
		this.reset();
	}

	reset() {
		this.time = this.timeView;
		this.view = true;
	}
}