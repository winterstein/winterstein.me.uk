

function getVarName() {
	if ( ! window.location.search) return null;
	let rn = window.location.search.match(/n=([^$]+)/);
	if (rn) return rn[1];	
}

let name = getVarName();
console.log(name);

// Words
let mywords = document.getElementById("mywords");

setTimeout(function() { 
    mywords.innerHTML = "Happy Chanukah";
}, 1000);


// Button
let clickme = document.getElementById("clickme");

clickme.onclick = function(event) {
	alert("Hello :)");
	mywords.style.background = 'red';
	// Image
let swimmer = document.getElementById("swimmer");

animate(5, function({fraction, dt}) {
	swimmer.style.right = (100*fraction)+"%";
});// Image
let swimmer2 = document.getElementById("swimmer2");

animate(3, function({fraction, dt}) {
	swimmer2.style.left = (100*fraction)+"%";
	swimmer2.style.top = (30*Math.sin(fraction*15))+"px";
});
};


// Image
let myimg = document.getElementById("myimg");

// swim right (which we do by "move increasingly further away from the left of the box")
animate(5, function({fraction, dt}) {
	myimg.style.left = (100*fraction)+"%";
});

