import * as signalR from "@aspnet/signalr";

var connection = null;
export  function Init() {
    //Connect Button Events
    var connectBtnClass = document.getElementsByClassName('connectbtn');
    for (var i = 0; i < connectBtnClass.length; i++) {
        connectBtnClass[i].addEventListener('click', 
            function() {
                console.log('btn connect');
                OnConnect();
        }, 
        false);
    }

    //Disconnect Button Events
    var disconnectBtnClass = document.getElementsByClassName('disconnectbtn');
    for (var i = 0; i < disconnectBtnClass.length; i++) {
        disconnectBtnClass[i].addEventListener('click', 
            function() {
                console.log('btn connect');
                OnDisConnect();
        }, 
        false);
    }

    NotConnected();
}

export function NotConnected() {
    console.log("notConnected");
    var onConnectClass = document.getElementsByClassName('onconnect');
    var tests = function() {
        console.log('btn connect');
    };

    for (var i = 0; i < onConnectClass.length; i++) {
        onConnectClass[i].style.display = "none";
    }
}

export function buildConnection(url) {
        connection = new signalR.HubConnectionBuilder()
                .withUrl(url)
                .build();
}

export function start() {
    
    connection
        .start()
        .then(function () {
            console.log('Connected');
            //document.querySelector("#txt-output-area").value +=  "Connected..." + '\n'
        })
        .catch(function (err) {
            return console.error(err.toString());
        });
}

export function connectToServer(url) {
    buildConnection(url);
    start();
}

export function OnConnect() {

    //Try to setup connection
    //work from here
    var url = document.getElementById()
    connectToServer();


    console.log("OnConnect");
    var onConnectClass = document.getElementsByClassName('onconnect');
    for (var i = 0; i < onConnectClass.length; i++) {
        onConnectClass[i].style.display = "block";
    }

    //Hide Connect Button
    DisableElementByClassName('connectbtn')
}

export function DisableElementByClassName(className) {
    var el = document.getElementsByClassName(className);

    for (var i = 0; i < el.length; i++) {
        el[i].disabled = true; 
    }
}

export function EnableElementByClassName(className) {
    var el = document.getElementsByClassName(className);

    for (var i = 0; i < el.length; i++) {
        el[i].disabled = false; 
    }
}

export function OnDisConnect() {
    console.log("OnDisConnect");
    var onDisConnectClass = document.getElementsByClassName('disconnectbtn');
    var addEventOnDisconnect = function() {
        console.log('btn disconnect');
    };

    for (var i = 0; i < onDisConnectClass.length; i++) {
        onDisConnectClass[i].style.display = "block";
    }

    EnableElementByClassName('connectbtn');
    NotConnected();
}