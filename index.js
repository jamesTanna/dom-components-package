const defineComponent = ({ title, template, styles, functionality, props, defaultStateValue, attributeChange, onInit }) => {

    return () => {
        const componentTemplate = document.createElement('template');
        componentTemplate.innerHTML = `
                <style>
                    ${styles}
                </style>
                ${template}
            `;

        class Component extends HTMLElement {
            constructor() {
                super();
                this._state = defaultStateValue;
                this.render();
            }

            get state() {
                return this._state;
            }
            set state(value) {
                this._state = value;
                this.render();
            }

            get hello() {
                return 'Hello';
            }

            static get observedAttributes() {
                return props;
            }

            attributeChangedCallback(attribute, oldValue, newValue) {
                if (attributeChange) {
                    attributeChange({ component: this.shadowRoot, attribute, newValue, oldValue, state: this.state });
                }
            }

            connectedCallback() {
                if (onInit) {
                    onInit({ component: this.shadowRoot, state: this.state });
                }
            }

            render() {
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(componentTemplate.content.cloneNode(true));
                const propData = {};
                if (props) {
                    props.forEach(prop => {
                        propData[prop] = this.getAttribute(prop);
                    })
                }
                if (functionality) {
                    functionality({ component: this.shadowRoot, props: propData, state: this.state });
                }
            }
        }



        window.customElements.define(title, Component);
    }
}
const defineEvent = (eventName, data, options) => {
    let eventOptions;
    if (options) {
        options.composed = true;
        if (data) {
            options.detail = data;
        }
        eventOptions = options;
    } else {
        if (data) {
            eventOptions = { composed: true, detail: data }
        } else {
            eventOptions = { composed: true }
        }

    }
    const event = new CustomEvent(eventName, eventOptions);
    return event;
}

module.exports = {
    defineComponent,
    defineEvent,
}