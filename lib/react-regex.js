ReactRegex = {};

ReactRegex.BlockHelperLeft = [
  // {{#each in }}
  {
    regex: /{{#each\s+([^\s]+)\s+in\s+([^}]+)\s*}}/gi,
    replace: "{context('$2', 'array').length > 0 ? context('$2', 'array', '$1').map((context, index) => {return (<Fragment key={index} context={context} component={this}>"
  },
  // {{#each }}
  {
    regex: /{{#each\s+([^}]+)\s*}}/gi,
    replace: "{context('$1', 'array').length > 0 ? context('$1', 'array').map((context, index) => {return (<Fragment key={index} context={context} component={this}>"
  },
  // {{#with }}
  {
    regex: /{{#with\s+([^}]+)\s*}}/gi,
    replace: "{context('$1') ? (<Fragment context={context('$1')} component={this}>"
  },
  // {{#if boolean}}
  {
    regex: /{{#if\s+(true|false)\s*}}/gi,
    replace: "{$1 ? (<Fragment>"
  },
  // {{#if }}
  {
    regex: /{{#if\s+([^}]*)\s*}}/gi,
    replace: function($0, $1) {
      const helperWithArguments = ReactCompiler.parseArguments(`${$1}`);
      return `{context(${helperWithArguments}) ? (<Fragment>`;
    }
  },
  // {{#unless boolean}}
  {
    regex: /{{#unless\s+(true|false)\s*}}/gi,
    replace: "{!$1 ? (<Fragment>"
  },
  // {{#unless }}
  {
    regex: /{{#unless\s+([^}]*)\s*}}/gi,
    replace: function($0, $1) {
      const helperWithArguments = ReactCompiler.parseArguments(`${$1}`);
      return `{!context(${helperWithArguments}) ? (<Fragment>`;
    }
  }
];

ReactRegex.BlockHelperRightElse = [
  // {{else}} ... {{/each}}
  {
    regex: /{{\/each}}/gi,
    replace: "</Fragment>)}"
  },
  // {{else}} ... {{/each}} {{/with}} {{/if}} {{unless}}
  {
    regex: /{{\/(with|if|unless)}}/gi,
    replace: "</Fragment>)}"
  }
];

ReactRegex.BlockHelperRight = [
  // {{/each}}
  {
    regex: /{{\/each}}/gi,
    replace: "</Fragment>)}):''}"
  },
  // {{/with}} {{/if}} {{unless}}
  {
    regex: /{{\/(with|if|unless)}}/gi,
    replace: "</Fragment>):''}"
  },
];

ReactRegex.Between = [
  // Remove all comment blocks.
  {
    regex: /(<\!\-\-[\w\W]*?\-\->)/g,
    replace: ""
  },


  /* INLINE OR ATTRIBUTE HELPER REGEX. */

  // Append child components when using {{> template/component}}.
  {
    regex: /({{>\s+([^}]+)}})/g,
    replace: "<Inject __template='$2' parent={this}/>"
  },

  // {{{helper}}} raw HTML
  {
    regex: /{{{([^}]*)}}}/g,
    replace: function($0, $1) {
      const helperWithArguments = ReactCompiler.parseArguments(`${$1}`);
      return `<span dangerouslySetInnerHTML={markup(${helperWithArguments})}></span>`;
    }
  },
  // {{helper}} SafeString – Dynamic Attribute (class)
  {
    regex: /\sclass={{([^}]*)}}/g,
    replace: function($0, $1) {
      const helperWithArguments = ReactCompiler.parseArguments(`${$1}`);
      return ` className={classNames(${helperWithArguments})}`;
    }
  },

  // {{helper}} SafeString – Dynamic Attribute (other)
  {
    regex: /={{([^}]*)}}/g,
    replace: function($0, $1) {
      const helperWithArguments = ReactCompiler.parseArguments(`${$1}`);
      return `={context(${helperWithArguments})}`;
    }
  },

  // {{helper}} SafeString – In Attribute Values (class)
  {
    regex: /\sclass="([^\"{]*){{([^}]*)}}([^\"{]*)\"/g,
    replace: function($0, $1, $2, $3) {
      const helperWithArguments = ReactCompiler.parseArguments(`${$2}`);
      return ` className={'${$1}' + classNames(${helperWithArguments}) + '${$3}'}`;
    }
  },
  // {{helper}} SafeString – In Attribute Values (other)
  {
    regex: /="([^\"{]*){{([^}]*)}}([^\"{]*)\"/g,
    replace: function($0, $1, $2, $3) {
      const helperWithArguments = ReactCompiler.parseArguments(`${$2}`);
      return `={'${$1}' + context(${helperWithArguments}) + '${$3}'}`;
    }
  },
  // {{helper}} SafeString
  {
    regex: /{{((?!else)[^}]*)}}/g,
    replace: function($0, $1) {
      const helperWithArguments = ReactCompiler.parseArguments(`${$1}`);
      return `{context(${helperWithArguments})}`;
    }
  },


  /* Clean-up. */

  // ( ) Parathesises with only spaces in between.
  {
    regex: /\([\s\n\t\r]+\)/g,
    replace: "''"
  },


  /* Replace all special React JSX CamelCase attributes. */

  {
    regex: /\sclass=/g,
    replace: " className="
  },
  {
    regex: /\sfor=/g,
    replace: " htmlFor="
  },
  {
    regex: /\stabindex=/g,
    replace: " tabIndex="
  }
];
