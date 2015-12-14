
if (!BarX) BarX = 50;
if (!BarY) BarY = 50;
if (!BarWidth) BarWidth = 300;

document.write('<div id="IDloadingBar" style="position:absolute; border-width:0; background-color: red; ');
document.write(' top:'+(BarY+2)+'px; left:'+(BarX+2)+'px; height:40px; width:0px; " >');
document.write('  </div>');

document.write('<div  id="IDloadingBar2" style="position: absolute; ');
document.write('top: '+BarY+'px; left: '+BarX+'px; ');
document.write('height:40px; width:'+BarWidth+'px; border-width: 2; border-style: solid;');
document.write('text-align:center;" >  LOADING... </div>');
    

// Create a counter
loadedCounter = 0; // strange bug, can't get to the botom of it
loadedTarget = 0;
bLoadingAllDone = false;
// Get hold of the loading bar element
loadingBar = document.getElementById("IDloadingBar");
// Get hold of the loading display element
loadingDisplay = document.getElementById("IDloadingDisplay");


// We define a function - and store it in a variable!
updateLoadingBarFn = function updateLoadingBar() {
    // Increase the counter
    loadedCounter += 1; 
    // Set the value property of the loadingDisplay element:
    if (loadingDisplay) loadingDisplay.value = (100*loadedCounter / document.images.length) +"%"; 
    // Increase the width of the loadingBar element:
    //   - we can get the style of the element via loadingBar.style
    //   - so we can get the width via loadingBar.style.width
    //   - this is a property, which we can just set to be what we want
    if (loadingBar) loadingBar.style.width = BarWidth*loadedCounter / document.images.length;    
    // Are we done yet?
    if (loadedCounter == loadedTarget) {      
        bLoadingAllDone = true;   
        if (loadingBar) {
            loadingBar.style.visibility = "hidden";
            document.getElementById("IDloadingBar2").style.visibility = "hidden";
        }
        if (startGame) startGame();
    }
}

// Set up the onLoad event handlers for *all* images in the document
// This is a nice flexible alternative to sticking onLoad='' in each image tag
for (i=0; i<document.images.length; i++)
{
  myImg = document.images[i];
  myImg.onload = updateLoadingBarFn;
  loadedTarget++;
}
function loadingFailed() {
    if (bLoadingAllDone) return;
    if (loadingBar) {
        loadingBar.style.visibility = "hidden";
        document.getElementById("IDloadingBar2").style.visibility = "hidden";
    }
    if (startGameAnyway) startGameAnyway();
}
// Abort if it takes too long
setTimeout("loadingFailed();",5000);
