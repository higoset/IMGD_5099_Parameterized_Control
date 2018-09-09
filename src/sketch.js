let count;
let streamWidth;
let startColor;
let endColor;
let center = {x: 0, y: 0};
let radius;
let stopFrame;
let sunSize;
let sunColor;
let planetChance;
let planetSmall;
let planetBig
let planetClose;
let planetFar;
let starSmall;
let starBig
let distanceThreshold;

let particles = []; 
let colors = [{r: 255, g: 0, b: 0}, {r: 255, g: 255, b: 0}, {r: 255, g: 0, b: 255}, {r: 255, g: 255, b: 255}, {r: 0, g: 255, b: 0}, {r: 0, g: 255, b: 255}, {r: 0, g: 0, b: 255}, {r: 128, g: 128, b: 128}];
let currentCount = 0;
let currentFrame = 0

function setup(){
	var cnv = createCanvas(1000, windowHeight);


	//Setting Parameters.
	endColor = Math.floor(random(colors.length));
	do{
		startColor = Math.floor(random(colors.length));
	}while(endColor === startColor);

	startColor = colors[startColor];
	endColor = colors[endColor];
	center.x = random(250, 750);
	center.y = random(windowHeight/4, windowHeight*3/4);
	count = random(500, 1500);
	streamWidth = random(0, 50);
	radius = random(100, 300);
	stopFrame = random(100, 5000);

	sunSize = random(20, 50);
	sunColor = colors[Math.floor(random(colors.length))];
	planetChance = random(1, 3);
	planetSmall = random(6, 10);
	planetBig = random(10, 18)
	planetClose = colors[Math.floor(random(colors.length))];
	planetFar = colors[Math.floor(random(colors.length))];
	starSmall = random(1, 3);
	starBig = random(3, 5);
	distanceThreshold = random(200, 400);
}

function draw(){
	clear();
	background(0);

	for(var i = 0; i < particles.length; i++){
		particles[i].draw();
		particles[i].colorChange();
		if(currentFrame < stopFrame)
			particles[i].move();
	}
	if(particles.length < count && currentFrame < stopFrame){
		particles.push(new Particle());
	}

	fill(color(sunColor.r, sunColor.g, sunColor.b));
	ellipse(center.x, center.y, sunSize, sunSize);

	//console.log(particles[0].color, particles[0].targetColor);
	currentFrame++;
}

class Particle{
	constructor(){
		this.id = currentCount;
		currentCount++;

		this.isPlanet = random(100) < planetChance;
		this.size = this.isPlanet ? random(planetSmall, planetBig) : random(starSmall, starBig);

		this.r = radius + random(streamWidth / 2) - streamWidth;
		this.theta = random(360);

		this.velocity = {t: 5, r: sin(currentFrame / Math.PI)};
		this.color = JSON.parse(JSON.stringify(startColor));
		this.targetColor = JSON.parse(JSON.stringify(endColor));
	}

	draw(){
		var x = this.r * Math.cos(this.theta) + center.x;
		var y = this.r * Math.sin(this.theta) + center.y;
		var myColor = this.color;
		if(this.isPlanet){
			var distanceFromSun = Math.sqrt((x - center.x) * (x - center.x) + (y - center.y) * (y - center.y));
			var t = distanceFromSun / distanceThreshold;
			t = t > 1 ? 1 : t;

			myColor.r = planetClose.r + (planetFar.r - planetClose.r) * t;
			myColor.g = planetClose.g + (planetFar.g - planetClose.g) * t;
			myColor.b = planetClose.b + (planetFar.b - planetClose.b) * t;

		}

		fill(color(myColor.r, myColor.g, myColor.b));
		strokeWeight(this.isPlanet ? 3 : 0)
		ellipse(x, y, this.size, this.size);

		if((x > windowWidth || x < 0) && (y > windowHeight || y < 0)){
			var self = this;
			var id = particles.findIndex(function(x){
				return x.id === self.id;
			});
			particles.splice(id, 1);
		}
	}

	move(){
		this.r += this.velocity.r;
		this.theta += this.velocity.t/this.r;
	}

	colorChange(){
		if(!this.isPlanet){
			if(this.color.r < this.targetColor.r){
				this.color.r += 1;
			}
			else if(this.color.r > this.targetColor.r){
				this.color.r -= 1;
			}
			if(this.color.g < this.targetColor.g){
				this.color.g += 1;
			}
			else if(this.color.g > this.targetColor.g){
				this.color.g -= 1;
			}
			if(this.color.b < this.targetColor.b){
				this.color.b += 1;
			}
			else if(this.color.b > this.targetColor.b){
				this.color.b -= 1;
			}

			if(JSON.stringify(this.color) === JSON.stringify(this.targetColor)){
				if(this.targetColor === startColor)
					this.targetColor = endColor;
				else
					this.targetColor = startColor;
			}
		}
	}
}