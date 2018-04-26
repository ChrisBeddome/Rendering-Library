// ex: creates 1 h1 and 2 p tags within a container div

var child1 = new Component({
  type: "h1",
  id: "headline",
  text: "I'm a Header!",
});

var child2 = new Component({
  type: "p",
  id: "paragraph",
  classes: ["paraClass"],
  text: "I'm a paragraph!",
  children: []
});

var child3 = new Component({
  type: "p",
  id: "paragraph",
  classes: ["paraClass"],
  text: "I'm a paragraph too!",
  children: []
});

var parent = new Component({
  type: "div",
  id: "container",
  classes: ["cont", "main"],
  text: "",
  children: [child1, child2, child3]
});

parent.render(document.body);

child3.update({
  text: "I'm different now"
});


// EXAMPLE 2 add a bunch of buttons to parent component with event listeners

var container = new Component();

for (var i = 0; i < 100; i++) {

  var button = new Component({
    type: "button",
    id: "button" + i,
    classes: ["test1", "test2"],
    text: "Button " + (i + 1),
    listener: [
      "click",
      function() {
        this.update({
          text: "I was clicked!"
        });
      }
    ]
  })

  container.children.push(button);
}

container.render();