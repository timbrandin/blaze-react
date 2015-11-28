var XRegExp = Npm.require('xregexp');

var str = `
  a
  {{#unless true}}
    {{#unless false}}
    b
    {{else}}
    c
    {{/unless}}
  {{else}}
  c
  {{/unless}}
`;
str = `
    {{#unless false}}
    b
    {{else}}
    c
    {{/unless}}
  {{else}}
  c
`;
// console.log(XRegExp.escape('\((?>[^()]|(?R))*\)'));
console.time('rec');
var regex = XRegExp.matchRecursive(str, '{{#[^}]+}}', '{{\\/[^}]+}}', 'gi', {
  valueNames: ['between', 'left', 'match', 'right']
});
console.timeEnd('rec');
console.log(regex);
// XRegExp.replace(str, regex, function() {
//   console.log(arguments);
// })

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
  static parseMarkup(markup) {
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
ReactTemplateCompiler = class extends BabelCompiler {
  constructor() {
    super({react: true});
  }

  processFilesForTarget(inputFiles) {
    inputFiles.forEach((inputFile) => {
      let content = inputFile.getContentsAsString();
      inputFile.getContentsAsString = function() {
        var markup = ReactCompiler.parse(content);
        //
        // console.log('\n\n\n');
        // console.log(inputFile.getPathInPackage());
        // console.log('=====================');
        // console.log(content);
        // const lines = ("" + markup).split(/\n/g);
        // _.each(lines, (line, i) => console.log((i+1) + '  ', line));

        return markup;
      };
    });

    // Pass content to BabelCompiler.
    super(inputFiles);
  }
}
