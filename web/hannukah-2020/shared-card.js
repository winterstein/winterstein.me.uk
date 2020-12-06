

function animate(seconds, updateFn) {
	const start = new Date().getTime();
	const end = start + 1000*seconds;
	animate2(start, end, updateFn);
}

function animate2(start, end, updateFn) {
	let dt = (new Date().getTime() - start)/1000;
	let fraction = dt*1000/(end - start);
	// done?
	if (fraction >= 1) {
		fraction = 1;
		dt = (end - start)/1000;
		// one last update
		updateFn({fraction, dt});
		return;
	}
	// update
	updateFn({fraction, dt});
	// request another update
	setTimeout(() => {
		animate2(start, end, updateFn)
	}, 25);
}
