import * as signalR from "@aspnet/signalr";
import { AppEvents } from './app.common';

var storeFunc = null;
class SignalRApp {
    constructor(url) {
        this.url = url;
        this.connection = null;
        this.isConnected = false;        
    }

    Init(options) {

        if(options.isTokenRequired === true) {
            options.accessTokenFactory = () => options.getToken();
        }
        
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(options.url, options)
            .configureLogging(signalR.LogLevel.Information)
            .build();
    

        //Receive Data
        //Reading the raw response
        var self = this;
        storeFunc = self.connection.processIncomingData;
        self.connection.processIncomingData = function (data) {
            console.log('processIncomingData'+ data);
            storeFunc.call(self.connection, data);
        }
        debugger;
        AppEvents.emit('Init', options);
    }
    
    
    OnConnect() {
        var self = this;
        self.connection.start()
            .then(function () {
                AppEvents.emit('OnConnect', { url: self.url });
            })
            .catch(function (err) {
                return console.error(err.toString());
            });
    }
    
    OnSend(options) {
        var methodArguments = new Array();
        methodArguments = options.methodArguments;
    
        AppEvents.emit('OnSend', options);
        this.connection.invoke(options.methodName, ...methodArguments)
            .catch(function (err) {
                return console.log(err);
            });
    }
    
    OnReceive(callback) {
        this.connection.on("ReceiveData", function (data) {
            callback(data);
        });
    }
    
    OnDisConnect() {
        this.connection.stop()
            .then(function () {
                console.log('Disconnected');
                AppEvents.emit('OnDisconnected');
            })
            .catch(function (err) {
                return console.error(err.toString());
            });
    }
}

export { SignalRApp }