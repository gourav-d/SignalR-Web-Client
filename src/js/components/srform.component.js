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
                                        <div class="checkbox-container float-right">
                                            <input type="checkbox" id="chk-loggerView"  value="Logger View" />
                                            <label for="chk-loggerView" class="col-sm-2 col-form-label">Logging</label>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group row">
                                        <label for="inputUrl" class="col-sm-2 col-form-label">Service Endpoint</label>
                                        <div class="col-sm-10">
                                            <input type="text" class="form-control inputUrl" id="inputUrl" placeholder="Url" value="https://localhost:5001/Test/OneHub">
                                        </div>
                                    </div>


                                    <div class="form-group row onconnect" id="auth-container">
                                        <label for="authHeader" class="col-sm-2 col-form-label">Authentication Header</label>
                                        <div class="col-sm-10 offset-sm-2">
                                            <input type="text" class="form-control" id="authHeader" placeholder="Token" disabled/>
                                        </div>
                                        <div class="col-sm-10 offset-sm-2">
                                            <div class="form-check form-check-inline">
                                                <input type="checkbox" id="chk-req-token" class="form-check-input chk-req-token"/>
                                                <label class="form-check-label" for="chk-req-token">
                                                    Token Required
                                                </label>
                                                
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group row onconnect" ${divStyle} id="protocol-support">
                                        <label class="col-sm-2 col-form-label">Protocol Supported</label>
                                        <div class="col-sm-10 offset-sm-2">
                                            <div class="form-check form-check-inline">
                                                <input type="checkbox" id="chk-ws" class="form-check-input protocol-support" value="ws" checked/>
                                                <label class="form-check-label" for="chk-ws">
                                                    WebSocket
                                                </label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input type="checkbox" id="chk-lp" class="form-check-input protocol-support" disabled checked value="lp" />
                                                <label class="form-check-label" for="chk-lp">
                                                    Long Pooling
                                                </label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input type="checkbox" id="chk-sse"  class="form-check-input protocol-support" checked value="sse" />
                                                <label class="form-check-label" for="chk-sse">
                                                    Server Send Event
                                                </label>
                                            </div>
                                        </div>
                                     </div>

                                     <div class="form-group row">
                                        <div class="col-sm-10 offset-sm-2">
                                            <input type="button" class="btn btn-primary connectbtn" id="btn-connect" value="Connect" />
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
                                            <input type="button" value="Add Argument" id="inputRequestData" class="btn-primary btn-xs btn-add-argument" />
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
                                        <div class="col-sm-2 offset-sm-2 btn-group">
                                            <input type="button" class="btn btn-primary btn-send-payload" id="btn-send-payload" value="Send"/>
                                            <input type="button" class="btn btn-primary disconnectbtn" id="btn-disconnectbtn" value="Disconnect" />
                                        </div>
                                    </div>
                                    <div class="form-group row logger-container" style="display:none" id="logger-container">
                                        <fieldset class="bg-gray" id="loggerView">
                                            <legend class="col-form-label">
                                            <h3>Logs</h3>
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
