# JSX templating

> JSX templating is a [Meteor](http://meteor.com) package which builds upon [@dgreensp](https://github.com/dgreensp)'s [JSX build plugin](https://github.com/meteor/react-packages/blob/master/packages/jsx) and [@stubailo](https://github.com/stubailo)'s [react-packages](https://github.com/meteor/react-packages) but goes a few step further and implements Blaze's **helpers** and **onCreated** to showcase why that API makes it so much easier/[***AWESOME™***](https://github.com/meteor/react-packages/issues/15#issuecomment-116911066). And also, as I'm a markup nazi, I like **indentation** and **class** (instead of className).

## Installation

JSX templating is on [atmosphere](https://atmospherejs.com/timbrandin/jsx-templating).

To install on Meteor 0.9 or later:

```bash
meteor add timbrandin:jsx-templating
```

## Demo

* http://jsx-templating.meteor.com/ (https://github.com/timbrandin/meteor-iosmorphic-react-templating)
* http://spacetalkapp.com (https://github.com/SpaceTalk/SpaceTalk-Homepage)
* http://timbrandin.com (https://github.com/timbrandin/resumeteor)

## Getting started

### Simple example, create a component named Page.

```jsx
<template name="Page">
  <div class="page">
    Hello world
  </div>
</template>
```

Will build into:

```jsx
Page = React.createClass({displayName: "Page",
  render: function() {
    return (<div className="page">
      Hello world
    </div>);
  }
});
```

> Notice! For this to work use ```.html.jsx``` instead of ```.jsx``` on your template files.

### Advanced example, with helpers and onCreated

This example requires you've added ReactiveVar:
```bash
meteor add reactive-var
```

```jsx
<template name="Page">
  <div class="page">
    Hello {{name}}
  </div>
</template>

Template.Page.onCreated(function() {
  this.name = new ReactiveVar('React');
});

Template.Page.helpers({
  name() {
    return this.name.get();
  }
});

// Same as onComponentDidMount or componentDidMount.
Template.Page.onRendered(function() {
  setTimeout(() => {
    this.name.set('React: With a Blaze API');
  }, 2000);
});
```

> For this to work, keep the template, helpers and onCreated in **one** file for now, I haven't explored into the realm of allowing separate files.

### Events example, adding onClick

```jsx
<template name="Page">
  <div class="page">
    Hello world
  </div>
</template>

Template.Page.events({
  'click .page': function() {
    console.log('Hello world');
  }
})
```

Will build into:

```jsx
Page = React.createClass({displayName: "Page",
  events: {
    'click .page': function(event, data, props) {
      console.log('Hello world from ' + this.displayName); // Prints "Hello world from Page".
    }
  },
  render: function() {
    return (<div className="page" onClick={this.events['click .page'].bind(this, event, this.data, this.props)}>
      Hello world
    </div>);
  }
});
```

## Features

- [x] .jsx templates
- [x] .jsx template **helpers**
- [x] .jsx template **onCreated**
- [x] .jsx template **events**
- [x] .jsx template **onRendered**
- [x] .jsx template **onDestroyed**
- [x] .jsx template **autorun**
- [x] .jsx template **subscribe**
