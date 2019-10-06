import mitt from 'mitt';

const ContentType = { 
    TEXT : "Text",
    NUMBER : "Number",
    JSON : "JSON"
}

const AppEvents = mitt();

function DisableElementByClassName(className) {
    var el = document.getElementsByClassName(className);

    for (var i = 0; i < el.length; i++) {
        el[i].disabled = true;
    }
}

function EnableElementByClassName(className) {
    var el = document.getElementsByClassName(className);

    for (var i = 0; i < el.length; i++) {
        el[i].disabled = false;
    }
}

function HideElementByClassName(className) {
    var el = document.getElementsByClassName(className);

    for (var i = 0; i < el.length; i++) {
        el[i].style.display = "node";
    }
}

function ShowElementByClassName(className) {
    var el = document.getElementsByClassName(className);

    for (var i = 0; i < el.length; i++) {
        el[i].style.display = "block";
    }
}

export { 
    ContentType, 
    AppEvents, 
    EnableElementByClassName, 
    DisableElementByClassName,
    HideElementByClassName,
    ShowElementByClassName
 };