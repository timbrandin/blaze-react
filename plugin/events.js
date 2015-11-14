const fs = Npm.require('fs');

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

  /**
   * Helper class that finds events before the templates are compiled to enable
   * injecting them in the markup for the defined selectors.
   */
  static findEventsInCode(code) {
    Events.reset();

    // Find and evaluate events to enable adding them to a template.
    let events = "";
    EventsRegex.forEach(function (obj) {
      if (!obj.replace) {
        let found = code.match(obj.regex);
        events += (found || []).join("\n");
      }
      else {
        events = events.replace(obj.regex, obj.replace);
      }
    });

    // Evaluate replaced expressions to add events into memory.
    eval(events);
  }
};

// Hook into fs.writeFile to read the events map into memory.
const original = fs.writeFile;
fs.writeFile = function(file, data) {
  let options = JSON.parse(data);
  if (options && options.map && options.map.sources) {
    // Simple test to only look for events in .js files.
    for(let i in options.map.sources) {
      if (/\.js$/.test(options.map.sources[i])) {
        Events.findEventsInCode(options.code);
        break;
      }
    }
  }
  original.apply(fs, arguments);
}
