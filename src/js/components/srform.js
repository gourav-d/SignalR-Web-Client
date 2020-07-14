import deleteImg from '../../images/delete.png';
import notificationSound from '../../assets/Notification.wav';
import { AppLogic } from './logic/app.logic';
import * as AppCommon from './logic/lib/app.common';
import * as Dialogbox from '../components/dialogbox/custompopup';

var isConnected = false;
var transportType = "ws";
var skipNegotiation = false;
//#region ConnectedEvent
AppCommon.AppEvents.on('Init', () => {

});
//#endregion

//#region OnDisconnected
AppCommon.AppEvents.on('OnDisconnected', () => {
    if (window.appLogic.GetCurrentView() !== true) {
        EnableMdlElement('protocol-support');
        EnableMdlElement('skip-negotiation');
        EnableMdlElement('chk-req-token')
    }
});
//#endregion

export function Init() {
    window.appLogic = new AppLogic();
    //Connect Button Events
    document.getElementById('btn-connect')
        .addEventListener('click',
            function () {
                OnConnect();
            },
            false);

    //Disconnect Button Events
    document.getElementById('btn-disconnectbtn')
        .addEventListener('click',
            function () {
                OnDisconnect();
            },
            false);

    //Send Payload Button Events
    document.getElementById('btn-send-payload')
        .addEventListener('click',
            function () {
                SendPayload();
            },
            false);

    document.getElementById('chk-loggerView')
        .addEventListener('change', (event) => {
            if (event.target.checked) {
                document.getElementById('logger-container').style.display = "block";
            } else {
                document.getElementById('logger-container').style.display = "none";
            }
        });

    document.getElementById('chk-skip-negotiation')
        .addEventListener('change', (event) => {
            if (event.target.checked) {
                skipNegotiation = true;
            } else {
                skipNegotiation = false;
            }
        });

    const muteNotifcationElement = document.getElementById('chk-mute-notification');
    var notifcationMute = window.localStorage.getItem('muteNotification');
    console.log('1 Notification data-' +  notifcationMute);
    
    if((!!notifcationMute) === false) {
        window.localStorage.setItem('muteNotification', 0);
        notifcationMute = 0;
    }

    muteNotifcationElement.checked = parseInt(notifcationMute) === 1;

    muteNotifcationElement.addEventListener('change', (event) => {
        if (event.target.checked) {
            window.localStorage.setItem('muteNotification', 1);
        } else {
            window.localStorage.setItem('muteNotification', 0);
        }
    });

    document.getElementById('btn-clearlogs')
        .addEventListener('click', (event) => {
            document.getElementById("app-logs").innerHTML = "";
        },
            false);

    AppCommon.AppEvents.on('Logger', (message) => {
        var msg = "[" + new Date().toISOString() + "] :: " + message;
        var loggerElement = document.getElementById("app-logs");        
        var oldLogs = loggerElement.innerHTML;
        document.getElementById("app-logs").innerHTML = '<p>' + msg + '</p>' + oldLogs;
    });

    AppCommon.AppEvents.on('ConnectionFailed', (message) => {
        isConnected = false;
        //alert('Connection Failed: Not able to establised the connection. Please check the Url.');
        Dialogbox.Alert('Not able to establised the connection. Please check the logs for more information.', 'Connection Failed');
        AppCommon.AppEvents.off('ReceivedData', HandleResponse);
    });

    AppCommon.AppEvents.on('OnConnected', OnConnected);

    NotConnected();
    RigisterNavigationTabEvent();

    document.getElementById('chk-req-token')
        .addEventListener('change', (event) => {
            if (event.target.checked) {
                document.getElementById('authHeader').disabled = false;
                window.appLogic.EnableAuth();
            } else {
                window.appLogic.DisableAuth();
                document.getElementById('authHeader').disabled = true;
            }
        });

}

export function RigisterNavigationTabEvent() {

    var navLinkClass = document.getElementsByClassName('nav-link');
    for (var i = 0; i < navLinkClass.length; i++) {
        navLinkClass[i].addEventListener('click',
            function () {
                OnTabChange(this.getAttribute('data-tab-type'));
            },
            false);
    }
}

export function OnTabChange(tabName) {
    var appView = document.getElementById('appview');
    var tabHeaderElement = appView.getElementsByTagName('h4')[0];

    if (tabName == 'basic') {
        window.appLogic.SetCurrentViewAsBasic();
        AdvanceViewElements(false);
        tabHeaderElement.innerText = "Basic";
    }
    else {
        window.appLogic.SetCurrentViewAsAdvance();
        AdvanceViewElements(true);
        tabHeaderElement.innerText = "Advance";
    }
}

export function AdvanceViewElements(enable) {

    if (enable === true) {
        document.getElementById('protocol-support').style = 'display:block';        
        document.getElementById('auth-container').style = 'display:block';
        document.getElementById('content-negotiation').style = 'display:block';
        
        if (isConnected === true) {
            document.getElementById('chk-req-token').disabled = true;
            document.getElementById('authHeader').disabled = true;
            DisableMdlElement('protocol-support');
            DisableMdlElement('skip-negotiation');
            DisableMdlElement('chk-req-token')
        }
        else {
            document.getElementById('chk-req-token').disabled = false;
            if (window.appLogic.IsAuthEnabled() === true) {
                document.getElementById('authHeader').disabled = false;
            }
            EnableMdlElement('protocol-support');
            EnableMdlElement('skip-negotiation');
            EnableMdlElement('chk-req-token')
        }
    }
    else {
        document.getElementById('protocol-support').style = 'display:none';
        document.getElementById('auth-container').style = 'display:none';
        document.getElementById('content-negotiation').style = 'display:none';
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
        divElement.setAttribute('class', 'container args-container row');


        divElement.appendChild(GetTextBoxElement());
        divElement.appendChild(GetImageElement());
        divElement.appendChild(GetSelectElement());
        
        // divElement.append(document.createElement('br'))
        //var hr = document.createElement('hr');
        //hr.setAttribute('class', 'horizontal-line form-group col-sm-10');
        //divElement.appendChild(hr);
        parentDiv[i].appendChild(divElement);
    }
}

export function GetSelectElement() {
    var div = document.createElement('div');
    div.setAttribute('class', 'form-group col-sm-4');

    var selectElement = document.createElement('select');
    selectElement.setAttribute('class', 'req-content-type form-control');

    var optionTxt = document.createElement('option');
    var optionNum = document.createElement('option');
    var optionJsonObj = document.createElement('option');

    optionTxt.value = AppCommon.ContentType.TEXT
    optionTxt.text = "Text";
    selectElement.add(optionTxt, null);

    optionNum.value = AppCommon.ContentType.NUMBER
    optionNum.text = "Number";
    selectElement.add(optionNum, null);

    optionJsonObj.value = AppCommon.ContentType.JSON;
    optionJsonObj.text = "JSON";
    selectElement.add(optionJsonObj, null);

    div.appendChild(selectElement);

    return div;
}

export function GetTextBoxElement() {

    var div = document.createElement('div');
    div.setAttribute('class', 'form-group col-sm-11');

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
    div.setAttribute('class', 'form-group col-sm-1 float-right');

    var imgElement = document.createElement('img');
    imgElement.src = deleteImg;
    imgElement.addEventListener('click', function () {
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

        if (textBox !== "") {
            requestArgs.push({ cType: selectList, data: textBox });
        }
    });

    return requestArgs;
}

export function ReadAndFormatArguments() {
    var args = ReadArguments();
    var requestArguments = new Array();

    args.forEach((d) => {
        if (d.cType == AppCommon.ContentType.NUMBER) {
            var data = Number(d.data);
            if(isNaN(data)) {
                Dialogbox.Alert('Incorrect Data: ' + d.data + ' . Excepted data of type - ' + d.cType, 'Invalid Input');
                throw 'Invalid Data'
            }
            requestArguments.push(data);
        }
        else if (d.cType == AppCommon.ContentType.JSON) {
            if(AppCommon.IsValidJSON(data)) {
                Dialogbox.Alert('Incorrect Data: ' + d.data + ' . Excepted data of type - ' + d.cType, 'Invalid Input');
                throw 'Invalid Data'
            }
            requestArguments.push(JSON.parse(d.data));
        }
        else if (d.cType == AppCommon.ContentType.TEXT) {
            requestArguments.push(d.data);
        }
    });

    return requestArguments;
}

export function NotConnected() {
    console.log("Not Connected");
    var onConnectClass = document.getElementsByClassName('onconnect');

    for (var i = 0; i < onConnectClass.length; i++) {
        onConnectClass[i].style.display = "none";
    }
}

export function buildConnection(url) {
    var option = { url: url, getToken: () => document.getElementById('authHeader').value };
    option.transportType = transportType;
    option.skipNegotiation = skipNegotiation;
    window.appLogic.Init(option);
}

export function start() {
    window.appLogic.OnConnect(function(data) {
        AppCommon.AppEvents.emit('OnConnected', data);
        AppCommon.AppEvents.emit('Logger', "Connection established successfully with the server");
    }, function(err) {
        AppCommon.AppEvents.emit('ConnectionFailed', err.toString());
        AppCommon.AppEvents.emit('Logger', "ConnectionFailed-> " + err.toString());
    });
}

export function connectToServer(url) {
    buildConnection(url);
    start();
}

function UrlValidation() {
    const urlElement = document.getElementById("inputUrl");
    const errorElement = urlElement.nextElementSibling;

    if (AppCommon.IsValidUrl(urlElement.value)) {
        errorElement.innerText = "";
        errorElement.className = "error";
        return true;
    } else {
            errorElement.innerText = "Invalid Url";
            errorElement.className = 'error active';
            return false;
    }
}

function TextboxValidation(element, errorMessage) {
    const errorElement = element.nextElementSibling;

    if(!!element.value) {
        errorElement.innerText = "";
        errorElement.className = "error";
        return true;
    } else {
            errorElement.innerText = errorMessage;
            errorElement.className = 'error active';
            return false;
    }
}


export function OnConnect() {

    //Add validation
    if(!UrlValidation()) {
        return;
    }

    var isAdvanceView = !window.appLogic.GetCurrentView();
    if (isAdvanceView) {
        SetConnectionProtocol();
        if(!ValidateTokenTextBox()) {
            return;
        }

    }               

    var urlElement = document.getElementById("inputUrl");
    connectToServer(urlElement.value);

}

export function OnConnected() {
    var isAdvanceView = !window.appLogic.GetCurrentView(); //true = basicView
    var urlElement = document.getElementById("inputUrl");
    isConnected = true;

    DisableMdlElement('chk-req-token')    
    AppCommon.ShowElementByClassName('onconnect');

    AdvanceViewElements(isAdvanceView);
    //Hide Connect Button
    AppCommon.DisableElementByClassName('connectbtn');
    AddArguments();

    AppCommon.AppEvents.on('ReceivedData', HandleResponse);
    //Disable Url
    urlElement.disabled = true;
}

export function HandleResponse(data) {
    var responseDiv = document.querySelector("#inputResponseData");
    responseDiv.innerText += JSON.stringify(data) + '\n';
    responseDiv.scrollTop = responseDiv.scrollHeight;

    var isNotificationMute = window.localStorage.getItem('muteNotification');

    if(parseInt(isNotificationMute) === 0) {
        let sound = new Audio(notificationSound);
        sound.play();
    }
}

export function SetConnectionProtocol() {
    var elements = document.querySelectorAll(".protocol-support");

    for (var i = 0; i < elements.length; i++) {
        if (elements[i].value === "ws" && elements[i].checked === true) {
            //WebSocket = undefined;
            transportType = "ws";
            return;
        }
        else if (elements[i].value === "sse" && elements[i].checked === true) {
            //EventSource = undefined;
            transportType = "sse";
            return;
        }
        else if (elements[i].value === "lp" && elements[i].checked === true) {
            transportType = "lp";
            return;
        }
    }
}

export function OnDisconnect() {
    isConnected = false;
    Disconnect();
    AppCommon.HideElementByClassName('onconnect');

    Reset();
    AppCommon.EnableElementByClassName('connectbtn');
    NotConnected();
    AdvanceViewElements(!window.appLogic.GetCurrentView());
    //Enable URL textBix
    document.getElementById("inputUrl").disabled = false;
    AppCommon.AppEvents.off('ReceivedData', HandleResponse);
}

export function Reset() {
    //Clear Server Method Text
    document.getElementById('inputServerMethod').value = "";

    var addArgBtnClass = document.getElementsByClassName('btn-add-argument');
    for (var i = 0; i < addArgBtnClass.length; i++) {
        addArgBtnClass[i].removeEventListener('click', AddArgumentsCallBack, false);
    }
    document.getElementById('method-arguments').innerHTML = "";
    var responseDiv = document.querySelector("#inputResponseData");
    responseDiv.innerText = "";
}

export function Disconnect() {
    window.appLogic.OnDisconnect(function() {
        AppCommon.AppEvents.emit('Logger', "Disconnected from the server");
        AppCommon.AppEvents.emit('OnDisconnected');
    },
    function(err) {
        AppCommon.AppEvents.emit('Logger', err.toString());
    });
}

export function SendPayload() {

    const methodNameElement = document.getElementById("inputServerMethod");
    var methodName = methodNameElement.value;   
    if(!TextboxValidation(methodNameElement, "Please enter the Hub method name")) {
        return false;
    }

    var methodArguments = new Array();

    methodArguments = ReadAndFormatArguments();
    window.appLogic.OnSend({ methodName: methodName, methodArguments: methodArguments },
        function(options) {
            AppCommon.AppEvents.emit('Logger', "Calling server method - " + options.methodName);
        },
        function(err) {
            AppCommon.AppEvents.emit('Logger', err.toString());
            Dialogbox.Alert(err.toString(), 'Error');
        });
}

function DisableMdlElement(className) {
    var el = document.getElementsByClassName(className);

    for (var i = 0; i < el.length; i++) {
        el[i].disabled = true;
        el[i].parentNode.classList.add("is-disabled");
    }
}

function EnableMdlElement(className) {
    var el = document.getElementsByClassName(className);

    for (var i = 0; i < el.length; i++) {
        el[i].disabled = false;
        el[i].parentNode.classList.remove("is-disabled");
    }
}

function ValidateTokenTextBox() {
    debugger;
    var isTokenReq = document.getElementById('chk-req-token').checked;
    var tokenTxtBox = document.getElementById('authHeader')
    if(isTokenReq) {
        if(!TextboxValidation(tokenTxtBox, "Please enter the Token")) {
            AppCommon.AppEvents.emit('Logger', "Please enter the Token");
            return false;
        }
    } 
    else {
        const errorElement = tokenTxtBox.nextElementSibling;
        errorElement.innerText = "";
        errorElement.className = "error";
        
    }
    return true;
}