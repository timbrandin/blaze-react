# Blaze React (devel)
> **Blaze React** is a [Meteor](http://meteor.com) package which give you templates for React in a familiar [Blaze API](https://www.meteor.com/blaze) (giving you **helpers**, **events**, **onRendered**, **onCreated** etc) with a subset of [Spacebars](https://github.com/meteor/meteor/blob/devel/packages/spacebars/README.md) (aka Meteor flavored Handlebars).

**Why React?** – Well it gives us faster pageloads, SEO without Spiderable, accessibility for users without JavaScript and general improvements in page rendering speed.

**Why a Blaze/Spacebars API?** – Well it's way easier to learn and get started with, can't argue against that right (see examples below)?


## Installation

```bash
meteor add timbrandin:blaze-react
```

## Demo

* **XXX** Add new demo here... I.e. Microscope.
* http://spacedropcms.org (https://github.com/spacedrop/spacedrop)
* http://timbrandin.com (https://github.com/timbrandin/timbrandin)

## Getting started

> Currently this project is in flux until we have a preview-release, partly due to the announcement from MDG in developing a similar package that builds templates for React, but we think we can give this to you earlier than within a few months and with support for most of Blaze 1 features and Spacebars. 

> **XXX** Add example code to get started.

## Features

- [x] .html to ReactTemplate
- [x] Blaze helpers
- [x] Blaze helper context (with the data from the context)
- [x] Blaze onCreated @TwinTailsX
- [x] Blaze events
- [x] Blaze onRendered @TwinTailsX
- [x] Blaze onDestroyed @TwinTailsX
- [x] Blaze autorun @TwinTailsX @facespacey
- [x] Blaze subscribe @TwinTailsX @facespacey
- [x] Spacebars {{helper}} (SafeString)
- [ ] Spacebars {{helper ..args}} (SafeString) (with arguments)
- [x] Spacebars {{{helper}}} (raw HTML)
- [ ] Spacebars {{{helper ..args}}} (raw HTML) (with arguments)
- [x] Spacebars "{{helper}}" (SafeString – In Attribute Values)
- [x] Spacebars ={{helper}} (SafeString – Dynamic Attribute Value)
- [x] Spacebars {{#if}}
- [x] Spacebars {{else}} {{/if}}
- [x] Spacebars {{else}} {{/if}} (nested)
- [x] Spacebars {{#each}}
- [x] Spacebars {{#each in}}
- [x] Spacebars {{else}} {{/each}}
- [x] Spacebars {{else in}} {{/each}}
- [x] Spacebars {{else}} {{/each}} (nested)
- [ ] Spacebars {{#with}}
- [ ] Spacebars {{else}} {{#with}}
- [ ] Spacebars {{else}} {{#with}} (nested)
- [x] Spacebars {{#unless}}
- [x] Spacebars {{else}} {{/unless}}
- [ ] Spacebars {{else}} {{/unless}} (nested)
- [ ] Spacebars {{#helper}}} (Block helpers)
- [ ] Spacebars {{#helper ...args}}} (Block helpers with arguments)
- [ ] Spacebars {{/helper}}} (Block helpers)
