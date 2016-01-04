var XRegExp = Npm.require('xregexp');

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
    let result = "";
    let isElse = false, isEach = false;

    var matches = XRegExp.matchRecursive(markup, '{{#[^}]+}}', '{{\\/[^}]+}}', 'gi', {
      valueNames: ['between', 'left', 'match', 'right']
    });

    for(let row of matches) {
      switch(row.name) {
        case 'left':
        isEach = /#each/i.test(row.value);
        ReactRegex.BlockHelperLeft.forEach(function (obj) {
          row.value = row.value.replace(obj.regex, obj.replace);
        });
        result += row.value;
        break;

        case 'match':
        row.value = ReactCompiler.parseMarkup(row.value);
        isElse = /{{else}}/i.test(row.value);
        if (isEach) {
          result += row.value.replace(/{{else}}/i, "</Fragment>)}):(<Fragment>");
        }
        else {
          result += row.value.replace(/{{else}}/i, "</Fragment>):(<Fragment>");
        }
        break;

        case 'right':
        if (isElse) {
          ReactRegex.BlockHelperRightElse.forEach(function (obj) {
            row.value = row.value.replace(obj.regex, obj.replace);
          });
        }
        else {
          ReactRegex.BlockHelperRight.forEach(function (obj) {
            row.value = row.value.replace(obj.regex, obj.replace);
          });
        }
        result += row.value;
        break;

        case 'between':
        ReactRegex.Between.forEach(function (obj) {
          row.value = row.value.replace(obj.regex, obj.replace);
        });
        result += row.value;
        break;
      }
    }

    return result;
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

  static parseArguments(string) {
    let parts = string.split(/\s+/g);
    let stringWithArguments = `'${parts[0]}'`;

    // Wrap arguments.
    if (parts.length > 1) {
      // Add leading brace around the arguments.
      stringWithArguments += ', {'

      // Run through each argument passed.
      for (let i=1; i < parts.length; i++) {
        let [arg, value] = parts[i].split(/=/);
        // Assign a numeric key to the argument if not passed.
        if (!value) {
          value = arg;
          arg = i-1;
        }
        // Pass variables through the context.
        if (/^[^"']/.test(value)) {
          value = `context('${value}')`;
        }
        // Build each value.
        stringWithArguments += `${arg}: ${value}`;

        if (i < parts.length - 1) {
          stringWithArguments += ', ';
        }
      }

      // Add trailing brace around the arguments.
      stringWithArguments += '}';
    }
    return stringWithArguments;
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

        if (process.env.DEBUG) {
          console.log('\n\n\n');
          console.log(inputFile.getPathInPackage());
          console.log('=====================');
          console.log(content);
          const lines = ("" + markup).split(/\n/g);
          _.each(lines, (line, i) => console.log((i+1) + '  ', line));
        }

        return markup;
      };
    });

    // Pass content to BabelCompiler.
    super(inputFiles);
  }
}
