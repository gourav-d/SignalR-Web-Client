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

function IsValidUrl(url)
{
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //port
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i');
    return pattern.test(url);
}

function IsValidJSON(data)
{
    try {
            JSON. parse(str);
        } catch (e) {
            return false;
        }        
}

export { 
    ContentType, 
    AppEvents, 
    EnableElementByClassName, 
    DisableElementByClassName,
    HideElementByClassName,
    ShowElementByClassName,
    IsValidUrl,
    IsValidJSON
 };