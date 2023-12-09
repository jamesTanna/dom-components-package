# DOM Components Package
## A Library / framework for web components api

DOM Components Package is a library that you can use to create reactive web components. It is lightweight and provides you with a lot of contol over your web components.

Example App source code: [This link](https://github.com/jamesTanna/sample-dom-components-project/tree/master)

Example Live website url: [This link](https://dom-components-package-ex.cyclic.app/)

***It can be used by both people with knowledge and without knowledge of web components as this package does the web components part for you.***

### Making a web component
Use `defineComponent` function to make a web component

```javascript
//importing 

const { defineComponent } = require('dom-components-package')

//defining component

const App = defineComponent({
    //your tag name
    title: "app-root",
    //your innerHTML template
    template: "<h1>Hello World</h1>"
})

//Import All your components and initaialize like this in your main file

App()
```

Now embed this into your html like this
```html
<body>
    <app-root></app-root>
</body>
```


### Making multiple components

Lets add a Header component

```javascript
const { defineComponent } = require('dom-components-package')

const Header = defineComponent({
    //your tag name
    title: "app-header",
    //your innerHTML template
    template: "<h1>Header</h1>"
})

module.exports = Header
```

Now import it into your App.js file

```javascript
const { defineComponent } = require('dom-components-package')
const Header = require("./components/Header.js")

const App = defineComponent({
    title: "app-root",
    //embed into your app like this
    template: "<app-header></app-header>"
})

//Import All your components and initaialize like this in your main file

App()
Header()
```

## Define Components function arguments

The `defineComponents` function takes in an object with one or more required properties

* `title`: string - Name of the tag you will use for your component. Required.
* `template`: string - The HTML template. You can add slots here. Required.
* `styles`: string - The styles for the elements in your component.
* `props`: array of strings - The names of all attributes including dataset attributes or props of your component.
* `defaultStateValue`: any - The default value for your state.
* `functionality`: function - What you want to do in the constructor function of your component. Explained in detail later.
* `attributeChange`: function - What you want to do when an attribute or prop for your component changes. Content of attributeChangedCallback. Explained in detail later.
* `onInit`: function - Used when component is mounted. Content of connectedCallback. Explained in detail later.


### Methods of `defineComponent`

* `functionality({ component, props, state })` is used for initializing your component. Takes in an object with one or all of the following properties
    * `component`: The Shadow Root of the component. Use for DOM mainpulation inside component. Works like the real DOM.
    ```javascript
    const { defineComponent } = require('dom-components-package')
    
    const App = defineComponent({
        //your tag name
        title: "app-root",
        //your innerHTML template
        template: "<h1>Hello World</h1>",
        //styles
        styles: `
        h1{
            color: red;
        }
        `,
        //functionality
        functionality: ({ component }) => {
            //Selection of element h1
            const h1 = component.querySelector("h1")
            
            //Changing color
            component.style.color = "green"
        }
    })
    
    App()
    ```
    * `props`: The value of all props of your component. You must define the `props` property of the `defineComponent` first.
    
    ```javascript
    const { defineComponent } = require('dom-components-package')
    
    const Header = defineComponent({
        //your tag name
        title: "app-header",
        //your innerHTML template
        template: "<h1></h1>",
        //name of props
        props: ["title"],
        //implementing
        functionality: ({ component,  props: { title } }) => {
            console.log( title )
        }
    })
    
    module.exports = Header
    ```
    
    Now add the title in App.js
    ```javascript
    const { defineComponent } = require('dom-components-package')
    const Header = require("./components/Header.js")
    
    const App = defineComponent({
        title: "app-root",
        //add props as html attributes
        template: '<app-header title="hello world"></app-header>'
    })
    
    //Import All your components and initaialize like this in your main file
    
    App()
    Header()
    ```
    #### To add data types such as arrays and objects, using dataset attributes and passing JSON stringified data is recommended. Let us see this with an example.

    ```javascript
    const { defineComponent } = require('dom-components-package')
        
        const Header = defineComponent({
            //your tag name
            title: "app-header",
            //your innerHTML template
            template: "<h1></h1>",
            //name of props
            props: ["data-title"],
            //implementing
            functionality: ({  props }) => {
                //Make sure you use JSON data.
                console.log( JSON.parse(props["data-title"]) )
            }
        })
        
        module.exports = Header
    ```
    
    This is how you pass JSON data in data attribute.
    
    ```javascript
    const { defineComponent } = require('dom-components-package')
    const Header = require("./components/Header.js")

    const title = {
        name: "Hello World"
    }
    
    const App = defineComponent({
        title: "app-root",
        //add props as html attributes
        template: `<app-header data-title='${JSON.stringify(title)}'></app-header>`
    })
    
    //Import All your components and initaialize like this in your main file
    
    App()
    Header()
    ```
    
    * `state`: The state of your component. More details on this topic are provided later.
    
* `attributeChange({ component, attribute, newValue, oldValue, state })` is used to do something when an attribute value is set for the first time or changed. It can be used only when you define the `props` property of `defineComponent` options. Fires off for change in any attribute or props. Takes on or more of these properties

    * `component`: The Shadow Root of the component. Use for DOM manipulation.
    * `attribute`: The name of the attribute or prop that changed.
    * `newValue`: The new value of the attribue or prop.
    * `oldValue`: The old value of attribute or prop.
    * `state`: The state of your component.

#### Lets see an example using `attributeChange` .

``` javascript
const { defineComponent } = require('dom-components-package')
        
        const Header = defineComponent({
            //your tag name
            title: "app-header",
            //your innerHTML template
            template: "<h1></h1>",
            //name of props
            props: ["data-count"],
            //implementing attributeChange
            attributeChange: ({ component, attribute, newValue, oldValue, state }) => {
                console.log(component, attribute, newValue, oldValue, state);
            }
        })
        
        module.exports = Header
```
#### Now in App.js we will add a button and on clicking the button we will change the value.

```javascript
const { defineComponent } = require('dom-components-package')
    const Header = require("./components/Header.js")

    let count = 0
    
    const App = defineComponent({
        title: "app-root",
        //add props as html attributes
        template: `<app-header data-number='${count}'></app-header> <button id="btn">Click me</button>`,
        functionality: ({ component }) => {
            const btn = component.querySelector("#btn")
            btn.addEventListener("click", () => {
                count += 1
                component.querySelector("app-header").setAttribute("data-number", count)
            })
        }
    })
    
    //Import All your components and initaialize like this in your main file
    
    App()
    Header()
```

* `onInit({ component, state })` fires off as soon as the component mounts the webpage. It can take one or more of the following properties.
    * `component`: The Shadow Root of the component. Use for DOM manipulation.
    * `state`: The state of your component.

#### Lets see an example

```javascript
const { defineComponent } = require('dom-components-package')


const App = defineComponent({
    title: "app-root",
    template: "<h1>Hello World</h1>",
    onInit: () => {
        console.log("App works!")
    }
})


App()
```

## State management in the library.
You can get or set the state like any other variable, but you cannot use high order array methods on this.You can set the default value for the state by defining the `defaultStateValue` property of defineComponent.

#### Lets see an example

```javascript
const { defineComponent } = require('dom-components-package')


const App = defineComponent({
    title: "app-root",
    template: `
        <h1>Hello World</h1>
        <button id="btn">State Management</button>
    `,
    defaultStateValue: 0,
    functionality: ({ component, state }) => {
        component.querySelector("#btn").addEventListener("click", () => {
            state = state + 1
            console.log(state)
        })
    }
})


App()
```

# Using custom events
To define a custom event, you can use the `defineEvent` function to define a custom event for your component.

## Define Event arguments
The `defineComponents` takes one or more of these arguments in the following manner.

* `eventName`: string - Name of the custom event.
* `data`: any - Takes in any data you want to pass in through the event. This data is accessible through the detail property of the event object.
* `options`: object - Any event options required to set.

#### Lets see an example

```javascript
const { defineComponent, defineEvent } = require('dom-components-package')

const Header = defineComponent({
    title: "app-header",
    template: "<h1>Header</h1>",
    functionality: ({ component }) => {
        const event = defineEvent({eventName: "header-event", data: "Hi"})
        // use the dispatchEvent method to dispatch the event
        component.dispatchEvent(event)
    }
})

module.exports = Header
```

Lets catch it in here
```javascript
const { defineComponent } = require('dom-components-package')
const Header = require("./components/Header.js")

const App = defineComponent({
    title: "app-root",
    template: "<app-header></app-header>",
    functionality: ({ component }) => {
        component.querySelector("app-header").addEventListener("header-event", e => {
            console.log(e.detail)
        })
    }
})

App()
Header()
```
