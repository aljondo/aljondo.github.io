/*
    constructs and global variables af
*/
//simple constructor for a light event, including the color (in hexidecimal format) and the time in seconds
function LightEvent(color, time) {
    this.color = color;
    this.time = time;
}


var button;
var musicPlayer;
var audio;
var waveform;
var songWidth;

var lightEvents;
var pastLightEvents = new Array();
var upcomingLightEvents = new Array();

var songLength;
var currentTime;

//anything having to do with a menu
var menu;
var menuState;
var activeMenu;
var menuPosition;
var menuPositionX;
var menuPositionY;
var menuWidth;
var menuHeight;
var windowWidth;
var windowHeight;
var clickCoords;
var clickCoordsX;
var clickCoordsY;
//saving the clicked on bar in the waveform. this should help indicate where light events are placed
var bar;
//saves xPosition relative to waveform when an event is created
var xPos;
//for the purposes of updating the song timer 

//for zooming
var zoomButton;
var zoomState;
//calls when song is uploaded
function init() {
    console.log("init is being called");
    button = document.getElementById('play-pause-button');
    musicPlayer = document.getElementById('music-player');
    waveform = document.getElementById('music-waveform');
    audio = document.getElementById('uploaded-song');
    songWidth = waveform.clientWidth;

    //lightEvents = new Array();
    //pastLightEvents = new Array();
    //upcomingLightEvents = new Array();

    menu = document.querySelector("#context-menu");
    menuState = 0;
    activeMenu = "context-menu--active"

    //listeners
    document.addEventListener("contextmenu", contextMenuListener);
    document.addEventListener("click", clickListener);
    keyupListener();
    resizeListener();

    zoomState = 0;
    zoomButton = document.getElementById('fa-zoom');

    songLength = audio.duration;

    hideInstructions();
    

    console.log(songLength)

    console.log(musicPlayer.style.zIndex)
    //console.log(upcomingLightEvents.length);
    //console.log(pastLightEvents.length);
}

function hideInstructions() {
    $('#instructions').fadeOut()
    document.getElementById('instructions').style.display = "none"
    unfade($('#music-timer'));
    unfade($('#play-pause-button'));
    unfade($('#zoom-button'));
}

/*
    //responding to clicks 'n stuff 
    //seeking, adding light events, etc.
*/
function contextMenuListener(e) {
    console.log(e.id + "HERE IT ISSSSSSSSSSS");
    if(clickInsideElement(e, 'waveform')) {
        bar = e.target;
        e.preventDefault();
        toggleMenuOn();
        positionMenu(e);
        //console.log("GOT EM")
    } else {
        toggleMenuOff();
        //console.log("didnt got em")
    }
    //console.log(bar);
    //console.log(bar.style)
    //bar.style.stroke = "#000"
    console.log(bar.style);
}

function clickListener(e) {
    //this doesnt listen for seeking yet
    var button = e.which || e.button;
    if ( button === 1 ) {
      toggleMenuOff();
    }
    if(clickInsideElement(e, 'waveform')) {
        xPosFromClick(e);
        seek();
    } 
    if(clickInsideElement(e, 'fa-plus-circle')) {
        console.log("pls")
        zoom();
    }
}

function seek() {
    var eventTime = (xPos / songWidth) * songLength;
    var previousTime = currentTime;
    //console.log(previousTime)
    audio.currentTime =  "" + Math.round(eventTime * 10) / 10;
    currentTime = audio.currentTime;
    resortLightEvents(previousTime);
    console.log(currentTime)
}

function resortLightEvents(previousTime) {
    //console.log("previous time is " + previousTime);
    //console.log("current time is " + currentTime);
    console.log(upcomingLightEvents[0])

    if(previousTime > currentTime) {//user jumps back in the song
        if(pastLightEvents.length > 0) {
            for(var i = pastLightEvents.length - 1; i >= 0; i--) {
                //console.log(upcomingLightEvents[i])
                if(pastLightEvents[i].time > currentTime) {
                    //console.log("event time: " + pastLightEvents[i].time + " currentTime: " + currentTime)
                    upcomingLightEvents.unshift(pastLightEvents.pop());
                }
                else {
                   break;
                }
            }
        }
    }
    else if(previousTime < currentTime) {//user jumps forward in the song
        for(var i = 0; i < upcomingLightEvents.length; i++) {
            if(upcomingLightEvents[i].time  < currentTime) {
                var temp = upcomingLightEvents.shift();
                pastLightEvents.push(temp);
                console.log("this is an instance of splice that is pushed into past light events")
                console.log(temp)
                i--;
            }
            else {
                break;
            }
        }
    }
    console.log("upcoming light events has " + upcomingLightEvents.length);
    console.log("past light events has " + pastLightEvents.length);
}

//when the waveform exists inside it's own little zoomable view...this might need some work. or it might now. DESIGN DECISIONS!1!1
function positionMenu(e) {
    clickCoords = getPosition(e);
    clickCoordsX = clickCoords.x;
    clickCoordsY = clickCoords.y;
 
    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;
 
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
 
    if ( (windowWidth - clickCoordsX) < menuWidth ) {
        menu.style.left = windowWidth - menuWidth + "px";
    } else {
        menu.style.left = clickCoordsX + "px";
    }
 
    if ( (windowHeight - clickCoordsY) < menuHeight ) {
        menu.style.top = windowHeight - menuHeight + "px";
    } else {
        menu.style.top = clickCoordsY + "px";
    }

    //calculating the xPos of the click when the menu is created will help create a light event at the right place

    xPosFromClick(e);
}

//POSITION FUNCTION:
function getPosition(e) {
  var posx = 0;
  var posy = 0;
 
  if (!e) var e = window.event;
 
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + 
                       document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop + 
                       document.documentElement.scrollTop;
  }
 
  return {
    x: posx,
    y: posy
  }
}


function toggleMenuOn() {
    if(menuState !== 1) {
        menuState = 1;
        menu.classList.add(activeMenu);
  } 
}

function toggleMenuOff() {
  if ( menuState !== 0 ) {
    menuState = 0;
    menu.classList.remove(activeMenu);
  }
}

//determines if a click is inside the given element classname
function clickInsideElement( e, className ) {
  var el = e.srcElement || e.target;
 
  if ( el.classList.contains(className) ) {
    return el;
  } else {
    while ( el = el.parentNode ) {
      if ( el.classList && el.classList.contains(className) ) {
        return el;
      }
    }
  }
 
  return false;
}

//called by adding a light event from the context menu
function addLightEventFromContextMenu(color) {
    console.log(bar);
    var eventTime = (xPos / songWidth) * songLength;
    eventTime = Math.round(eventTime * 10) / 10;
    //console.log(color)
    switch(color) {
        case 'red':
            bar.style.stroke = "#800000"
            addLightEventInOrder(new LightEvent("#800000", eventTime))
            break;
        case 'orange':
            bar.style.stroke = "#e68a00"
            addLightEventInOrder(new LightEvent("#e68a00", eventTime));
            break;
        case 'green':
            bar.style.stroke = "#7acc29"
            addLightEventInOrder(new LightEvent("#7acc29", eventTime));
            break;
        case 'blue':
            bar.style.stroke = "#1919f"
            addLightEventInOrder(new LightEvent("#1919ff", eventTime));
            break;
        case 'purple':
         bar.style.stroke = "#551a8b"
            addLightEventInOrder(new LightEvent("#551a8b", eventTime));
            break;
        case 'white':
            bar.style.stroke = "#ffffff"    
            addLightEventInOrder(new LightEvent("#ffffff", eventTime));
            break;
        case 'black':
            bar.style.stroke = "#000000"
            addLightEventInOrder(new LightEvent("#000000", eventTime));
            break;
    }
}

function addLightEventInOrder(lightEvent) {
    //console.log(lightEvent.color)
    if(upcomingLightEvents.length === 0) {
        //console.log("you're adding one to an empty list") 
        upcomingLightEvents[0] = lightEvent;
        //printArray();
    }
    else {
        if(lightEvent.time < upcomingLightEvents[0].time) {
            upcomingLightEvents.splice(0, 0, lightEvent);
            //console.log("you're adding one at the beginning");
            //printArray();
        }
        else if(lightEvent.time > upcomingLightEvents[upcomingLightEvents.length - 1].time) {
            //console.log(upcomingLightEvents[length])
            //console.log("you're adding one at the end because " + lightEvent.time + " is greater than " + upcomingLightEvents[upcomingLightEvents.length - 1].time);
            upcomingLightEvents.push(lightEvent);
            //printArray();
            //console.log("you're adding one at the end, which should now be: " + console.log(upcomingLightEvents[length]))
        }
        else {
            for(var i = 0; i < upcomingLightEvents.length - 1; i ++) {
                if(upcomingLightEvents[i].time < lightEvent.time &&
                    upcomingLightEvents[i + 1].time > lightEvent.time) {
                    upcomingLightEvents.splice(i + 1, 0, lightEvent);
                    //console.log("you added one in between")
                    //printArray();
                    break;
                }
            }
        }
    }
    //console.log("the list of upcoming light events is now length " + upcomingLightEvents.length)
}

function xPosFromClick(e) {
    //calculating the xPos of the click when the menu is created will help create a light event at the right place
    var position = waveform.getBoundingClientRect();
    xPos = e.clientX - position.left;
}

function songTimeFromClick() {
    eventTime = (xPos / songWidth) * songLength;
    return eventTime;
}


/*
    //this is what happens when you press play
*/
function play() {
    //var button = document.getElementById('play-pause-border');
    //var musicPlayer = document.getElementById('music-player');
    //audio = document.getElementById('uploaded-song');
    if (audio.paused) {
        audio.play();
        setInterval(function(){ checkForLightEvent(audio) }, 100);//runs every...something

        document.getElementById('fa-play').style.color = '#157A6E';
        musicPlayer.style.backgroundColor = '#000';
        console.log(upcomingLightEvents.length)
    }else{
        audio.pause();
        document.getElementById('fa-play').style.color = '#DCDDC5';
        musicPlayer.style.backgroundColor = '#1d2120';
        //console.log(pastLightEvents);
        //console.log("there are " + pastLightEvents.length + " events in past light events");
    }
}

function checkForLightEvent(audio) {
    //console.log("is this even working?")
    //currentTime = Math.round(audio.currentTime);
    currentTime = Math.round(audio.currentTime * 10) / 10;
    updateTimeInHtml(currentTime);//updates timer
    console.log(currentTime);
    //console.log(currentTime)
    /*if(upcomingLightEvents.length > 0) { 
        //console.log(currentTime + " " + upcomingLightEvents[0].time);
        if(currentTime === upcomingLightEvents[0].time) {
            runEvent(upcomingLightEvents[0]);
            pastLightEvents[pastLightEvents.length] = upcomingLightEvents.splice(0, 1);
        }
    }*/
    for(var i = 0; i < upcomingLightEvents.length; i++) {
        //console.log("current time is " + currentTime + " whereas the next event is at " + upcomingLightEvents[i].time);
        if(currentTime < upcomingLightEvents[i].time) {
            //console.log("nigga we out") 
            break;
        }
        else if(currentTime === upcomingLightEvents[i].time) {
            runEvent(upcomingLightEvents[i]);
            //console.log(upcomingLightEvents[0])
            var temp = upcomingLightEvents.shift();
            //console.log(temp);
            //pastLightEvents[pastLightEvents.length] = upcomingLightEvents.splice(0, 1);   
            pastLightEvents.push(temp);  
            i--;
            //console.log("Size of upcomingLightEvents: " + upcomingLightEvents.length);
            //console.log("Size of pastLightEvents: " + pastLightEvents.length);
        }
    }
}

function runEvent(lightEvent) {
    //var musicPlayer = document.getElementById('music-player');
    //console.log(lightEvent.color)
    musicPlayer.style.backgroundColor = lightEvent.color;
    //console.log("The color ran at " + lightEvent.time + " is " + lightEvent.color);
    //console.log(pastLightEvents[0])
}

/*
    //testing functions
*/
//testing! prints out all times in an array, in order
function printArray() {
    var arrayString = "";
    var lightEvent = "";
    for(var i = 0; i < upcomingLightEvents.length; i ++) {
        lightEvent = upcomingLightEvents[i].time.toString();
        arrayString = arrayString.concat(lightEvent + ", ")
    }
    console.log(arrayString)
}

/*
    //something something frontend functions
*/
function updateTimeInHtml(currentTime) {
    var minutesText = currentTime;
    var secondsText = currentTime;
    minutesText = Math.floor(minutesText / 60);
    secondsText = Math.floor(secondsText % 60);
    document.getElementById("music-timer-text").innerHTML = minutesText + ":" + secondsText;
}
function unfade(element) {
    /*var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);*/
    element.fadeIn(700);
}

/*
    //helper functions af  
*/
function keyupListener() {
  window.onkeyup = function(e) {
    if ( e.keyCode === 27 ) {
      toggleMenuOff();
    }
  }
}

function resizeListener() {
  window.onresize = function(e) {
    toggleMenuOff();
  };
}

function zoom (event) {
    console.log("HEY")
    if(zoomState === 0) {
        $("#svg").width(
            $("#svg").width() * 3
        );
        zoomState++;
        songWidth = $("#svg").width();
        zoomButton.style.color = '#157A6E';
    }
    else {
        $("#svg").width(
            $("#svg").width() / 3
        );
        zoomState--;
        songWidth = $("#svg").width();
        zoomButton.style.color = '#DCDDC5';
    }
}