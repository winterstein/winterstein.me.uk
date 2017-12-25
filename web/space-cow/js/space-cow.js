
var playing = false;

function playMusic(on) {
	console.log("playMusic", on, playing, instance);
	if (on) {
		playing = true;
		if (instance && instance.getPosition()<1) instance.play();
		return;
	}	
	playing = false;
	if (instance) instance.stop();
}

var instance=false;
if (createjs && false) {
	try {
		//createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
		createjs.Sound.alternateExtensions = ["mp3"];
		instance = createjs.Sound.createInstance("../img/journey.mp3");
	} catch(ex) {
		// oh well
		console.warn(ex);
	}
}

$(function(){	
	var h = $(window).height();
	alert($(window).width()+"x"+h);
//	$('#LandingScreen').height(h);
	
	// hide section headers
	$('h2').replaceWith("<hr class='h2'>");
	
	var stop = 400; //$('#StoryScreen').offset().top;	
	$(window).scroll(function (event) {		
		var st = $(window).scrollTop();
		console.log(st, stop);
		if (st < stop) {playMusic(true);}
		if (st > stop) {playMusic(false);}
	});

/* 	var s = skrollr.init({
    	keyframe: function(element, name, dirn) {
    		if (name==='dataCenterCenter' && dirn==='down') {
    			doAnimateMeteor(element);
    		}
        	//name will be one of data500, dataTopBottom, data_offsetCenter
//        	console.log("keyframe", element, name, dirn);
    	}
	});*/

	playMusic(true);

});

function doAnimateMeteor(element) {
	console.log("doAnimateMeteor", element);
	var $m = $('img.Sprite', $(element).parent());
	var css = {top:100, left:0, "margin-left":-$m.width(), "margin-top":-$m.height()};
	// console.log('css', css);
	$m.css(css);
	var eid = $(element).attr('id');
	if (eid==='top') {
		//alert("TOP");
	} else if (eid==='MeteorSpecial') {
		var y0=150;
		$m.css({dummy:0, top:y0, left:0, "margin-left":-$m.width(), "margin-top":-$m.height()});
		$m.animate({dummy:400}, {
			duration:3000, 
			step:function(a,b) {
				// console.log("animate fn",a,b,this);
				if (a<100) {
					$m.css({top:y0+a, left:a*3});
					// console.log("xy", a*5, 100+a, "linear", a);
				} else if (a<200) {
					var r = (a-100)/50;
					var y = y0+a - 100 + 100*Math.cos(Math.PI *r);
					var x = 300 + 100*Math.sin(Math.PI*r);
					$m.css({top:y, left:x});
					// console.log("xy", x, y, "r", r, "dummy", a);
					$m.rotate(-r*180);
				} else {
					$m.css({top:y0+(a-100), left:(a-100)*3});
				}
			},
			easing:"linear"});
	} else if (eid==='UFO') {
		console.log("UFO");
		$m.css({top:400, left:300, "margin-left":-($m.width()/2) });
		$m.animate({top:0}, 1500);
	} else {
		console.log("eid", eid);
		$m.animate({top:350,left:1000}, 1500);
	}
}
