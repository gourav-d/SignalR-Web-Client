import * as SignalR from "@microsoft/signalr";
import { AppEvents } from './app.common';

class SignalRApp {
    constructor(url) {
        this.url = url;
        this.connection = null;
        this.isConnected = false;
        this.processResponse = null;
    }

    Init(options) {

        var confguration = {};
        if(options.isTokenRequired === true) {
           // options.skipNegotiation = true;
           confguration.accessTokenFactory = () => options.getToken();
        }

        switch(options.transportType) {
            case "ws":
                confguration.transport = SignalR.HttpTransportType.WebSockets;
              break;
            case "lp":
                confguration.transport = SignalR.HttpTransportType.LongPolling;
              break;
              case "sse":
                confguration.transport = SignalR.HttpTransportType.ServerSentEvents;
                break;
            default:
                confguration.transport = SignalR.HttpTransportType.WebSockets;
        }

        //confguration.logMessageContent = true;
        if(!!options.skipNegotiation) {
            confguration.skipNegotiation = options.skipNegotiation;
        }
                
        this.connection = new SignalR.HubConnectionBuilder()
            .withUrl(options.url, confguration)
            .configureLogging(SignalR.LogLevel.Information)
            .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
            .build();

        //Receive Data
        //Reading the raw response
        var self = this;
        self.processResponse = self.connection.processIncomingData;

        self.connection.processIncomingData = function (data) {
            self.processResponse.call(self.connection, data);
            self.HandleResponse(data);
        }

        self.connection.onreconnecting((error) => {
            AppEvents.emit('Logger', `Connection lost due to error "${error}". Reconnecting.`);
            console.log('On Reconnecting...');
        });

        self.connection.onreconnected((connectionId) => {
            AppEvents.emit('Logger', `Reconnected successfully`);
            console.log('On Reconnected...');
        });

        /*

        self.connection.start();
debugger;

        try {
            self.connection.stream("DelayCounter", 500)
                .subscribe({
                    next: (item) => {
                        console.log("GD" + item);
                    },
                    complete: () => {
                        console.log("GD-Stream completed" + item);
                    },
                    error: (err) => {
                        console.log("GD-Error" + err);
                    },
                });
        }
        catch (e) {
            console.error(e.toString());
        }

*/
    }
    
    
    OnConnect(onSuccess, onError) {
        var self = this;
        self.connection.start()
            .then(function (data) {
                onSuccess({ url: self.url });
            })
            .catch(function (err) {
                onError(err)
            });
    }
    
    OnSend(options, beforeInvoke, onError) {
        var methodArguments = new Array();
        methodArguments = options.methodArguments;

        var isStreamInvocation = true;
    

        beforeInvoke(options);

        if(isStreamInvocation) {

            debugger;

        try {
            this.connection.stream(options.methodName, ...methodArguments)
                .subscribe({
                    next: (item) => {
                        console.log("GD" + item);
                    },
                    complete: () => {
                        console.log("GD-Stream completed");
                    },
                    error: (err) => {
                        console.log("GD-Error" + err);
                    },
                });
        }
        catch (e) {
            console.error(e.toString());
        }

        } else{
            this.connection.invoke(options.methodName, ...methodArguments)
            .catch(function (err) {
                onError(err);
            });
        }
    }
    
    OnReceive(callback) {
    }
    
    OnDisconnect(onSuccess, onError) {
        this.connection.stop()
            .then(function () {
                onSuccess();
            })
            .catch(function (err) {
                onError(err);
            });
    }

    HandleResponse(input) {
        AppEvents.emit('Logger', input.toString());
        var output = this.ParseRespose(input);
        if(output !== null) {
            
            output.forEach((e) => {
                var jsonObj = JSON.parse(e);

                if(jsonObj !== null && jsonObj.hasOwnProperty('target')) {
                    AppEvents.emit('ReceivedData', { "ClientMethod": jsonObj.target, "Data": jsonObj.arguments });
                } 
                else if(jsonObj !== null && jsonObj.hasOwnProperty('item')) {
                    AppEvents.emit('ReceivedData', { "item": jsonObj.item, "Data": jsonObj.arguments });
                }  

            });
        }
    }

    ParseRespose(input) {

        if (typeof input !== "string") {
            console.log("Invalid input for JSON hub protocol. Expected a string.");
            return null; 
            //throw new Error("Invalid input for JSON hub protocol. Expected a string.");
        }

        var separator = String.fromCharCode(0x1e);
        if (input[input.length - 1] !== separator) {
            console.log("Message is incomplete.");
            //throw new Error("Message is incomplete.");
            return null; 
        }

        var messages = input.split(separator);
        messages.pop();
        return messages;
    }
}

export { SignalRApp }