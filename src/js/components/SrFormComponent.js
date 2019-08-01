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
        console.log('connected!');
        this.render();
    }

    disconnectedCallback() {
        console.log('disconnected!');
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        this.render();
      }

    render() {

        var divStyle = this.getType === "advance" ? "style='display:block'" : "style='display:none'";
        this.innerHTML = ` 
                        <form>
                                <fieldset>
                                    <div class="form-group row">
                                        <label for="inputUrl" class="col-sm-2 col-form-label">Service Endpoint</label>
                                        <div class="col-sm-10">
                                            <input type="text" class="form-control" id="inputUrl" placeholder="Url">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-sm-10 offset-sm-2">
                                            <input type="button" class="btn btn-primary" id="btn-connect" value="Connect" />
                                        </div>
                                    </div>

                                    <div class="form-group row" ${divStyle}>
                                        <label class="col-sm-2 col-form-label">Protocol Supported</label>
                                        <div class="col-sm-10 offset-sm-2">
                                            <div class="form-check form-check-inline">
                                                <input type="checkbox" id="chk-ws" class="form-check-input" value="ws" checked/>
                                                <label class="form-check-label" for="chk-ws">
                                                    WebSocket
                                                </label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input type="checkbox" id="chk-lp" class="form-check-input" disabled checked value="lp" />
                                                <label class="form-check-label" for="chk-lp">
                                                    Long Pooling
                                                </label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input type="checkbox" id="chk-sse"  class="form-check-input" checked value="sse" />
                                                <label class="form-check-label" for="chk-sse">
                                                    Server Send Event
                                                </label>
                                            </div>
                                        </div>
                                     </div>
                                    
                                    <div class="form-group row">
                                        <label for="inputServerMethod" class="col-sm-2 col-form-label">Server Method</label>
                                        <div class="col-sm-10">
                                            <input type="text" class="form-control" id="inputServerMethod" placeholder="Server Method Name">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                            <label for="inputRequestData" class="col-sm-2 col-form-label">Request Payload</label>
                                            <div class="col-sm-10">
                                                <textarea rows="3" class="form-control" id="inputRequestData" placeholder="Request Payload"></textarea>
                                            </div>
                                    </div>
                                    <div class="form-group row">
                                            <label for="inputResponseData" class="col-sm-2 col-form-label">Response Payload</label>
                                            <div class="col-sm-10">
                                                <textarea rows="3" class="form-control" id="inputResponseData" placeholder="Response Payload"></textarea>
                                            </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-sm-10 offset-sm-2">
                                            <button type="button" class="btn btn-primary">Send</button>
                                        </div>
                                    </div>
                                </fieldset>
                            </form>
        `;


    }
}

if(!window.customElements.get("sr-form")) {
    window.customElements.define("sr-form", SrFormComponent);
}