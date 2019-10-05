import * as appSignalR from './lib/app.signalr';

var sr = null;
class AppLogic {

    constructor() {
        this.isTokenRequired = false;
        this.isBasicView = true;
    }

    Init(options) {

        if(this.isBasicView !== true && this.isTokenRequired === true) {
            //adding new property to options object
            options["isTokenRequired"] = true;
        } 
        else {
            options["isTokenRequired"] = false;
        }
        
        sr = new appSignalR.SignalRApp(options.url);
        sr.Init(options);        
    }
    
    OnConnect() {
        sr.OnConnect();
    }
    
    OnSend(options) {
        sr.OnSend(options);
    }
    
    OnReceive(callback) { 
        sr.OnReceive(callback);
    }
    
    OnDisConnect() { 
        sr.OnDisConnect();
    }

    EnableAuth() {
        this.isTokenRequired = true;
    }

    DisableAuth() {
        this.isTokenRequired = false;
    }

    IsAuthEnabled() {
        return this.isTokenRequired;
    }

    GetCurrentView() {
        return this.isBasicView;
    }

    SetCurrentViewAsBasic() {
        this.isBasicView = true;
    }

    SetCurrentViewAsAdvance() {
        this.isBasicView = false;
    }
}

export { AppLogic }