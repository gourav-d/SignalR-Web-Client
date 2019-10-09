import * as SignalR from "@aspnet/signalr";
import { AppEvents } from './app.common';

class SignalRApp {
    constructor(url) {
        this.url = url;
        this.connection = null;
        this.isConnected = false;
        this.processResponse = null;
    }

    Init(options) {

        if(options.isTokenRequired === true) {
            options.accessTokenFactory = () => options.getToken();
        }
        
        this.connection = new SignalR.HubConnectionBuilder()
            .withUrl(options.url, options)
            .configureLogging(SignalR.LogLevel.Information)
            .build();

        //Receive Data
        //Reading the raw response
        var self = this;
        self.processResponse = self.connection.processIncomingData;

        self.connection.processIncomingData = function (data) {
            self.processResponse.call(self.connection, data);
            self.HandleResponse(data);
        }
        
        AppEvents.emit('Init', options);
        AppEvents.emit('Logger', "Init");
    }
    
    
    OnConnect() {
        var self = this;
        self.connection.start()
            .then(function () {
                AppEvents.emit('OnConnect', { url: self.url });
            })
            .catch(function (err) {
                AppEvents.emit('Logger', err.toString());
                return console.error(err.toString());
            });
    }
    
    OnSend(options) {
        var methodArguments = new Array();
        methodArguments = options.methodArguments;
    
        AppEvents.emit('OnSend', options);
        AppEvents.emit('Logger', "Calling... " + options.methodName);
        this.connection.invoke(options.methodName, ...methodArguments)
            .catch(function (err) {
                AppEvents.emit('Logger', err.toString());
                return console.log(err);
            });
    }
    
    OnReceive(callback) {
        // this.connection.on("ReceiveData", function (data) {
        //     callback(data);
        // });
    }
    
    OnDisConnect() {
        this.connection.stop()
            .then(function () {
                console.log('Disconnected');
                AppEvents.emit('Logger', "Disconnected...");
                AppEvents.emit('OnDisconnected');
            })
            .catch(function (err) {
                AppEvents.emit('Logger', err.toString());
                return console.error(err.toString());
            });
    }

    HandleResponse(input) {
        AppEvents.emit('Logger', input.toString());
        var output = this.ParseRespose(input);
        if(output !== null) {
            
            output.forEach((e) => {
                var jsonObj = JSON.parse(e);

                if(jsonObj !== null && jsonObj.hasOwnProperty('target')) {
                    debugger;
                    AppEvents.emit('ReceivedData', { "ClientMethod": jsonObj.target, "Data": jsonObj.arguments });
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