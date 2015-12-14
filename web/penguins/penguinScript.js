

function setMousePosn(e)
{
	var posx = 0;
	var posy = 0;
	if (!e) var e = window.event;
	if (e.pageX || e.pageY)
	{
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY)
	{
		posx = e.clientX + document.body.scrollLeft;
		posy = e.clientY + document.body.scrollTop;
	}
	// posx and posy contain the mouse position relative to the document
	nMouseX = posx; nMouseY = posy;
	//document.status = "x:"+nMouseX+" y:"+nMouseY;
}


// Convert a position number from a style sheet (e.g. left="12px")
// into a normal integer
function parsePosn(stylePosn) {
    if (!stylePosn) return 0;
	return parseInt(stylePosn.match(/[0-9]+/));
}


// Get the x y position of an image or other html object
function getXY(obj) {
	if (!obj.style) return false;
	var x = obj.style.left;
	var y = obj.style.top;
	x = parsePosn(x);
	y = parsePosn(y);
	return [x,y];
}

function setXY(obj, x, y) {
	if (!obj.style) return;
	obj.style.left = x;
	obj.style.top = y;
}

// Do these two images overlap?
function overlap(imgA, imgB) {
    var axy = getXY(imgA);
    var bxy = getXY(imgB);
    if (axy[0]+imgA.width > bxy[0] && axy[1]+imgA.height > bxy[1] && axy[0]<bxy[0]+imgB.width && axy[1] < bxy[1]+imgB.height ) return true;
    return false;
}


function getURLVariable(sName) {
    var url = document.location +"";
    var nS = url.indexOf(sName+"=");
    if (!nS) return false;
    nS += sName.length +1;
    url = url.substr(nS);
    var nE = url.indexOf("&");
    if (!nE) nE = url.length;
    sVar = url.substr(0,nE);
    sVar = unescape(sVar);
    return sVar;   
}

function setURLVariable(sName, sValue) {
    var url = document.location +"";
    var nQ = url.indexOf("?");
    var varLine = "?"; 
    var baseUrl = url;
    if (nQ != -1) {
        varLine = url.substr(nQ);
        baseUrl = url.substr(0, nQ);        
    }
    varLine = varLine + sName + "=" + escape(sValue)+"&";
    document.location = baseUrl+varLine;
}

function getSetURLVariable(sName) {   
    var sVar = getURLVariable(sName);
    if (sVar) return sVar;   
    sVar = prompt("Please enter a value for "+sName);
    setURLVariable(sName, sVar);
    return sVar;
}


function playSound(sName) {    
    soundManager.play(sName);
}


function displayMsg(sMsg) {
    msg = document.getElementById("IDdisplayMsg");
    msg.value = sMsg;
    msg.style.visibility = "visible";
    fadecolindex = -1;
    fadeOutMsg();
}
var fadecols = [0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F"];
var fadecolindex;
var fadeinterval = 150;
function fadeOutMsg() {
    fadeobj = document.getElementById("IDdisplayMsg");
	if (fadecolindex == fadecols.length - 1) {
		fadeobj.style.visibility = "hidden";
		if (myMessageQueue) {
            nMessageQueueIndex++;
            if (nMessageQueueIndex == myMessageQueue.length) {
                myMessageQueue = false;
            } else displayMsg(myMessageQueue[nMessageQueueIndex]);
        }
		return;
	}
	fadecolindex ++;
	var col = fadecols[fadecolindex];
	fadeobj.style.color = "#"+col+col+col+col+col+col;
	fadeobj.style.borderColor = "#"+col+col+col+col+col+col;
	setTimeout("fadeOutMsg()", fadeinterval);
}
var myMessageQueue;
function displayMsgs(aMsgs) {
    myMessageQueue = aMsgs;
    nMessageQueueIndex = 0;
    displayMsg(myMessageQueue[0]);
}


function setTemp(nNewTemp) {
    if (dTemp == -1) {
        if (nNewTemp == -60) {
            displayMsg("Getting Colder...");
        } else if (nNewTemp == -70) {
            displayMsg("Getting Colder...");
        } else if (nNewTemp == -81) {
            displayMsg("MID WINTER!");
            dTemp = 1; // get warmer from now on.
        }
    } else if (nNewTemp == -60 && bAlive && !bAllDead) {
        displayMsg("CONGRATULATIONS!");
        setTimeout("document.location = 'congratulations.html?Name="+escape(sName)+"&'", 2000);
    }
    nTemp = nNewTemp;
    document.getElementById("IDtempDisplay").value=nTemp;
    setTimeout("setTemp(nTemp + dTemp);", nTEMP_INTERVAL);
}




function startGame() {
    bAllDead = true; // for calling iceChick
    for(i=1; i<4; i++) {
        nIceLevel = 0;
        nIcingChick = i;
        iceChick();
    }
    nIceLevel = 0;
    nFoodLevel = 100;
    nIcingChick = 1; 
    bAllDead = false; bAlive = true;
    bUnderwater = false; bCanJump = true;
    var y = nLAND_HEIGHT - 174;
    setXY(imgPenguin, 100, y);
    dTemp = -1;
    setTemp(-50);
    alert("Ready?");
    displayMsg("GO!");
    setTimeout("setTemp(nTemp-dTemp);", nTEMP_INTERVAL); 
    setTimeout("movePenguin();", nMOVE_INTERVAL);
    setTimeout("iceChick();", nICE_INTERVAL);
    setTimeout("moveFish();", nMOVE_INTERVAL);
    setTimeout("starve();", nSTARVE_INTERVAL);
}
