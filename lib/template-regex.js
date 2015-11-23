TemplateRegex = [
  {
    // Replace the head with a dochead code.
    regex: /<(head)[^<>]*>([\w\W]*?(<\1[^<>]*>[\w\W]*?<\/\1>)*[\w\W]*?)<\/\1>/g,
    replace: function(match, className, code) {
      let markup = code;
      DocHeadRegex.forEach(function (obj) {
        markup = markup.replace(obj.regex, obj.replace);
      });
      return markup;
    }
  },
  {
    // Replace the body template with a React Component.
    regex: /<(body)[^<>]*>([\w\W]*?(<\1[^<>]*>[\w\W]*?<\/\1>)*[\w\W]*?)<\/\1>/g,
    replace: function(match, className, code) {
      // We need to pass template name to the template parser to enable injection of events defined in the app.
      const markup = ReactCompiler.parseMarkup(className, code || '');
      return `React.Component.createFromBlaze("body", "${className}", function(context) { return (${markup}) });`;
    }
  },
  {
    // Replace templates with a React Component.
    regex: /<(template)\s+name="([^"]+)"[^<>]*>([\w\W]*?(<\1[^<>]*>[\w\W]*?<\/\1>)*[\w\W]*?)<\/\1>/g,
    replace: function(match, tag, className, code) {
      // We need to pass template name to the template parser to enable injection of events defined in the app.
      const markup = ReactCompiler.parseMarkup(className, code || '');
      return `React.Component.createFromBlaze("template", "${className}", function(context) { return (${markup}) });`;
    }
  }
];

DocHeadRegex = [
  {
    regex: /\s*<title>([^<>]+)<\/title>/g,
    replace: `DocHead.setTitle("$1");`
  }
];
