var cheerio = Npm.require('cheerio');

ReactTemplate = class {
  constructor(source) {
    this._source = source;
  }

  static compile(className, markup) {
    markup = ReactTemplate.appendEventMap(className, markup);

    ReactRegex.forEach(function (obj) {
      markup = markup.replace(obj.regex, obj.replace);
    });

    return markup;
  }

  static appendEventMap(className, markup) {
    var events = Events.getEvents(className);

    // Cheerio doesn't like tags without a trailing end.
    markup = markup.replace(/<((?!br)[^\>]+)\/>/ig, '<$1></$1>');
    // Load cheerio with the markup.
    let $ = cheerio.load(markup);

    // Add all events to the matched selectors.
    for (let key in events) {
      var selectors = key.split(',');
      for (let selector of selectors) {
        let [event, select] = selector.trim().split(/\s(.+)?/);

        // Get the react event name or use custom name.
        var eventName = ReactEvents[event] ? ReactEvents[event] : event;
        // Remove duplicate listeners.
        $(select).removeAttr(eventName);
        // Append new listener.
        $(select).attr(eventName, `{RT.event(component, "${key}", context)}`);
      }
    }

    // Finally let cheerio create our markup to string.
    markup = $.html();
    // Cheerio adds qoutes on all attributes, React don't want that so we have
    // to remove those quotes.
    markup = markup.replace(/([\"\'])(\{[\w\W]+?(\{[\w\W]+?\})*\})\1/g, '$2');

    return markup;
  }

  parse(source) {
    let jsx = source;

    TemplateRegex.forEach(function (obj) {
      jsx = jsx.replace(obj.regex, obj.replace);
    });

    return jsx;
  }

  toString() {
    return this.parse(this._source);
  }
}

class ReactTemplateCompiler {
  processFilesForTarget(inputFiles) {
    inputFiles.forEach(function (inputFile) {
      let original = inputFile.getContentsAsString();
      var inputFilePath = inputFile.getPathInPackage();
      var outputFilePath = inputFile.getPathInPackage();
      var fileOptions = inputFile.getFileOptions();
      var toBeAdded = {
        sourcePath: outputFilePath,
        path: outputFilePath.replace('.jsx.html', '.jsx.js'),
        data: original,
        hash: inputFile.getSourceHash(),
        sourceMap: null,
        bare: !! fileOptions.bare
      };

      source = "" + new ReactTemplate(original);
      const result = ReactTemplateCompiler.transpile(source, inputFile);
      toBeAdded.data = result.code;
      toBeAdded.hash = result.hash;
      toBeAdded.sourceMap = result.map;

      inputFile.addJavaScript(toBeAdded);
    });
  }

  setDiskCacheDirectory(cacheDir) {
    Babel.setCacheDir(cacheDir);
  }

  static transpile(source, inputFile) {
    var self = {extraFeatures: {react: true}};
    var excludedFileExtensionPattern = /\.es5\.js$/i;
    var inputFilePath = inputFile.getPathInPackage();
    var outputFilePath = inputFile.getPathInPackage();
    var fileOptions = inputFile.getFileOptions();

    // If you need to exclude a specific file within a package from Babel
    // compilation, pass the { transpile: false } options to api.addFiles
    // when you add that file.
    if (fileOptions.transpile !== false &&
        // If you need to exclude a specific file within an app from Babel
        // compilation, give it the following file extension: .es5.js
        ! excludedFileExtensionPattern.test(inputFilePath)) {

      var targetCouldBeInternetExplorer8 =
        inputFile.getArch() === "web.browser";

      self.extraFeatures = self.extraFeatures || {};
      if (! self.extraFeatures.hasOwnProperty("jscript")) {
        // Perform some additional transformations to improve
        // compatibility in older browsers (e.g. wrapping named function
        // expressions, per http://kiro.me/blog/nfe_dilemma.html).
        self.extraFeatures.jscript = targetCouldBeInternetExplorer8;
      }

      var babelOptions = Babel.getDefaultOptions(self.extraFeatures);

      babelOptions.sourceMap = true;
      babelOptions.filename = inputFilePath;
      babelOptions.sourceFileName = "/" + inputFilePath;
      babelOptions.sourceMapName = "/" + outputFilePath + ".map";

      // Capture jsx failures in compiling.
      try {
        var result = Babel.compile(source, babelOptions);
      } catch (e) {
        if (e.loc) {
          // Babel error
          inputFile.error({
            message: e.message,
            sourcePath: inputFile.getPathInPackage(),
            line: e.loc.line,
            column: e.loc.column
          });

          console.log('\n\n\n');
          console.log(inputFile.getPathInPackage());
          console.log('=====================');
          console.log(inputFile.getContentsAsString());
          const lines = ("" + jsx).split(/\n/g);
          _.each(lines, (line, i) => console.log((i+1) + '  ', line));

          return;
        } else {
          throw e;
        }
      }

      return result;
    }
  }
};

Plugin.registerCompiler({
  extensions: ['html'],
  isTemplate: true
}, () => new ReactTemplateCompiler()
);
