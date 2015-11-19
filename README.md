# Blaze React
> **Blaze React** is a [Meteor](http://meteor.com) package which give you templates for React in a familiar [Blaze API](https://www.meteor.com/blaze) (giving you **helpers**, **events**, **onRendered**, **onCreated** etc) with a subset of [Spacebars](https://github.com/meteor/meteor/blob/devel/packages/spacebars/README.md) (aka Meteor flavored Handlebars).

**Why React?** – Well it gives us faster pageloads, SEO without Spiderable, accessibility for users without JavaScript and general improvements in page rendering speed.

**Why a Blaze/Spacebars API?** – Well it's way easier to learn and get started with, can't argue against that right (see examples below)?


## Installation

```bash
meteor add timbrandin:blaze-react
```

## Demo

* Add new demo here... I.e. Microscope.
* http://spacedropcms.org (https://github.com/spacedrop/spacedrop)
* http://timbrandin.com (https://github.com/timbrandin/timbrandin)

## Getting started

> Add example code to get started.

## Features

- [x] .html.jsx templates
- [x] Blaze helpers
- [ ] Blaze helper context (with the data from the context)
- [x] Blaze onCreated @TwinTailsX
- [x] Blaze events
- [x] Blaze onRendered @TwinTailsX
- [x] Blaze onDestroyed @TwinTailsX
- [x] Blaze autorun @TwinTailsX @facespacey
- [x] Blaze subscribe @TwinTailsX @facespacey
- [x] Spacebars {{helper}} (SafeString)
- [x] Spacebars {{{helper}}} (raw HTML)
- [x] Spacebars "{{helper}}" (SafeString – In Attribute Values)
- [x] Spacebars ={{helper}} (SafeString – Dynamic Attribute Value)
- [x] Spacebars {{#if}}
- [x] Spacebars {{else}} {{/if}}
- [ ] Spacebars {{#each}}
- [x] Spacebars {{#each in}}
- [ ] Spacebars {{else}} {{/each}}
- [ ] Spacebars {{#with}}
- [ ] Spacebars {{else}} {{#with}}
- [x] Spacebars {{#unless}}
- [x] Spacebars {{else}} {{/unless}}
