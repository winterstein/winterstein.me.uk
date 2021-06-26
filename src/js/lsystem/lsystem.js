
import {line, rotate, scale, setColor, getState, reset, moveTo} from './lsystembase';

setColor({red:0,green:0,blue:255});
reset({angle:180});

moveTo([100,200]);
line({length:100});
rotate(90);
line({length:50});
rotate(90);
line({length:25});

// brown
setColor({red:100,green:100,blue:50});

// A tree
let plant = (depth=8) => {
	let start = getState();
	if ( ! depth) return;
	depth--;
	
	if (depth < 1) {
		setColor({red:0,green:255,blue:0});
	}

	// draw a line
	let end = line({length: 100});
	
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

reset({angle:180});
moveTo([300,500]);
plant();
