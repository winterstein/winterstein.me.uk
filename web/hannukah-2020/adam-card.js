
// Words
let mywords = document.getElementById("mywords");


// Button
let clickme = document.getElementById("clickme");

clickme.onclick = function () {
	// alert("Hello :)");
	// swim right (which we do by "move increasingly further away from the left of the box")
	animate(4, function ({ fraction, dt }) {
		myimg.style.left = (-129 + (500 * fraction)) + "px";
	});
};


// Image
let myimg = document.getElementById("myimg");
