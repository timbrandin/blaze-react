const fs = Npm.require('fs');

/**
 * Class to manage eventmaps in memory.
 */
Events = class {
  static reset(filename) {
    if (this._files && this._files[filename]) {
      delete this._files[filename];
    }
  }

  static addEvents(filename, template, events) {
    this._files = this._files || {};
    this._files[filename] = this._files[filename] || {};

    this._files[filename][template] = this._files[filename][template] || {};
    // Extend the existing events map with new events and allow override.
    _.extend(this._files[filename][template], events);
  }

  static getEvents(template) {
    if (this._files) {
      let events = {};
      _.each(this._files, (file) => {
        if (file[template]) {
          _.extend(events, file[template]);
        }
      })
      return events;
    }
    return {};
  }

  /**
   * Helper class that finds events before the templates are compiled to enable
   * injecting them in the markup for the defined selectors.
   */
  static findEventsInCode(filename, code) {
    // Clear the memory of previous events for this file.
    Events.reset(filename);

    // Find and evaluate events to enable adding them to a template.
    let events = "";
    EventsRegex.forEach(function (obj) {
      if (!obj.replace) {
        let found = code.match(obj.regex);
        events += (found || []).join("\n");
      }
      else {
        events = events.replace(obj.regex, obj.replace.bind({filename: filename}));
      }
    });

    // Evaluate replaced expressions to add event-maps into memory.
    try {
      eval(events);
    } catch(e) {}
  }

  static parseFile(data) {
    let options = JSON.parse(data);
    if (options && options.map && options.map.sources) {
      // Simple test to only look for events in .js files.
      for(let i in options.map.sources) {
        let filename = options.map.sources[i];
        if (/\.js$/.test(filename)) {
          Events.findEventsInCode(filename, options.code);
          break;
        }
      }
    }
  }
};

// Read files on startup or when the package is added to meteor.
const programPath = `${process.env.PWD}/.meteor/local/build/programs/server`;
const programFile = fs.readFileSync(`${programPath}/program.json`, 'utf8');
const files = JSON.parse(programFile).load;
_.each(files, (file) => {
  if (/\.js\.map$/.test(file.sourceMap)) {
    let data = fs.readFileSync(`${programPath}/${file.path}`, 'utf8');
    Events.findEventsInCode(file.path, data);
  }
});

// Hook into fs.writeFile to read the events map into memory when written to file.
if (!fs._writeFile) {
  fs._writeFile = fs.writeFile;
  fs.writeFile = function(file, data) {
    Events.parseFile(data);
    fs._writeFile.apply(fs, arguments);
  }
}

// Hook into fs.readFileSync to read the events map into memory from the
// ecmascript plugin cache.
if (!fs._readFileSync) {
  fs._readFileSync = fs.readFileSync;
  fs.readFileSync = function(file, options) {
    // Simple test to only look for events in the files from the plugin cache for the ecmascript package.
    if (/\.meteor\/local\/plugin\-cache\/ecmascript\//.test(file)) {
      let data = fs._readFileSync.apply(this, arguments);
      Events.parseFile(data);
      return data;
    }
    else {
      return fs._readFileSync.apply(this, arguments);
    }
  }
}
