var currentlyDisplayed;
var $nav;
var $currentlyDisplayed;
var $triforce;
var $coloring;
var $poetry;
var $longboarding;
var $mind;
var $loseit;
var $twice;
var $webdev

function init(){
	$nav = $("nav");
	//jquery dom elements for fade-ins etc
	$triforce = $("#triforce");
	$mind = $("#mind");
	$loseit = $("#lose-it");
	$twice = $("#twice");
	$coloring = $("#coloring");
	$poetry = $("#poetry")
	$longboarding = $("#longboarding")
	$webdev = $('#webdev')
	//console.log("init is being called")
	//likes.onmouseover = function() {
  		//document.getElementById('popup').style.display = 'block';
  		
	//}
	
	document.addEventListener("mouseover", mouseOverListener);
	//document.addEventListener("mouseout", clear);
}

function mouseOverListener(e) {
	//console.log(e.target.id)
	var current = e.target.id;
	switch(current) {
		case('likes-web-dev'):
			//positionBox(e);
			fadeColor("pink")
			displayThumbnail($webdev)
			break;
		case('likes-electronic-music'):
			fadeColor("red")
			displayThumbnail($mind);
			break;
		case('likes-dancing'):
			fadeColor("orange")
			displayThumbnail($loseit);
			break;
		case('likes-coloring'):
			fadeColor("yellow")
			displayThumbnail($coloring)
			break;
		case('likes-producing-music'):
			displayThumbnail($twice);
			fadeColor("green")
			break;
		case('likes-video-games'):
			fadeColor("blue")
			displayThumbnail($triforce);	
			break;
		case('likes-poetry'):
			fadeColor("purple")
			displayThumbnail($poetry)
			break;
		case('likes-longboarding'):
			fadeColor("magenta")
			displayThumbnail($longboarding)
			break;
	}
}

function displayThumbnail(thumbnail) {
	if(currentlyDisplayed !== undefined && currentlyDisplayed.style.display === 'block' ) {//check if there is a thumbnail already being displayed
		if(currentlyDisplayed.id !== thumbnail.attr('id')) {//check that the thumbnail isnt the same one that the user moused over
			currentlyDisplayed.style.display = 'none';//hide it!
			$currentlyDisplayed.stop(true, true);//stop the animation as well
			console.log("what?!")
		}
	}
	thumbnail.fadeIn(700);
	currentlyDisplayed = document.getElementById(thumbnail.attr('id'));
	currentlyDisplayed.style.display = 'block'
	$currentlyDisplayed = $(document.getElementById(thumbnail.attr('id')));
}

function positionBox(e) {
	//clickCoords = getPosition(e);

    //document.getElementById("triforce").style.width = "150px";

    //clickCoordsX =  e.clientX;
    //clickCoordsY =  e.clientY
    clickCoordsX = e.clientX;
    clickCoordsY = e.clientY + document.getElementById("triforce").style.height;


    console.log("X: " + e.clientX)
    console.log("Y: " + e.clientY)
 	
    triforce.style.left = clickCoordsX + "px";
    triforce.style.bottom = clickCoordsY + "px";

    boxWidth = triforce.offsetWidth;
    boxHeight = triforce.offsetHeight;
 
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
 
    /*if ( (windowWidth - clickCoordsX) < boxWidth ) {
        pictureBox.style.left = windowWidth - boxWidth + "px";
    } else {
        pictureBox.style.left = clickCoordsX + "px";
    }
 
    if ( (windowHeight - clickCoordsY) < boxHeight ) {
        pictureBox.style.bottom = windowHeight - boxHeight + "px";
    } else {
        pictureBox.style.bottom = clickCoordsY + "px";
    }*/
}

function fadeColor(string) {
	 $nav.animate({
          backgroundColor: string
        }, 1000 );
	 console.log("pls")
}

/*
likes.onmouseout = function() {
  //document.getElementById('popup').style.display = 'none';
  document.style.backgroundColor = "#1D413E";
}*/
