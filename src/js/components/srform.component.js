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
        <div class="container">
            <form class="form-horizontal">
                <fieldset>
                    
                    <div class="form-group">
                        <div class="row">
                            <div class="col-sm-2">
                                <label for="inputUrl" class="col-form-label label-title">Hub Address</label>
                            </div>
                            <div class="col-sm-8">
                                <input type="text" class="form-control inputUrl" id="inputUrl" placeholder="Url" value="https://localhost:5001/Test/Hub" />
                                <span class="error" aria-live="polite"></span>
                            </div>

                            <div class="col-sm-2 checkbox-container" id="logger-chk-container">                               
                                <label  class="col-sm-2 col-form-label mdl-switch  mdl-js-switch mdl-js-ripple-effect" for="chk-loggerView">
                                    <input type="checkbox" id="chk-loggerView" class="col-sm-1 col-form-label mdl-switch__input" value="Logger View" />
                                    <!--<span  class="mdl-switch__label">Logging</span> -->                                                
                                </label>
                                <!-- If we add tool tip, then extra border will appear on click
                                <div class="mdl-tooltip" data-mdl-for="logger-chk-container">Logging</div> -->
                            </div>
                        </div>
                    </div>


                    <div class="form-group onconnect" id="auth-container">
                        <div class="row">
                            <div class="col-sm-2 ">
                                <label for="authHeader" class="col-form-label label-title">Authentication Header</label>
                            </div>
                            <div class="col-sm-8">
                                <input type="text" class="form-control" id="authHeader" placeholder="Token" disabled />
                                <span class="error" aria-live="polite"></span>
                            </div>
                            <div class="col-sm-2">
                                <div class="form-check form-check-inline">
                                    <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="chk-req-token">
                                        <input type="checkbox" id="chk-req-token" class="mdl-checkbox__input chk-req-token" />
                                        <span class="mdl-checkbox__label chk-text">Token Required</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group onconnect scale-in-ver-top" ${divStyle} id="protocol-support">
                        <div class="row">
                            <div class="col-sm-2">
                                <label class="col-form-label label-title">Transport Type</label>
                            </div>
                            <div class="col-sm-10">
                                <div class="form-check form-check-inline">
                                    <!--
                                        <input type="checkbox" id="chk-ws" class="form-check-input protocol-support" value="ws" checked/>
                                            <label class="form-check-label" for="chk-ws">
                                            WebSocket
                                        </label>
                                    -->
                                    <!--
                                        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="chk-ws">
                                            <input type="checkbox" id="chk-ws" class="mdl-checkbox__input protocol-support" value="ws" checked />
                                            <span class="mdl-checkbox__label chk-text">WebSocket</span>
                                        </label>
                                    -->
                                    
                                    <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="chk-ws">
                                        <input type="radio" id="chk-ws" class="mdl-radio__button protocol-support" name="transportType" value="ws" checked>
                                        <span class="mdl-radio__label">WebSocket</span>
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                <!--
                                    <input type="checkbox" id="chk-lp" class="form-check-input protocol-support" disabled checked value="lp" />
                                        <label class="form-check-label" for="chk-lp">
                                        Long Pooling
                                    </label>
                                -->
                                <!--
                                    <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="chk-lp">
                                        <input type="checkbox" id="chk-lp" class="mdl-checkbox__input protocol-support" disabled checked value="lp" />
                                        <span class="mdl-checkbox__label chk-text">Long Polling</span>
                                    </label>
                                -->

                                    <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="chk-lp">
                                        <input type="radio" id="chk-lp" class="mdl-radio__button protocol-support" name="transportType"  value="lp">
                                        <span class="mdl-radio__label">Long Polling</span>
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                <!--
                                    <input type="checkbox" id="chk-sse"  class="form-check-input protocol-support" value="sse" />
                                        <label class="form-check-label" for="chk-sse">
                                            Server Send Event
                                    </label>
                                -->
                                <!--
                                    <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="chk-sse">
                                        <input type="checkbox" id="chk-sse" class="mdl-checkbox__input protocol-support" checked value="sse" />
                                        <span class="mdl-checkbox__label chk-text">Server Send Event</span>
                                    </label>
                                -->
                                    <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="chk-sse">
                                        <input type="radio" id="chk-sse" class="mdl-radio__button protocol-support" name="transportType" value="sse">
                                        <span class="mdl-radio__label">Server Send Event</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group scale-in-ver-top" ${divStyle} id="content-negotiation">
                        <div class="row">
                            <div class="col-sm-2">
                                <label class="col-form-label label-title">Skip Negotiation</label>
                            </div>
                            <div class="col-sm-10">
                                <div class="form-check">                                    
                                    <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="chk-skip-negotiation">
                                        <input type="checkbox" id="chk-skip-negotiation" class="mdl-switch__input skip-negotiation">
                                        <span class="mdl-switch__label"></span>
                                    </label>
                                    <p class="skip-negotiation-desc">
                                    Skip negotiation only supported when the WebSockets transport is the 
                                    only enabled transport. This setting can't be enabled 
                                    when using the Azure SignalR Service.</p>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="row">
                            <div class="col-sm-10 offset-sm-2">
                                <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary connectbtn" id="btn-connect" value="Connect" />
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group onconnect">
                        <div class="row">
                            <div class="col-sm-2">
                                <label for="inputServerMethod" class="col-form-label label-title">Server Method</label>
                            </div>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputServerMethod" placeholder="Server Method Name" />
                                <span class="error" aria-live="polite"></span>
                            </div>
                        </div>
                    </div>

                    <div class="form-group onconnect">
                        <div class="row">
                            <div class="col-sm-2">
                                <label for="inputRequestData" class="col-form-label label-title">Request Payload</label>
                            </div>
                            <div class="col-sm-10">                                            
                                <input type="button" value="Add Argument" id="inputRequestData" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary  btn-add-argument" />
                                <div>
                                    <div class="col-sm-10">
                                        <div id="method-arguments" class="form-group method-arguments"></div>
                                    </div>
                                </div>
                            </div>                            
                        </div>
                    </div>
                    <div class="form-group row onconnect scale-in-ver-top">
                        <div class="col-sm-4 offset-sm-2 btn-group">
                            <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary  btn-send-payload" id="btn-send-payload" value="Send"/>
                            <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary  disconnectbtn" id="btn-disconnectbtn" value="Disconnect" />
                        </div>
                    </div>
                    <div class="form-group onconnect scale-in-ver-top">
                        <div class="row">
                            <div class="col-sm-2">
                                <label for="inputResponseData" class="col-form-label label-title">Response Payload</label>
                            </div>
                            <div class="col-sm-10">
                                <div rows="2" class="logger-text" id="inputResponseData"></div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group logger-container loggerView" style="display:none" id="logger-container">                                    
                        
                        <!--<div class="bg-gray" id="loggerView">-->
                            <div class="row">
                                <div class="col-sm-1">
                                    <div class="col-form-label logger-header">Logs</div>
                                </div>
                                <div class="col-sm-2 offset-sm-9">
                                    <div class=""> 
                                        <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary " id="btn-clearlogs" value="Clear" />
                                        <br/>
                                    </div>
                                    
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="container logger-text" id="app-logs"></div>
                                </div>
                            </div>
                            <!--</div>-->
                    </div>
                </fieldset>
            </form>
        <div>
        `;
    }
}

if(!window.customElements.get("sr-form")) {
    window.customElements.define("sr-form", SrFormComponent);  
}
