import * as R from 'ramda';
import * as utils from './utils.js';

class Name extends HTMLElement {
    static get observedAttributes() {
        return ['name'];
    }

    attributeChangedCallback(name, _, newValue) {
        if (utils.isName(name)) this.innerHTML = R.concat('Hello ', `${newValue}!`);
    }

    connectedCallback() {
        this.innerHTML = 'Hello Adam!';
    }
}

customElements.define('x-name', Name);
