# JSX templating
  
> JSX templating is a [Meteor](http://meteor.com) package which builds upon [@dgreensp](https://github.com/dgreensp)'s [JSX build plugin](https://github.com/meteor/react-packages/blob/master/packages/jsx) and [@stubailo](https://github.com/stubailo)'s [react-packages](https://github.com/meteor/react-packages) but goes a few step further and implements Blaze's **helpers** and **onCreated** to showcase why that API makes it so much easier/[**AWESOME™**](https://github.com/meteor/react-packages/issues/15#issuecomment-116911066). And also, as I'm a markup nazi, I like **indentation** and **class** (instead of className).

## Installation

JSX templating is on [atmosphere](https://atmospherejs.com/timbrandin/jsx-templating).

To install on Meteor 0.9 or later:

```bash
meteor add timbrandin:jsx-templating
```

## Demo

* https://github.com/timbrandin/meteor-iosmorphic-react-templating
* http://jsx-templating.meteor.com/

## Getting started

###Simple example, create a component named Page.

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

### Advanced example, helpers and onCreated

This example requires you've added ReactiveVar:
```bash
meteor add reactive-var
```

```jsx
<template name="Page">
  <div class="page">
    Hello {this.data.name}
  </div>
</template>

Template.Page.onCreated(function() {
  let component = this;
  component.name = new ReactiveVar('React');

  component.componentDidMount = function() {
    setTimeout(function() {
      component.name = new ReactiveVar('Blaze');
    }, 2000);
  };
});

Template.Page.helpers({
  name: function() {
    return this.name.get();
  }
});
```

> For this to work, keep the template, helpers and onCreated in this file for now, I haven't explored into the realm of allowing separate files.

## Features

- [x] .jsx templates
- [x] .jsx template **helpers**
- [x] .jsx template **onCreated**
- [ ] .jsx template **events**
- [ ] .jsx template **onRendered**
- [ ] .jsx template **onDestroyed**
