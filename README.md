# Sideburns
> **Sideburns** is a [Meteor](http://meteor.com) package which give you templates for React in a familiar [Blaze API](https://www.meteor.com/blaze) (giving you **helpers**, **events**, **onRendered**, **onCreated** etc) with a subset of [Spacebars](https://github.com/meteor/meteor/blob/devel/packages/spacebars/README.md) (aka Meteor flavored Handlebars).

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

### Simple component

<table width="100%"><thead><tr><th width="50%">Sideburns (.html.jsx)</th><th width="50%">React comparison</th></tr></thead><tbody><tr><td valign="top"><pre lang="jsx"><code>

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

### Component with reactivity

<table width="100%"><thead><tr><th width="50%">Sideburns (.html.jsx)</th><th width="50%">React comparison</th></tr></thead><tbody><tr><td valign="top"><pre lang="jsx"><code>

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

<pre class="rich-diff-level-zero">Page <span class="pl-k rich-diff-level-one">=</span> React.createClass({displayName<span class="pl-k rich-diff-level-one">:</span> <span class="pl-s rich-diff-level-one"><span class="pl-pds">"</span>Page<span class="pl-pds">"</span></span>,
  mixins<span class="pl-k rich-diff-level-one">:</span> [ReactMeteorData],
  <span class="pl-en rich-diff-level-one">getMeteorData</span><span class="pl-k rich-diff-level-one">:</span> <span class="pl-k rich-diff-level-one">function</span>() {
    <span class="pl-v rich-diff-level-one">this</span>.<span class="pl-c1 rich-diff-level-one">name</span> <span class="pl-k rich-diff-level-one">=</span> <span class="pl-k rich-diff-level-one">new</span> <span class="pl-en rich-diff-level-one">ReactiveVar</span>(<span class="pl-s rich-diff-level-one"><span class="pl-pds">'</span>React<span class="pl-pds">'</span></span>);
    <span class="pl-k rich-diff-level-one">return</span> {
      <span class="pl-en rich-diff-level-one">name</span>() {
        <span class="pl-k rich-diff-level-one">return</span> <span class="pl-v rich-diff-level-one">this</span>.<span class="pl-c1 rich-diff-level-one">name</span>.get();
      }
    }
  },
  <span class="pl-en rich-diff-level-one">componentDidMount</span><span class="pl-k rich-diff-level-one">:</span> <span class="pl-k rich-diff-level-one">function</span>() {
    <span class="pl-c1 rich-diff-level-one">setTimeout</span>(()<span class="pl-k rich-diff-level-one"> =&gt;</span> {
      <span class="pl-v rich-diff-level-one">this</span>.<span class="pl-c1 rich-diff-level-one">name</span>.set(<span class="pl-s rich-diff-level-one"><span class="pl-pds">'</span>React: With a Blaze API<span class="pl-pds">'</span></span>);
    }, <span class="pl-c1 rich-diff-level-one">2000</span>);
  },
  <span class="pl-en rich-diff-level-one">render</span><span class="pl-k rich-diff-level-one">:</span> <span class="pl-k rich-diff-level-one">function</span>() {
    <span class="pl-k rich-diff-level-one">return</span> (<span class="pl-k rich-diff-level-one">&lt;</span>div className<span class="pl-k rich-diff-level-one">=</span><span class="pl-s rich-diff-level-one"><span class="pl-pds">"</span>page<span class="pl-pds">"</span></span><span class="pl-k rich-diff-level-one">&gt;</span>
      Hello {<span class="pl-v rich-diff-level-one">this</span>.<span class="pl-c1 rich-diff-level-one">data</span>.<span class="pl-c1 rich-diff-level-one">name</span>}
    <span class="pl-k rich-diff-level-one">&lt;</span>/div<span class="pl-k rich-diff-level-one">&gt;</span>);
  }
});</pre>

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

```jsx
Page = React.createClass({displayName: "Page",
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    this.name = new ReactiveVar('React');
    return {
      name() {
        return this.name.get();
      }
    }
  },
  componentDidMount: function() {
    setTimeout(() => {
      this.name.set('React: With a Blaze API');
    }, 2000);
  },
  render: function() {
    return (<div className="page">
      Hello {this.data.name}
    </div>);
  }
});
```
-->

### Component with click handler

<table width="100%"><thead><tr><th width="50%">Sideburns (.html.jsx)</th><th width="50%">React comparison</th></tr></thead><tbody><tr><td valign="top"><pre lang="jsx"><code>

<pre><span class="pl-k">&lt;</span>template name<span class="pl-k">=</span><span class="pl-s"><span class="pl-pds">"</span>Page<span class="pl-pds">"</span></span><span class="pl-k">&gt;</span>
  <span class="pl-k">&lt;</span>div <span class="pl-k">class</span><span class="pl-k">=</span><span class="pl-s"><span class="pl-pds">"</span>page<span class="pl-pds">"</span></span><span class="pl-k">&gt;</span>
    Hello world
  <span class="pl-k">&lt;</span>/div<span class="pl-k">&gt;</span>
<span class="pl-k">&lt;</span>/template<span class="pl-k">&gt;</span>

Template.Page.events({
  <span class="pl-s"><span class="pl-pds">'</span><span class="pl-en">click .page</span><span class="pl-pds">'</span></span><span class="pl-k">:</span> <span class="pl-k">function</span>() {
    <span class="pl-en">console</span><span class="pl-c1">.log</span>(<span class="pl-s"><span class="pl-pds">'</span>Hello world<span class="pl-pds">'</span></span>);
  }
});</pre>

</code></span></pre></td><td valign="top"><pre lang="jsx" class="vicinity rich-diff-level-zero"><code>

<pre>Page <span class="pl-k">=</span> React.createClass({displayName<span class="pl-k">:</span> <span class="pl-s"><span class="pl-pds">"</span>Page<span class="pl-pds">"</span></span>,
  <span class="pl-en">clickEvent</span><span class="pl-k">:</span> <span class="pl-k">function</span>() {
    <span class="pl-en">console</span><span class="pl-c1">.log</span>(<span class="pl-s"><span class="pl-pds">'</span>Hello world<span class="pl-pds">'</span></span>);
  },
  <span class="pl-en">render</span><span class="pl-k">:</span> <span class="pl-k">function</span>() {
    <span class="pl-k">return</span> (<span class="pl-k">&lt;</span>div className<span class="pl-k">=</span><span class="pl-s"><span class="pl-pds">"</span>page<span class="pl-pds">"</span></span> onClick<span class="pl-k">=</span>{<span class="pl-v">this</span>.clickEvent}<span class="pl-k">&gt;</span>
      Hello world
    <span class="pl-k">&lt;</span>/div<span class="pl-k">&gt;</span>);
  }
});</pre>

</code></pre></td></tr></tbody></table>

<!--
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
});
```

```jsx
Page = React.createClass({displayName: "Page",
  clickEvent: function() {
    console.log('Hello world');
  },
  render: function() {
    return (<div className="page" onClick={this.clickEvent}>
      Hello world
    </div>);
  }
});
```
-->

### Iterating through a list with click handlers

#### Sideburns (.html.jsx)

```jsx
<template name="Page">
  <ul>
    {{#each person in people}}
    <li class="item {{isSelected}}">{{person.name}}</li>
    {{/each}}
  </ul>
</template>

Template.Page.onCreated(function() {
  this.selected = new ReactiveVar(false);
});

Template.Page.helpers({
  people() {
    return People.find();
  },

  isSelected: function(context) {
    return this.selected.get() == context._id ? 'active' : '';
  }
});

Template.Page.events({
  'click ul li': function(context, event) {
    this.selected.set(context._id);
  }
});
```

#### React comparison

```jsx
Page = React.createClass({displayName: "Page",
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    this.selected = new ReactiveVar(false);
    return {
      people() {
        return People.find();
      },
    
      isSelected: (context) => {
        return this.selected.get() == context._id ? 'active' : '';
      }
    }
  },
  clickHandler: function(context, event) {
    this.selected.set(context._id);
  },
  render: function() {
    return (<ul>{
      this.data.people.map((person, index) => {
        return (<li key={index} onClick={this.clickHandler.bind(this, person)} 
          className={'item ' + this.data.isSelected.call(this, person)}>{person.name}</li>);
      });
    }</ul>);
  }
});
```

<!-- Table template for comparisons.
<table width="100%"><thead><tr><th width="50%">Sideburns (.html.jsx)</th><th width="50%">React comparison</th></tr></thead><tbody><tr><td valign="top"><pre lang="jsx"><code>

</code></span></pre></td><td valign="top"><pre lang="jsx" class="vicinity rich-diff-level-zero"><code>

</code></pre></td></tr></tbody></table>
-->

## Features

- [x] .html.jsx templates
- [x] Blaze helpers
- [ ] Blaze helper context
- [x] Blaze onCreated
- [x] Blaze events
- [ ] Blaze onRendered
- [ ] Blaze onDestroyed
- [ ] Blaze autorun
- [ ] Blaze subscribe
- [x] Spacebars {{helper}} (SafeString)
- [x] Spacebars {{{helper}}} (raw HTML)
- [x] Spacebars "{{helper}}" (SafeString – In Attribute Values)
- [x] Spacebars ={{helper}} (SafeString – Dynamic Attribute Value)
- [ ] Spacebars {{#if}}
- [ ] Spacebars {{#each}}
- [x] Spacebars {{#each in}}
- [ ] Spacebars {{#with}}
- [ ] Spacebars {{#with}}
- [ ] Spacebars {{#unless}}
