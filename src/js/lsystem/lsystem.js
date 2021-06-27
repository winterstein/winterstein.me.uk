
import { random } from 'lodash';
import seedrandom from 'seedrandom';
import { assert } from '../base/utils/assert';
import { BLACK, BLUE, BROWN, GRAY, GREEN, PURPLE, SADDLEBROWN, SKYBLUE, WHITE, YELLOW } from './colors';
import {line, rotate, scale, setColor, getState, reset, moveTo, graphics, setLineWidth, setRotate, lineTo, beginFill, endFill, goUnderWater, getDT, stickyRandom, setRandomSeed, runLSystem} from './lsystembase';



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
		setColor(YELLOW);
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


// A tree
function kelp(depth=8) {
	let start = getState();
	if (depth < 1) return;
	depth--;
	
	setColor(GREEN);
	
	// draw a line
	line(70);
	
	// .. and a 2nd
	kelp(depth);

	// split and draw a smaller plant
	if (stickyRandom() > 0.5) {
		scale(0.75);
		let isLeft = stickyRandom() > 0.5;
		rotate(isLeft? -15 : 15);	
		kelp(depth);
	}

	// reset the position to be where we started
	reset(start);
};


function bush(depth=6) {
	let start = getState();
	if ( ! depth) return;
	depth--;
	if (depth>6) depth = 6;
	
	// green
	setColor(BLUE);
	setLineWidth(depth);
	// draw a line
	let end = line(60);
	
	// split and draw a smaller plant
	scale(0.85);
	let a = 30;
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

	graphics.drawCircle(cx-30,cy-10,5);
}

const fixSeed = "r"+Math.random();

function drawScene(d) {
	setRandomSeed(fixSeed);
	graphics.clear();

	// blue background
	// beginFill(SKYBLUE);
	wibblyRect(0,0,800,500, 0.5,0.5,0.5,0.5, SKYBLUE);
	// graphics.drawRect(0,0,800,600);
	// endFill();

	// odd floating square
	beginFill(PURPLE);
	graphics.drawRect(10,10,80,80);
	endFill();

	// grey bottom
	wibblyRect(0,500,800,600);

	// draw some lines?
	setColor(BLUE);
	setRotate(180);
	moveTo([100,200]);
	line(100);
	rotate(90);
	line(50);
	rotate(90);
	line(25);

	// a fish!
	moveTo([400 - 20*d,100]);
	fish();

	// a fish!
	moveTo([600 - 20*d,123]);
	fish();

	// tree
	setRotate(180);	
	moveTo([300,500]);
	plant(d);	

	// bush
	moveTo([600,500]);
	bush(d);

	// bush
	moveTo([400,520]);
	kelp(d);
}


function wibblyRect(x,y,x2,y2,tl01=0.5,bl01=0.5,tr01=0.5,br01=0.5, baseCol) {
	assert(x<x2 && y<y2);
	// perturb corner colours??
	tl01 = Math.min(Math.max(tl01 + 0.1*(stickyRandom()-0.5),0),1);	
	bl01 = Math.min(Math.max(bl01 + 0.1*(stickyRandom()-0.5),0),1);
	tr01 = Math.min(Math.max(tr01 + 0.1*(stickyRandom()-0.5),0),1);
	br01 = Math.min(Math.max(br01 + 0.1*(stickyRandom()-0.5),0),1);
	// mid point colours
	let tm01 = Math.min(Math.max((tl01 + tr01)/2 + 0.1*(stickyRandom()-0.5),0),1);	
	let bm01 = Math.min(Math.max((bl01 + br01)/2 + 0.1*(stickyRandom()-0.5),0),1);	
	let lm01 = Math.min(Math.max((tl01 + bl01)/2 + 0.1*(stickyRandom()-0.5),0),1);	
	let rm01 = Math.min(Math.max((tr01 + br01)/2 + 0.1*(stickyRandom()-0.5),0),1);	

	let c01 = (tl01+bl01+tr01+br01)/4;
	if (x2-x > 30) {
		let xmid = (x + x2)/2;
		let ymid = (y + y2)/2;
		wibblyRect(x,y,xmid,ymid, tl01, lm01, tm01, c01, baseCol); // tl
		wibblyRect(x,ymid,xmid,y2, lm01, bl01, c01, bm01, baseCol); // bl
		wibblyRect(xmid,y,x2,ymid, tm01,c01,tr01,rm01, baseCol); // tr
		wibblyRect(xmid,ymid,x2,y2, c01,bm01,rm01,br01, baseCol); // br
		return;
	}

	let col;
	if (baseCol) {
		col = {red:Math.round(baseCol.red*c01 + 128*(1-c01)),green:Math.round(baseCol.green*c01 + 128*(1-c01)),blue:Math.round(baseCol.blue*c01 + 128*(1-c01))};
	} else {
		let g = 200*c01;
		g = Math.round(g);
		col = {red:g,green:g,blue:g};	
	}
	beginFill(col);
	graphics.drawRect(x,y,x2,y2);
	endFill();
}


runLSystem(drawScene, {animated:true});
