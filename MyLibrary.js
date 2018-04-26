

// call new Component() to create compontent
// takes object as argument with following optional parameters:

// type: <STRING> type of DOM element DEFAULTS TO DIV

// id: <STRING> id value

// classes: <ARRAY of STRINGS> class names

// text: <STRING> textContent of element

// children <ARRAY of COMPONENTS> children components, in order of desired DOM position --- DEFAULTS to EMPTY ARRAY

// listener <ARRAY> [event, function]
// "this" bound to COMPONENT on all listeners
// if you wish to reference the DOM element that event was fired on, use this.ref

// call render method to render compontent and all its child components
// argument: html node where compontent is to be rendered

// call update method to update component
// takes same parameters as Component constructor 
// will be re-rendered in DOM

function Component(params) {

  //default type
  this.type = "div";

  //default children = empty array
  this.children = [];

  //initalize object with specified parameters
  for (var property in params) {
    if (params.hasOwnProperty(property)) {
      this[property] = params[property];
    }
  }

  this.render = function(target) {

    if (target instanceof Component) {
      //ref for adding child
      var targetComponent = target;
      target = target.ref;
    }

    //default target is body tag
    if (!target) {
      target = document.body;
    }

    //create element, DIV if not specified
    var element = document.createElement(this.type);

    //loop through compontent properties and add to element
    for (var property in this) {
      if (this.hasOwnProperty(property)) {
        if (property === "id") {
          element.id = this.id;
        } else if (property === "classes") {
          for (var i = 0; i < this.classes.length; i++) {
            element.classList.add(this.classes[i]);
          }
        } else if (property === "text") {
          element.textContent = this.text;
        } else if (property === "src") {
          element.src = this.src;
        } else if (property === "listener") {
          element.addEventListener(this.listener[0], this.listener[1].bind(this), false);
        }
      }
    }

    //if not top level component
    if (this.parent) {
      //if position of compontent unspecified, default to last position
      if (arguments[2] == null) {
        target.appendChild(element);
      }

      //if specified, add element to position
      else {
        if (this.position === 0) {
          target.prepend(element);
        } else if (this.position === this.parent.children.length - 1) {
          target.appendChild(element);
        } else {
          target.insertBefore(element, target.children[this.position]);
        }
      }
    } 
    
    //if top level component
    else {
      if (arguments[2] == null) {
        target.appendChild(element);
      }

      else {
        if (arguments[2] === 0) {
          target.prepend(element);
        } else if (arguments[2] === this.containerElement.children.length - 1) {
          target.appendChild(element);
        } else {
          target.insertBefore(element, target.children[arguments[2]]);
        }
      }
    }
    
    //DOM reference to component
    this.ref = element;
    //DOM reference to parent element
    this.containerElement = this.ref.parentElement;

    //if called from parent, parent object passed in as second argument
    //if component is child of another component, store parent and positional information
    if (arguments[1]) {
      this.parent = arguments[1];
      this.position = arguments[1].children.indexOf(this);
    }

     //render all children of this element
    if (this.hasOwnProperty("children")) {
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].render(this.ref, this);
      }
    } 

    if (targetComponent && targetComponent.children.indexOf(this) === -1) {
      targetComponent.children.push(this);
    }
  };

  //pass in object containing paramaters to change
  //automatically updates and re-renders component
  this.update = function(params) {

    for (var property in params) {
      if (params.hasOwnProperty(property)) {
        this[property] = params[property];
      }
    }

    //if top level component, must remember position via DOM positions
    if (!this.parent) {
      var position = Array.prototype.slice.call(this.containerElement.children).indexOf(this.ref);
    }
  
    //remove component from dom
    this.containerElement.removeChild(this.ref);

    if (this.parent) {
      //update parent to contain updated component
      this.parent.children[this.position] = this;
      //render component is same place
      this.render(this.containerElement, false, this.position);
    } else {
      this.render(this.containerElement, false, position);
    }
  }
}

