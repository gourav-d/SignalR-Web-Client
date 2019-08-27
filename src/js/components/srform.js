import * as signalR from "@aspnet/signalr";

var connection = null;
var isConnected = false;
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

        //Send Payload Button Events
        var sendBtnClass = document.getElementsByClassName('btn-send-payload');
        for (var i = 0; i < disconnectBtnClass.length; i++) {
            sendBtnClass[i].addEventListener('click', 
                function() {
                    SendPayload();
            }, 
            false);
        }

    NotConnected();
    
    Test();
    
}

export function Test() {

    var navLinkClass = document.getElementsByClassName('nav-link');
        for (var i = 0; i < navLinkClass.length; i++) {
            navLinkClass[i].addEventListener('click', 
                function() {
                    //debugger;
                console.log(this.getAttribute('data-tab-type'));
                OnTabChange(this.getAttribute('data-tab-type'));
            }, 
            false);
        }
}

export function OnTabChange(tabName) {
    if(tabName == 'basic') {
        document.getElementById('protocol-support').style = 'display:none';

    }
    else {
        if(isConnected) {
            document.getElementById('protocol-support').style = 'display:block';
        }
    }   
}

export function AddArguments() {

    //Add Arguments Button Events
    var addArgBtnClass = document.getElementsByClassName('btn-add-argument');
    for (var i = 0; i < addArgBtnClass.length; i++) {
        addArgBtnClass[i].addEventListener('click', 
            function() {
                
                var parentDiv = document.getElementsByClassName('method-arguments');

                for (var i = 0; i < parentDiv.length; i++) {
                    var inputTxtElement = document.createElement('textarea');
                    inputTxtElement.setAttribute("row", "1");
                    inputTxtElement.setAttribute("value", "");
                    inputTxtElement.setAttribute("class", "form-control req-arg");
                    inputTxtElement.setAttribute("placeholder", "Request Payload");
                    parentDiv[i].appendChild(inputTxtElement);
                    parentDiv[i].append(document.createElement('br'))
                }
        }, 
        false);
    }
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
    var url = document.getElementById("inputUrl").value;
    connectToServer(url);

    console.log("OnConnect");
    isConnected = true;
    var onConnectClass = document.getElementsByClassName('onconnect');
    for (var i = 0; i < onConnectClass.length; i++) {
        onConnectClass[i].style.display = "block";
    }

    //Hide Connect Button
    DisableElementByClassName('connectbtn')

    //Receive Data
    connection.on("ReceiveData", function(data)  {
        document.querySelector("#inputResponseData").value +=  JSON.stringify(data) + '\n';
    });

    AddArguments();
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
    isConnected = false;
    Disconnect();
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

export function Disconnect() {
    connection.stop()
                .then(function () {
                    console.log('Disconnected');
                    //document.querySelector("#txt-output-area").value +=  "Disconnected..." + '\n'
                })
                .catch(function (err) {
                    return console.error(err.toString());
                });
}

export function SendPayload() {

    var methodName = document.getElementById("inputServerMethod").value;
    var c = new Array();
    //var data = JSON.parse(document.getElementById("inputRequestData").value);
    var argsTextAreaClass = document.getElementsByClassName('req-arg');
debugger;
    for (var i = 0; i < argsTextAreaClass.length; i++) {
        
        if(argsTextAreaClass[i].value !== "") { 

            //Star from Here
            //Support different type of data format
            //c.push(JSON.parse(argsTextAreaClass[i].value));
            c.push(argsTextAreaClass[i].value);
        }
    }   
    

    connection.invoke(methodName, ...c)
            .catch(function (err) {
                return console.log(err);
            });
}