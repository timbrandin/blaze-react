# Change Log

### v1.0.0

* After a suggestion from @facespacey we're consolidating timbrandin:react-templates and timbrandin:sideburns to new package timbrandin:blaze-react.

### v0.3.2

* Correct helper contexts solving from (https://github.com/peerlibrary/meteor-blaze-components/blob/master/lookup.js#L94):
  * 2. look up a binding by traversing the lexical view hierarchy inside the current template

### v0.3.1

* Blaze onCreated @TwinTailsX
* Blaze onRendered @TwinTailsX
* Blaze onDestroyed @TwinTailsX
* Blaze autorun @TwinTailsX @facespacey
* Blaze subscribe @TwinTailsX @facespacey

### v0.3.0

* Using the new toolchain and transpiling `.html` and `.js` files instead of `.html.jsx`
* Code for components can be split up in files instead as before in one file, closer to how Blaze works.

### v0.2.4

* Now including React ES6 JSX files instead of compiling to ES5 JS files.

### v0.2.3

* Improved variable checking for helpers.
* Improved logging output on failure.

### v0.2.2

* Implemented {{#if}}, {{#if}} {{else}}, {{#unless}} and {{#unless}} {{else}}
* Fixed a bug with double linebreaks
* Improved logging on error with line numbers.

### v0.2.1

* Added possibility for custom events in event-map.
* Fixed a bug with component inclusions.

### v0.2.0

> Project renamed to **Sideburns** (timbrandin:sideburns), formerly known as **JSX Templates** (timbrandin:jsx-templates).

* Blaze events
* Spacebars {{helper}} (SafeString)
* Spacebars {{{helper}}} (raw HTML)
* Spacebars "{{helper}}" (SafeString – In Attribute Values)
* Spacebars ={{helper}} (SafeString – Dynamic Attribute Value)
* Spacebars {{#each in}}

### v0.1.3

* .html.jsx templates
* Blaze helpers
* Blaze onCreated
