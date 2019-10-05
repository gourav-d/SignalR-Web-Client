import deleteImg from '../../images/delete.png';
import { AppLogic } from './logic/app.logic';
import { ContentType, AppEvents } from './logic/lib/app.common'

//var storeFunc = null;
var isConnected = false;
//var isAdvanceView = false;
//ar appLogic = null;

export function Init() {

    window.appLogic = new AppLogic();

    //Connect Button Events
    var connectBtn = document
                        .getElementById('btn-connect')
                        .addEventListener('click',
                            function () {
                                OnConnect();
                            },
                            false);

    //Disconnect Button Events
    var disconnectBtn = document
                            .getElementById('btn-disconnectbtn')
                            .addEventListener('click',
                                function () {
                                    OnDisConnect();
                                },
                                false);

    //Send Payload Button Events
    var sendBtn = document
                    .getElementById('btn-send-payload')
                    .addEventListener('click',
                        function () {
                            SendPayload();
                        },
                        false);

    NotConnected();
    RigisterNavigationTabEvent();

    document.getElementById('chk-req-token')
            .addEventListener('change', (event) => {
                    if (event.target.checked) {
                        document.getElementById('authHeader').disabled= false;
                        window.appLogic.EnableAuth();
                    } else {
                        window.appLogic.DisableAuth();
                        document.getElementById('authHeader').disabled= true;
                    }
                });

}

//#region ConnectedEvent
// eventEmitter.on('OnConnected', () => {
//     if(window.appLogic.GetCurrentView() !== true) {
//         document.getElementById('chk-ws').disabled= true;
//         document.getElementById('chk-sse').disabled= true;
//     }
// } );

AppEvents.on('Init', () => {
    debugger;
    console.log('Init Event Emitter');
} );

//#endregion

//#region OnDisconnected
AppEvents.on('OnDisconnected', () => {
    debugger;
    if(window.appLogic.GetCurrentView() !== true) {
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
        window.appLogic.SetCurrentViewAsBasic();
        AdvanceViewElements(false);
    }
    else {
        window.appLogic.SetCurrentViewAsAdvance();
        AdvanceViewElements(true);
    }
}

export function AdvanceViewElements(enable) {

    if(enable === true) {
        document.getElementById('protocol-support').style = 'display:block';
        document.getElementById('auth-container').style = 'display:block';
        if(isConnected === true) {
            document.getElementById('chk-req-token').disabled = true;
            document.getElementById('authHeader').disabled = true;
            DisableElementByClassName('protocol-support');
        } 
        else {
            document.getElementById('chk-req-token').disabled = false;
            if(window.appLogic.IsAuthEnabled() === true) {
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
        divElement.setAttribute('class', 'container args-container');

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
    var option = { url: url, getToken: () => document.getElementById('authHeader').value };
    window.appLogic.Init(option);
}

export function start() {
    window.appLogic.OnConnect();
}

export function connectToServer(url) {
    buildConnection(url);
    start();
}

export function OnConnect() {

    var isAdvanceView = !window.appLogic.GetCurrentView();
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
    // storeFunc = connection.processIncomingData;
    // connection.processIncomingData = function (data) {
    //     console.log('processIncomingData'+ data);
    //     storeFunc.call(connection, data);
    // }

    window.appLogic.OnReceive((data) => { document.querySelector("#inputResponseData").value += JSON.stringify(data) + '\n' } );

    AppEvents.emit('OnConnected');
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
    AdvanceViewElements(!window.appLogic.GetCurrentView());
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
    window.appLogic.OnDisConnect();
}

export function SendPayload() {

    var methodName = document.getElementById("inputServerMethod").value;
    var methodArguments = new Array();
    
    methodArguments = ReadAndFormatArguments();
    window.appLogic.OnSend({ methodName: methodName, methodArguments:  methodArguments});
}