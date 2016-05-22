window.onload = function() {
	var firstDiv = generateDiv();
	//firstDiv.appendChild(document.getElementById('infoContent'));
	initScroll();
}

var paleta = ["#FAFAFA", "#0A0A0A", "#30FF6A"];


function initScroll() {
	if (window.addEventListener) {
		window.addEventListener("mousewheel", scroll, false);
		window.addEventListener("DOMMouseScroll", scroll, false);
	}
	else window.attachEvent("onmousewheel", scroll);
}

var activeScroll = true;
var scrollPos = 0;
var amountScroll = 0;

function scroll(e) {
	var e = window.event || e;
	e.preventDefault();
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	//delta = (e.wheelDelta || -e.detail);
	//amountScroll += delta;
	//if(Math.abs(amountScroll) >= 1){
	delta = (e.detail<0 || e.wheelDelta>0) ? 1 : -1;
	changeDiv((delta > 0)? 1 : -1);
	//}
};

function next() {
	changeDiv(1);
}

function prev() {
	changeDiv(-1);
}

function changeDiv(delta){
	if(activeScroll) {
		activeScroll = false;
		amountScroll = 0;

		scrollPos = parseInt(window.pageYOffset/window.innerHeight);
		scrollPos -= delta;
		if(scrollPos <= 0){
			scrollPos = 0;
			document.getElementById("arrowUp").classList.add("hidden");
		} else {
			document.getElementById("arrowUp").classList.remove("hidden");
		}
		var sections = document.getElementById("sections");
		var divs = sections.getElementsByClassName('section');
		if(divs.length <= scrollPos) {
			generateDiv();
			divs = sections.getElementsByClassName('section');
		}

		//divs[scrollPos].scrollIntoView(true);
		move(scrollPos*window.innerHeight);
		function move(newPos){
			var actPos = window.pageYOffset;
			var des = Math.min(100, (newPos-actPos)*0.5);
			des = (des < 0)? -Math.max(1, Math.ceil(Math.abs(des))) : Math.max(1, Math.ceil(des));
			window.scrollTo(0, actPos+des);
			if(Math.abs(newPos-actPos) > 2){
				setTimeout(function(){ move(newPos)}, 40);
			}else {
				setTimeout(function(){ activeScroll = true;}, 50);
				divs[scrollPos].scrollIntoView(true);
			}
		}
	}
}

function generateDiv() {

	var width = window.innerWidth;
	var height = window.innerWidth;

	
	var div = document.createElement('div');
	div.className = "section";
	var pal = randPalete();
	div.style.backgroundColor = pal[1+parseInt((pal.length-1)*Math.random())];
	
	/*
	var svg = document.createElement('svg');
	svg.setAttribute("height", "100%");
	svg.setAttribute("width", "100%");
	*/

	var divPallet = document.createElement('div');
	divPallet.className = "pallet";
	for(var i = 0; i < pal.length; i++) {
		var quad = document.createElement('div');
		quad.style.width = "10px";
		quad.style.height = "10px";
		quad.style.float = "left";
		quad.style.backgroundColor = pal[i];
		divPallet.appendChild(quad);
	}
	div.appendChild(divPallet);
	/*
	svg.setAttribute("width", parseInt(width));
	svg.setAttribute("height", parseInt(height));
	*/

	//var svg = document.getElementsByTagName('svg')[0];
	/*
    div.appendChild(svg);
	for(var i = 0; i < 100; i++){
		var circle = document.createElement('circle');
		circle.setAttribute("cx", i);//parseInt(Math.random()*width));
		circle.setAttribute("cy", i);//parseInt(Math.random()*height));
		circle.setAttribute("r", 25);
		circle.setAttribute("fill", "red");
		svg.appendChild(circle);
	}
	*/



	var width = window.innerWidth;
	var height = window.innerHeight;
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("width", "100%");
	svg.setAttribute("height", "100%");

	var c = parseInt(18+Math.random()*80*Math.random()+30*Math.random());
	var maxSize = (width+height)/6;
	var elems = [];
	for(var i = 0; i < c; i++) {
		var ele;
		var col = pal[parseInt(pal.length*Math.random())];
		var xx = parseInt(Math.random()*width);
		var yy = parseInt(Math.random()*height);
		var rr = parseInt(maxSize*Math.random()*Math.random()*(Math.random()*0.5+0.5));
		var rnd = parseInt(Math.random()*4.7);
		if(rnd == 0) {
			ele = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			ele.setAttribute("fill", col);
			ele.setAttribute("cx", xx+"px");
			ele.setAttribute("cy", yy+"px");
			ele.setAttribute("r", rr+"px");
			elems.push(ele);
		}
		else if(rnd == 1) {
			var amp = 0.2+Math.random()*0.3;
			ele = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			ele.setAttribute("fill", col);
			ele.setAttribute("cx", xx+"px");
			ele.setAttribute("cy", yy+"px");
			ele.setAttribute("r", rr*amp+"px");

			bor = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			bor.setAttribute("stroke", col);
			bor.setAttribute("stroke-width", Math.max(1, rr*0.01));
			bor.setAttribute("fill", "none");
			bor.setAttribute("cx", xx+"px");
			bor.setAttribute("cy", yy+"px");
			bor.setAttribute("r", rr+"px");
			elems.push(bor);
			elems.push(ele);
		}
		else if(rnd == 2) {
			var rr = rr*0.5;
			var cc = parseInt(3+Math.random()*7);
			var points = "";
			var da = (Math.PI*2)/cc;
			var aa = Math.PI*1.5;
			for(var j = 0; j < cc; j++) {
				if(j != 0) points += ",";
				var angle = da*j+aa;
				points += (xx+Math.cos(angle)*rr) + "," + (yy+Math.sin(angle)*rr);
			}
			ele = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			ele.setAttribute("fill", col);
			ele.setAttribute("points", points);
			elems.push(ele);
		}
		else if(rnd == 3) {
			var rr = rr*0.5;
			var cc = 4;
			var points = "";
			var da = (Math.PI*2)/cc;
			var aa = Math.PI*1.25;
			var bb = Math.random()*0.3+0.2;
			var l = rr*bb*rr*bb;
			var diag = Math.sqrt(l+l)*0.5;
			for(var j = 0; j < cc; j++) {
				if(j != 0) points += ",";
				var angle = da*j+aa;
				var dx = Math.cos(angle+Math.PI*0.5)*diag;
				var dy = Math.sin(angle+Math.PI*0.5)*diag;
				points += (xx+Math.cos(angle)*rr-dx) + "," + (yy+Math.sin(angle)*rr-dy) + ",";
				points += (xx+Math.cos(angle)*rr+dx) + "," + (yy+Math.sin(angle)*rr+dy) + ",";
				angle += Math.PI*0.25;
				points += (xx+Math.cos(angle)*rr*bb) + "," + (yy+Math.sin(angle)*rr*bb);
			}
			ele = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			ele.setAttribute("fill", col);
			ele.setAttribute("points", points);
			elems.push(ele);
		}else if(rnd == 4){
			var w = rr*2;
			var h = w*(0.1+Math.random()*0.2*Math.random());
			var cc = parseInt(8+Math.random()*20);
			var dx = w/cc;
			var ww = (w/cc)*(0.3+Math.random()*0.6);
			for(var j = 0; j < cc; j++) {
				var ele = document.createElementNS("http://www.w3.org/2000/svg", "rect");
				ele.setAttribute("fill", col);
				ele.setAttribute("x", xx-w/2+dx*j+"px");
				ele.setAttribute("y", yy-h/2+"px");
				ele.setAttribute("width", ww+"px");
				ele.setAttribute("height", h+"px");
				elems.push(ele);
			}
		}
	}

	var ele;
	for(var i = 0; i < elems.length; i++) {
		ele = elems[i];
		/*
		ele.setAttribute("transform", "translate(0, "+height+")");
		ele.setAttribute("transition", "transform 10s");
		ele.style.transform = "translate(0, 0)";
		*/
		svg.appendChild(ele);
	}

	div.appendChild(svg);

	
	sections.appendChild(div);

	return div;
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function randPalete() {
	var aux = [];
	aux.push("#ffffff");

	var cc = parseInt(2+Math.random()*3);
	var des = (1./cc);
	var ini = Math.random();
	var h, s, v, col;
	for(var i = 0; i < cc; i++){
		h = ((i*des)+ini)%1;
		s = 0.74+Math.random()*0.21;
		col = HSVtoRGB(h, s, 1);
		aux.push("rgba("+col.r+", "+col.g+", "+col.b+", 1)");
	}
	return aux;
}