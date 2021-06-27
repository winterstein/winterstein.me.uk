
import { BLACK, BLUE, BROWN, GRAY, GREEN, SADDLEBROWN, SKYBLUE, WHITE, YELLOW } from './colors';
import {line, rotate, scale, setColor, getState, reset, moveTo, graphics, setLineWidth, setRotate, lineTo, beginFill, endFill, goUnderWater} from './lsystembase';



// A tree
function plant(depth=8) {
	let start = getState();
	if ( ! depth) return;
	depth--;
	
	if (depth < 1) {
		// green
		setColor(GREEN);
	} else {
		// brown
		setColor(SADDLEBROWN);
	}

	// draw a line
	line(100);
	
	// split and draw a smaller plant
	scale(0.75);
	rotate(-15);	
	plant(depth);

	// .. and a 2nd
	rotate(50);		
	plant(depth);

	// reset the position to be where we started
	reset(start);
};



function bush(depth=6) {
	let start = getState();
	if ( ! depth) return;
	depth--;
	if (depth>6) depth = 6;
	
	// green
	setColor(GREEN);
	setLineWidth(depth);
	// draw a line
	let end = line(60);
	
	// split and draw a smaller plant
	scale(0.85);
	let a = 20;
	rotate(-a);	
	bush(depth);

	rotate(a);		
	bush(depth);

	rotate(a);
	bush(depth);

	// reset the position to be where we started
	reset(start);
};

function fish() {
	setColor(BLUE);
	let cx = getState().x;
	let cy = getState().y;
	graphics.drawEllipse(cx,cy,75,25);
	
	let tailStart = [cx+75,cy];
	moveTo(tailStart);
	setRotate(45);
	line(Math.sqrt(2*25*25));
	rotate(90+45);
	line(50);
	rotate(90+45);
	lineTo(tailStart);
	// x,y, r, start,end, 
	// graphics.arc(200,100,25, Math.PI/2, - Math.PI/2, false);
}

function drawScene(d) {
	graphics.clear();

	// blue background
	beginFill(SKYBLUE);
	graphics.drawRect(0,0,800,600);
	endFill();

	// grey bottom
	beginFill(GRAY);
	graphics.drawRect(0,500,800,600);
	endFill();

	// draw some lines?
	setColor(BLUE);
	setRotate(180);
	moveTo([100,200]);
	line(100);
	rotate(90);
	line(50);
	rotate(90);
	line(25);

	// // a fish!
	// moveTo([400 - 20*d,100]);
	// fish();

	// // tree
	// setRotate(180);	
	// moveTo([300,500]);
	// plant(d);	

	// // bush
	// moveTo([600,500]);
	// bush(d);
}




let animated = true;
if (animated) {
	// goUnderWater();

	let d = 0;	
	// grow over time
	setInterval(function() {
		if (d<8) d++;
		else return;
		drawScene(d);
	}, 250);

	if (false) { // no ripples
		function rippleAngle() {		
			let dt = getDT();
			let wibble = 5 * Math.sin(dt/1000);
			let dAngle = wibble;
			reset({dAngle});
			drawScene(d);
			requestAnimationFrame(rippleAngle);
		};
		requestAnimationFrame(rippleAngle);
	}

} else {
	let d = 8;
	drawScene(d);
}

