# Sideburns
> **Sideburns** is a [Meteor](http://meteor.com) package which give you templates for React with the [Blaze API](https://www.meteor.com/blaze) (giving you **helpers**, **events**, **onRendered**, **onCreated** etc).

We've also fixed **indentation** and **class** (instead of className) for better readability of your component markup.

## Installation

```bash
meteor add timbrandin:sideburns
```

## Demo

* http://jsx-templating.meteor.com/ (https://github.com/timbrandin/meteor-iosmorphic-react-templating)
* http://spacetalkapp.com (https://github.com/SpaceTalk/SpaceTalk-Homepage)
* http://timbrandin.com (https://github.com/timbrandin/resumeteor)

## Getting started

### Simple example, a component named Page.

<table width="100%"><thead><tr><th width="50%">Sideburns (.html.jsx)</th><th width="50%">React (.jsx)</th></tr></thead><tbody><tr><td valign="top"><pre lang="jsx"><code>

<span class="pl-k rich-diff-level-one">&lt;</span>template name<span class="pl-k rich-diff-level-one">=</span><span class="pl-s rich-diff-level-one"><span class="pl-pds">"</span>Page<span class="pl-pds">"</span></span><span class="pl-k rich-diff-level-one">&gt;</span>
  <span class="pl-k rich-diff-level-one">&lt;</span>div <span class="pl-k rich-diff-level-one">class</span><span class="pl-k rich-diff-level-one">=</span><span class="pl-s rich-diff-level-one"><span class="pl-pds">"</span>page<span class="pl-pds">"</span></span><span class="pl-k rich-diff-level-one">&gt;</span>
    Hello world
  <span class="pl-k rich-diff-level-one">&lt;</span>/div<span class="pl-k rich-diff-level-one">&gt;</span>
<span class="pl-k rich-diff-level-one">&lt;</span>/template<span class="pl-k rich-diff-level-one">&gt;

</code></span></pre></td><td valign="top"><pre lang="jsx" class="vicinity rich-diff-level-zero"><code>

Page <span class="pl-k rich-diff-level-one">=</span> React.createClass({displayName<span class="pl-k rich-diff-level-one">:</span> <span class="pl-s rich-diff-level-one"><span class="pl-pds">"</span>Page<span class="pl-pds">"</span></span>,
  <span class="pl-en rich-diff-level-one">render</span><span class="pl-k rich-diff-level-one">:</span> <span class="pl-k rich-diff-level-one">function</span>() {
    <span class="pl-k rich-diff-level-one">return</span> (<span class="pl-k rich-diff-level-one">&lt;</span>div className<span class="pl-k rich-diff-level-one">=</span><span class="pl-s rich-diff-level-one"><span class="pl-pds">"</span>page<span class="pl-pds">"</span></span><span class="pl-k rich-diff-level-one">&gt;</span>
      Hello world
    <span class="pl-k rich-diff-level-one">&lt;</span>/div<span class="pl-k rich-diff-level-one">&gt;</span>);
  }
});

</code></pre></td></tr></tbody></table>

<!--
```jsx
<template name="Page">
  <div class="page">
    Hello world
  </div>
</template>
```
-->

<!--
```jsx
Page = React.createClass({displayName: "Page",
  render: function() {
    return (<div className="page">
      Hello world
    </div>);
  }
});
```
-->

### Advanced example, with helpers and onCreated

<table width="100%"><thead><tr><th width="50%">Sideburns (.html.jsx)</th><th width="50%">React (.jsx)</th></tr></thead><tbody><tr><td valign="top"><pre lang="jsx"><code>

<pre class="vicinity rich-diff-level-zero">
<span class="pl-k rich-diff-level-one">&lt;</span>template name<span class="pl-k rich-diff-level-one">=</span><span class="pl-s rich-diff-level-one"><span class="pl-pds">"</span>Page<span class="pl-pds">"</span></span><span class="pl-k rich-diff-level-one">&gt;</span>
  <span class="pl-k rich-diff-level-one">&lt;</span>div <span class="pl-k rich-diff-level-one">class</span><span class="pl-k rich-diff-level-one">=</span><span class="pl-s rich-diff-level-one"><span class="pl-pds">"</span>page<span class="pl-pds">"</span></span><span class="pl-k rich-diff-level-one">&gt;</span>
    Hello {{name}}
  <span class="pl-k rich-diff-level-one">&lt;</span>/div<span class="pl-k rich-diff-level-one">&gt;</span>
<span class="pl-k rich-diff-level-one">&lt;</span>/template<span class="pl-k rich-diff-level-one">&gt;</span>

Template.Page.onCreated(<span class="pl-k rich-diff-level-one">function</span>() {
  <span class="pl-v rich-diff-level-one">this</span>.<span class="pl-c1 rich-diff-level-one">name</span> <span class="pl-k rich-diff-level-one">=</span> <span class="pl-k rich-diff-level-one">new</span> <span class="pl-en rich-diff-level-one">ReactiveVar</span>(<span class="pl-s rich-diff-level-one"><span class="pl-pds">'</span>React<span class="pl-pds">'</span></span>);
});

Template.Page.helpers({
  <span class="pl-en rich-diff-level-one">name</span>() {
    <span class="pl-k rich-diff-level-one">return</span> <span class="pl-v rich-diff-level-one">this</span>.<span class="pl-c1 rich-diff-level-one">name</span>.get();
  }
});

Template.Page.onRendered(<span class="pl-k rich-diff-level-one">function</span>() {
  <span class="pl-c1 rich-diff-level-one">setTimeout</span>(()<span class="pl-k rich-diff-level-one"> =&gt;</span> {
    <span class="pl-v rich-diff-level-one">this</span>.<span class="pl-c1 rich-diff-level-one">name</span>.set(<span class="pl-s rich-diff-level-one"><span class="pl-pds">'</span>React: With a Blaze API<span class="pl-pds">'</span></span>);
  }, <span class="pl-c1 rich-diff-level-one">2000</span>);
});</pre>

</code></span></pre></td><td valign="top"><pre lang="jsx" class="vicinity rich-diff-level-zero"><code>

</code></pre></td></tr></tbody></table>

<!--
```jsx
// {{name}} is parsed into {this.data.name}.
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

// Same as onComponentDidMount.
Template.Page.onRendered(function() {
  setTimeout(() => {
    this.name.set('React: With a Blaze API');
  }, 2000);
});
```
-->

### Events example, adding onClick

```jsx
<template name="Page">
  <div class="page">
    Hello world
  </div>
</template>

Template.Page.events({
  'click .page': function(event, data, props) {
    console.log('Hello world from ' + this.displayName); // Prints "Hello world from Page".
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
    let component = this;
    return (<div className="page" onClick={this.events['click .page'].bind(component, event, this, this.props)}>
      Hello world
    </div>);
  }
});
```

## Features

- [x] .jsx templates
- [x] .jsx **helpers**
- [x] .jsx **onCreated**
- [x] .jsx **events**
- [x] .jsx **onRendered**
- [x] .jsx **onDestroyed**
- [x] .jsx **autorun**
- [x] .jsx **subscribe**
