import '@webcomponents/webcomponentsjs/webcomponents-bundle';//WebComponent Pollyfill
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import '../css/main.css';
import './components/srform.component';
import './components/app.component';


console.log("Hello Webpack111");



// class HelloComponent extends HTMLElement {
//     static get observedAttributes() {
//       return ['data-name'];
//     }
  
//     // custom methods
//     render() {
//       this.innerHTML = `Hello ${this.name}`;
//     }
  
//     get name() {
//       return this.getAttribute('data-name');
//     }
  
//     // lifecycle hooks
//     connectedCallback() {
//       this.render();
//     }
  
//     attributeChangedCallback(attrName, oldVal, newVal) {
//       this.render();
//     }
//   }

//   if(!window.customElements.get('hello-component')){
//     // add into the 'real' dom as a valid tag
//     window.customElements.define('hello-component', HelloComponent);
//   }