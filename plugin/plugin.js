/**
 * Helper class to compile Blaze templates to React Components.
 */
ReactCompiler = class {
  /**
   * Parse templates to React Component.
   * @param  {String} code Contents of the template file.
   * @return {String}      Code that in runtime creates a React Component for the Template.
   */
  static parse(code) {
    return ReactCompiler.parseTemplates(code);
  }

  /**
   * Parse template markup to React flavored jsx code (used by the template parser).
   * @param  {String} className The name of the template.
   * @param  {String} markup    The markup of the template.
   * @return {String}           Valid jsx markup.
   */
  static parseMarkup(className, markup) {
    ReactRegex.forEach(function (obj) {
      markup = markup.replace(obj.regex, obj.replace);
    });

    return markup;
  }

  /**
   * Find and parse templates in html files.
   * @param  {String} content The content of the file.
   * @return {String}        Valid jsx and code generating React Components for the Templates found in the content.
   */
  static parseTemplates(content) {
    TemplateRegex.forEach(function (obj) {
      content = content.replace(obj.regex, obj.replace);
    });

    return content;
  }
}

/**
 * The compiler used by the toolchain plugin, initally parsing templates to
 * react components and overrideable template functions and finally transpiling
 * ES2015 to valid JavaScript.
 */
class ReactTemplateCompiler extends BabelCompiler {
  constructor() {
    super({react: true});
  }

  processFilesForTarget(inputFiles) {
    inputFiles.forEach((inputFile) => {
      let content = inputFile.getContentsAsString();
      inputFile.getContentsAsString = function() {
        let parsed = ReactCompiler.parse(content);
        console.log(parsed);
        return parsed;
      };
    });

    super(inputFiles);
  }
}

Plugin.registerCompiler({
  extensions: ['html'],
  isTemplate: true
}, () => new ReactTemplateCompiler()
);
