
import * as PIXI from 'pixi.js';
import { WHITE } from './colors';

window.PIXI = PIXI;

const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();
console.log("graphics", graphics);


let state = {
	x:0,y:0,
	angle:180,	
	unit:1,
	color:{},
	lineWidth: 4
};

graphics.lineStyle(5, 0x00FF00, 1);

const hex = ({red,green,blue}) => 0x10000*red + 0x100*green + blue;

const setColor = (color) => {
	let h = hex(color);
	graphics.lineStyle(state.lineWidth, h, 1);
	state.color = color;
};
const setLineWidth = (width) => {
	state.lineWidth = width;
	setColor(state.color);
};


/**
 * Draw a line
 * @param {*} param0 
 * @returns {!NUmber[]} [x,y] for the end
 */
const line = (length) => {	
	let radians = state.angle * Math.PI / 180;
	let dy = Math.cos(radians);
	let dx = Math.sin(radians);
	let x2 = state.x + dx*length*state.unit;
	let y2 = state.y + dy*length*state.unit;
	lineTo(x2,y2);
	let end = [x2,y2];	
	state.x = end[0];
	state.y = end[1];
	return end;
};
export const lineTo = (x,y) => {
	if (x.length) {
		y = x[1];
		x=x[0];
	}
	graphics.lineTo(x,y);
};

const rotate = (angle) => {
	state.angle = (state.angle + angle ) % 360;	
};
export const setRotate = (angle) => {
	state.angle = angle + (state.dAngle || 0);
};

const scale = (fraction) => {
	state.unit *= fraction;
};

const moveTo = xy => {
	graphics.moveTo(xy[0], xy[1]);
	state.x = xy[0];
	state.y = xy[1];
	// console.log("moveTo", xy, graphics.x, graphics.y);
};

const getState = () => Object.assign({}, state);

const startTime = new Date().getTime();
export const getDT = () => new Date().getTime() - startTime;

const reset = (targetState) => {
	Object.assign(state, targetState);
	// reset Pixi
	graphics.moveTo(state.x, state.y);
	setColor(state.color);
};

export const beginFill = (color) => {
	graphics.beginFill(hex(color));
};
export const endFill = () => graphics.endFill();

app.stage.addChild(graphics);

export {
	setColor, setLineWidth,
	getState, reset, 
	moveTo, line,
	scale, rotate,
	graphics, app
};


// // Filter
console.log("app", app);

export const goUnderWater = () => {
	let displacementSprite = new PIXI.Sprite.from("assets/cloud.jpg");
	let displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
	displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
	app.stage.addChild(displacementSprite);
	app.stage.filters = [displacementFilter];
	app.renderer.view.style.transform = 'scale(1.02)';
	displacementSprite.scale.x = 4;
	displacementSprite.scale.y = 4;	

	const animateRipple = () => {
		displacementSprite.x += 10;
		displacementSprite.y += 4;
		requestAnimationFrame(animateRipple);
	};

	animateRipple();
};
