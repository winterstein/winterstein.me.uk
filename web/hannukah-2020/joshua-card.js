

function getVar(key) {
	if (!window.location.search) return null;
	let rn = window.location.search.match(new RegExp(key + "=([^$]+)"));
	if (rn) return rn[1];
}


let myVarWibble = getVar("n") || "Friend";

let zugzugpoo = myVarWibble;

let shoobee = document.getElementById("mywords");

shoobee.innerHTML =myVarWibble;

let flyingdaddy = document.getElementById("myimg");

flyingdaddy.src = "blue-shark.png";


// Button
let clickme = document.getElementById("clickme");

clickme.onclick = function (event) {

	mywords.style.background = 'red';
	// Image
	let swimmer = document.getElementById("swimmer");

	animate(2, function ({ fraction, dt }) {
		swimmer.style.right = (70 * fraction) + "%";
	});
	
	// red fish
	let swimmer2 = document.getElementById("swimmer2");

	animate(2, function ({ fraction, dt }) {
		swimmer2.style.left = (70 * fraction) + "%";
		swimmer2.style.top = (200 + 30 * Math.sin(fraction * 15)) + "px";
		
	});
};


// Image
let myimg = document.getElementById("myimg");

// swim right (which we do by "move increasingly further away from the left of the box")
animate(5, function ({ fraction, dt }) {
	myimg.style.left = (100 * fraction) + "%";
});

