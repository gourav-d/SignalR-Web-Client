import * as srFrom from './srform';


class SrFormComponent extends HTMLElement {
    constructor() {
        super();
    }
    
    static get observedAttributes() {
        return ['type'];
    }
    get getType() {
         return this.getAttribute('type');
    }

    connectedCallback() {
        this.render();
        srFrom.Init();
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        this.render();
      }

    render() {

        var divStyle = this.getType === "advance" ? "style='display:block'" : "style='display:none'";
        this.innerHTML = ` 
        
                        <form>
                                <fieldset>
                                    <div class="form">

                                    </div>
                                    
                                    <div class="form-group row">
                                        <label for="inputUrl" class="col-sm-2 col-form-label">Hub Address</label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control inputUrl" id="inputUrl" placeholder="Url" value="https://localhost:5001/Test/Hub">
                                        </div>

                                        <div class="col-sm-2 checkbox-container float-right" id="logger-chk-container">                               
                                            <label class="col-sm-2 col-form-label mdl-switch  mdl-js-switch mdl-js-ripple-effect" for="chk-loggerView">
                                                <input type="checkbox" id="chk-loggerView" class="mdl-switch__input col-sm-2 col-form-label" value="Logger View">
                                                <span class="mdl-switch__label"></span>
                                            </label>
                                            <div class="mdl-tooltip mdl-tooltip--large" for="logger-chk-container">Logging</div>
                                        </div>
                                    </div>


                                    <div class="form-group row onconnect" id="auth-container">
                                        <label for="authHeader" class="col-sm-2 col-form-label">Authentication Header</label>
                                        <div class="col-sm-10 offset-sm-2">
                                            <input type="text" class="form-control" id="authHeader" placeholder="Token" disabled/>
                                        </div>
                                        <div class="col-sm-10 offset-sm-2">
                                            <div class="form-check form-check-inline">
                                                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="chk-req-token">
                                                    <input type="checkbox" id="chk-req-token" class="mdl-checkbox__input chk-req-token">
                                                    <span class="mdl-checkbox__label">Token Required</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group row onconnect" ${divStyle} id="protocol-support">
                                        <label class="col-sm-2 col-form-label">Transport Type</label>
                                        <div class="col-sm-10 offset-sm-2">
                                            <div class="form-check form-check-inline">
                                                <!--<input type="checkbox" id="chk-ws" class="form-check-input protocol-support" value="ws" checked/>
                                                <label class="form-check-label" for="chk-ws">
                                                    WebSocket
                                                </label>-->
                                                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="chk-ws">
                                                    <input type="checkbox" id="chk-ws" class="mdl-checkbox__input protocol-support" value="ws" checked>
                                                    <span class="mdl-checkbox__label">WebSocket</span>
                                                </label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                            <!--<input type="checkbox" id="chk-lp" class="form-check-input protocol-support" disabled checked value="lp" />
                                                <label class="form-check-label" for="chk-lp">
                                                    Long Pooling
                                                </label>-->
                                                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="chk-lp">
                                                    <input type="checkbox" id="chk-lp" class="mdl-checkbox__input protocol-support" disabled checked value="lp">
                                                    <span class="mdl-checkbox__label">Long Pooling</span>
                                                </label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                            <!--<input type="checkbox" id="chk-sse"  class="form-check-input protocol-support" checked value="sse" />
                                                <label class="form-check-label" for="chk-sse">
                                                    Server Send Event
                                                </label>-->
                                                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="chk-sse">
                                                    <input type="checkbox" id="chk-sse" class="mdl-checkbox__input protocol-support" checked value="sse">
                                                    <span class="mdl-checkbox__label">Server Send Event</span>
                                                </label>
                                            </div>
                                        </div>
                                     </div>

                                     <div class="form-group row">
                                        <div class="col-sm-10 offset-sm-2">
                                           <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent connectbtn" id="btn-connect" value="Connect" />
                                        </div>
                                    </div>
                                    
                                    <div class="form-group row onconnect">
                                        <label for="inputServerMethod" class="col-sm-2 col-form-label">Server Method</label>
                                        <div class="col-sm-10 offset-sm-2">
                                            <input type="text" class="form-control" id="inputServerMethod" placeholder="Server Method Name">
                                        </div>
                                    </div>
                                    <div class="form-group row onconnect">
                                        <label for="inputRequestData" class="col-sm-2 col-form-label">Request Payload</label>
                                        <div class="col-sm-10 offset-sm-2">                                            
                                            <input type="button" value="Add Argument" id="inputRequestData" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent  btn-add-argument" />
                                            <div id="method-arguments" class="form-group method-arguments"></div>
                                        </div>
                                    </div>
                                    <div class="form-group row onconnect">
                                            <label for="inputResponseData" class="col-sm-2 col-form-label">Response Payload</label>
                                            <div class="col-sm-10 offset-sm-2">
                                                <textarea rows="2" class="form-control" id="inputResponseData" placeholder="Response Payload"></textarea>
                                            </div>
                                    </div>
                                    <div class="form-group row onconnect ">
                                        <div class="col-sm-4 offset-sm-2 btn-group">
                                            <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent  btn-send-payload" id="btn-send-payload" value="Send"/>
                                            <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent  disconnectbtn" id="btn-disconnectbtn" value="Disconnect" />
                                        </div>
                                    </div>
                                    <div class="form-group row logger-container scale-in-ver-top" style="display:none" id="logger-container">                                    
                                        <fieldset class="bg-gray" id="loggerView">
                                            <div class="text-right"> 
                                                <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent " id="btn-clearlogs" value="Clear" />
                                                <br/>
                                            </div>
                                            <legend class="col-form-label">
                                            <h4>Logs</h4>
                                            </legend>
                                        <div class="container" id="app-logs">
                                            
                                        <div>
                                        </fieldset>
                                    </div>
                                </fieldset>
                            </form>
        `;
    }
}

if(!window.customElements.get("sr-form")) {
    window.customElements.define("sr-form", SrFormComponent);  
}
