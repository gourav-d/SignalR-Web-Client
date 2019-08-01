class HeaderComponent extends HTMLElement {
    constructor() {
        super();
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
        this.innerHTML = `      

        <div id="tab-header" class="container">
            <div class="panel panel-primary">
                <ul class="nav nav-tabs justify-content-end nav-justified" id="tabheader">
                    <li class="nav-item active">
                        <a class="nav-link active" data-toggle="tab"  href="#basicview">Basic</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#advanceview">Advance</a>
                    </li>
                </ul>

                <div class="tab-content container clearfix tabcontent">
                    <div id="basicview" class="tab-pane active">
                        <h2>Basic</h2>
                        <sr-form></sr-form>
                    </div>

                    <div id="advanceview" class="tab-pane fade">
                        <h2>Advance</h2>
                        <sr-form type="advance"></sr-form>
                    </div>

                </div>
            </div>
        </div>
        `;
    }
}

if(!window.customElements.get("basic-src-view")) {
    window.customElements.define("basic-src-view", HeaderComponent);
}