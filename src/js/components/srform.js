import * as signalR from "@aspnet/signalr";
import mitt from 'mitt';
import deleteImg from '../../images/delete.png';

const ContentType = { 
    TEXT : "Text",
    NUMBER : "Number",
    JSON : "JSON"
} 

const eventEmitter = mitt();
var connection = null;
var storeFunc = null;
var isConnected = false;
var isAdvanceView = false;
var isTokenRequired = false;

export function Init() {
    //Connect Button Events
    var connectBtnClass = document.getElementsByClassName('connectbtn');
    for (var i = 0; i < connectBtnClass.length; i++) {
        connectBtnClass[i].addEventListener('click',
            function () {
                OnConnect();
            },
            false);
    }

    //Disconnect Button Events
    var disconnectBtnClass = document.getElementsByClassName('disconnectbtn');
    for (var i = 0; i < disconnectBtnClass.length; i++) {
        disconnectBtnClass[i].addEventListener('click',
            function () {
                OnDisConnect();
            },
            false);
    }

    //Send Payload Button Events
    var sendBtnClass = document.getElementsByClassName('btn-send-payload');
    for (var i = 0; i < disconnectBtnClass.length; i++) {
        sendBtnClass[i].addEventListener('click',
            function () {
                SendPayload();
            },
            false);
    }

    NotConnected();
    RigisterNavigationTabEvent();

    document.getElementById('chk-req-token')
            .addEventListener('change', (event) => {
                    if (event.target.checked) {
                        document.getElementById('authHeader').disabled= false;
                        isTokenRequired = true;
                    } else {
                        isTokenRequired = false;
                        document.getElementById('authHeader').disabled= true;
                    }
                });

}

//#region ConnectedEvent

eventEmitter.on('OnConnected', () => {
    if(isAdvanceView === true) {
        document.getElementById('chk-ws').disabled= true;
        document.getElementById('chk-sse').disabled= true;
    }
} );

//#endregion

//#region OnDisconnected
eventEmitter.on('OnDisconnected', () => {
    if(isAdvanceView === true) {
        document.getElementById('chk-ws').disabled= false;
        document.getElementById('chk-sse').disabled= false;
    }
} );
//#endregion

export function RigisterNavigationTabEvent() {

    var navLinkClass = document.getElementsByClassName('nav-link');
    for (var i = 0; i < navLinkClass.length; i++) {
        navLinkClass[i].addEventListener('click',
            function () {
                console.log(this.getAttribute('data-tab-type'));
                OnTabChange(this.getAttribute('data-tab-type'));
            },
            false);
    }
}

export function OnTabChange(tabName) {
    if (tabName == 'basic') {
        isAdvanceView = false;
        AdvanceViewElements(isAdvanceView);
    }
    else {
        isAdvanceView = true;
        AdvanceViewElements(isAdvanceView);
    }
}


export function AdvanceViewElements(enable) {
    if(enable === true) {
        document.getElementById('protocol-support').style = 'display:block';
        document.getElementById('auth-container').style = 'display:block';
        if(isConnected === true) {
            document.getElementById('chk-req-token').disabled = true;
            document.getElementById('authHeader').disabled = true;
        } else {
            document.getElementById('chk-req-token').disabled = false;
            if(isTokenRequired === true) {
                document.getElementById('authHeader').disabled = false;
            }
            
        }
    } 
    else {
        document.getElementById('protocol-support').style = 'display:none';
        document.getElementById('auth-container').style = 'display:none';
    }
}

export function AddArguments() {
    //Add Arguments Button Events
    var addArgBtnClass = document.getElementsByClassName('btn-add-argument');
    for (var i = 0; i < addArgBtnClass.length; i++) {
        addArgBtnClass[i].addEventListener('click', AddArgumentsCallBack, false);
    }
}

export function AddArgumentsCallBack() {

    var parentDiv = document.getElementsByClassName('method-arguments');

    for (var i = 0; i < parentDiv.length; i++) {

        var divElement = document.createElement('div');
        //divElement.setAttribute('class', 'form-group form-inline args-container');
        divElement.setAttribute('class', 'container args-container');
        //divElement.setAttribute('style', 'border:1px solid #cecece');

        var hr = document.createElement('hr');
        hr.setAttribute('class', 'style13');

        divElement.appendChild(GetTextBoxElement());
        divElement.appendChild(GetSelectElement());
        divElement.appendChild(GetImageElement());
        divElement.append(document.createElement('br'))
        divElement.appendChild(hr);
        parentDiv[i].appendChild(divElement);
    }
}

export function GetSelectElement() {
    var div = document.createElement('div');
    div.setAttribute('class', 'form-group col-sm-5');


    var selectElement = document.createElement('select');
    selectElement.setAttribute('class', 'req-content-type form-control');

    var optionTxt = document.createElement('option');
    var optionNum = document.createElement('option');
    var optionJsonObj = document.createElement('option');

    optionTxt.value = ContentType.TEXT
    optionTxt.text = "Text";
    selectElement.add(optionTxt, null);

    optionNum.value = ContentType.NUMBER
    optionNum.text = "Number";
    selectElement.add(optionNum, null);

    optionJsonObj.value = ContentType.JSON;
    optionJsonObj.text = "JSON";
    selectElement.add(optionJsonObj, null);

    div.appendChild(selectElement);

    return div;
}

export function GetTextBoxElement() {

    var div = document.createElement('div');
    div.setAttribute('class', 'form-group col-sm-5');

    var inputTxtElement = document.createElement('textarea');
    inputTxtElement.setAttribute("row", "1");
    inputTxtElement.setAttribute("value", "");
    inputTxtElement.setAttribute("class", "form-control req-arg-txt");
    inputTxtElement.setAttribute("placeholder", "Request Payload");

    div.appendChild(inputTxtElement);
    return div;
}

export function GetImageElement() {
    var div = document.createElement('div');
    div.setAttribute('class', 'form-group col-sm-5');

    var imgElement = document.createElement('img');
    imgElement.src = deleteImg;
    // inputTxtElement.src = require('../../images/delete.png');
    imgElement.addEventListener('click', function() {
        console.log('Delete Button');
        this.parentElement.parentElement.remove();
    });
    div.appendChild(imgElement);
    return div;
}

export function ReadArguments() {
    var requestArgs = new Array();
    var argsContainers = document.querySelectorAll('.args-container');
    
    if (argsContainers.length == 0) {
        return requestArgs;
    }

    argsContainers.forEach((el) => {
        var textBox = el.querySelector('.req-arg-txt').value;
        var selectList = el.querySelector('.req-content-type').value;

        if(textBox !== "") {
            requestArgs.push({cType: selectList, data: textBox });
        }
    });

    return requestArgs;
}

export function ReadAndFormatArguments() {
    var args = ReadArguments();
    var requestArguments = new Array();

    args.forEach((d) => {
        if(d.cType == ContentType.NUMBER) {
            requestArguments.push(Number(d.data));
        } 
        else if(d.cType == ContentType.JSON) {
            requestArguments.push(JSON.parse(d.data));
        }
        else if(d.cType == ContentType.TEXT) {
            requestArguments.push(d.data);
        }
    });

    return requestArguments;
}

export function NotConnected() {
    console.log("notConnected");
    var onConnectClass = document.getElementsByClassName('onconnect');

    for (var i = 0; i < onConnectClass.length; i++) {
        onConnectClass[i].style.display = "none";
    }
}

export function buildConnection(url) {
    // var option = {
    //     accessTokenFactory: () => 'YOUR ACCESS TOKEN TOKEN HERE'
    //   };

//     const options = {
//         accessTokenFactory: getToken
// };

    var option = { };

    if(isAdvanceView) {
        if(isTokenRequired === true) {
        option.accessTokenFactory = () => document.getElementById('authHeader').value;
        }
    }

    connection = new signalR.HubConnectionBuilder()
                    .withUrl(url, option)
                    // .withUrl(url,
                    // {
                    //     accessTokenFactory: () => "MyTokenGoesHere" // Return access token
                    // })
                    .configureLogging(signalR.LogLevel.Information)
                    //.withAutomaticReconnect([0, 2000, 10000, 30000])
                    .build();
}

export function start() {

    connection
        .start()
        .then(function () {
            //console.log('Connected');
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

    if(isAdvanceView) {
        SetConnectionProtocol();
    }

    var urlElement = document.getElementById("inputUrl");
    connectToServer(urlElement.value);
    console.log("OnConnect");
    isConnected = true;
    var onConnectClass = document.getElementsByClassName('onconnect');
    for (var i = 0; i < onConnectClass.length; i++) {
        onConnectClass[i].style.display = "block";
    }

    AdvanceViewElements(isAdvanceView);
    //Hide Connect Button
    DisableElementByClassName('connectbtn')

    //Receive Data
    //Reading the raw response
    storeFunc = connection.processIncomingData;
    connection.processIncomingData = function (data) {
        console.log('processIncomingData'+ data);
        storeFunc.call(connection, data);
    }
    connection.on("ReceiveData", function (data) {
        document.querySelector("#inputResponseData").value += JSON.stringify(data) + '\n';
    });

    eventEmitter.emit('OnConnected');
    AddArguments();

    //Disable Url
    urlElement.disabled = true;
}

export function SetConnectionProtocol() {
    var elements = document.querySelectorAll(".protocol-support");

    for(var i = 0; i < elements.length; i++)
    {
        if(elements[i].value === "ws" && elements[i].checked !== true)
        {
            console.log("WebSocket disabled");
            WebSocket = undefined;
        }
        else if(elements[i].value === "sse" && elements[i].checked !== true)
        {
            console.log("Server Sent Event disabled");
            EventSource = undefined;
        }
        else if(elements[i].value === "lp" && elements[i].checked !== true)
        {
            //console.log("Server Sent Event disabled");
            //EventSource = undefined;
        }
    }
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

    for (var i = 0; i < onDisConnectClass.length; i++) {
        onDisConnectClass[i].style.display = "block";
    }

    Reset();
    EnableElementByClassName('connectbtn');
    NotConnected();
    AdvanceViewElements(isAdvanceView);
    //Enable URL textBix
    document.getElementById("inputUrl").disabled = false;
}

export function Reset() {
    //Clear Server Method Text
    document.getElementById('inputServerMethod').value = "";

    
    var addArgBtnClass = document.getElementsByClassName('btn-add-argument');
    for (var i = 0; i < addArgBtnClass.length; i++) {
        addArgBtnClass[i].removeEventListener('click', AddArgumentsCallBack, false);
    }
    document.getElementById('method-arguments').innerHTML = "";
    inputResponseData.value = "";
}

export function Disconnect() {
    connection.stop()
        .then(function () {
            console.log('Disconnected');
            eventEmitter.emit('OnDisconnected');
        })
        .catch(function (err) {
            return console.error(err.toString());
        });
}

export function SendPayload() {

    var methodName = document.getElementById("inputServerMethod").value;
    var methodArguments = new Array();

    methodArguments = ReadAndFormatArguments();

    connection.invoke(methodName, ...methodArguments)
        .catch(function (err) {
            return console.log(err);
        });
}