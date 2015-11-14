Events = class {
  static reset() {
    this._events = {};
  }

  static addEvents(template, events) {
    this._events = this._events || {};
    this._events[template] = this._events[template] || {};
    // Extend the existing events map with new events and allow override.
    _.extend(this._events[template], events);
  }

  static getEvents(template) {
    if (this._events && this._events[template]) {
      return this._events[template];
    }
    return {};
  }
};

class BlazeEventsFinder extends BabelCompiler {
  processFilesForTarget(inputFiles) {
    super(inputFiles);
    Events.reset();

    // Pass through all javascript files.
    inputFiles.forEach(function (inputFile) {
      // Find and evaluate events to enable adding them to a template.
      let events = "";
      let original = inputFile.getContentsAsString();
      EventsRegex.forEach(function (obj) {
        if (!obj.replace) {
          let found = original.match(obj.regex);
          events += (found || []).join("\n");
        }
        else {
          events = events.replace(obj.regex, obj.replace);
        }
      });

      // Compile ES6 features.
      var babelOptions = Babel.getDefaultOptions();
      babelOptions.sourceMap = false;
      try {
        var result = Babel.compile(events, babelOptions);
      } catch (e) {}

      // Finally evaluate matched and replaced expression containing all events
      // for the templates.
      if (result && result.code) {
        eval(result.code);
      }
    });
  }
}

Plugin.registerCompiler({
  extensions: ['js'],
}, function () {
  return new BlazeEventsFinder();
});
