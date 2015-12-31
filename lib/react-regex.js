ReactRegex = {};

ReactRegex.BlockHelperLeft = [
  // {{#each in }}
  {
    regex: /{{#each\s+([^\s]+)\s+in\s+([^}]+)\s*}}/gi,
    replace: "{_.toArray(context('$2')).length > 0 ? _.toArray(context('$2')).map(($1, index) => {let context = new ContextProxy(context); return (<Fragment key={index} context={$1} component={this}>"
  },
  // {{#each }}
  {
    regex: /{{#each\s+([^}]+)\s*}}/gi,
    replace: "{_.toArray(context('$1')).length > 0 ? _.toArray(context('$1')).map((_context, index) => {let context = new ContextProxy(_context); return (<Fragment key={index} context={context} component={this}>"
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


  /* BLOCK HELPER REGEX. */

  // // {{else}} {{/each}}
  // {
  //   regex: /(?:{{else}})([\w\W]*?({{#each[^}]*}}[\w\W]*?({{else}})?[\w\W]*?{{\/each}}[\w\W]*)*){{\/each}}/g,
  //   replace: function($0, $1, $2) {
  //     const markup = ReactCompiler.parseMarkup($1 || '');
  //     return `);}).else(${markup})}`;
  //   }
  // },
  // // {{#each in }}
  // {
  //   regex: /{{#each\s+([^\s]+)\s+in\s+([^}]+)\s*}}/g,
  //   replace: "{(this._lookup('$2', context) || []).map(($1, index) => {let context = {}; context.$1 = $1; context.__context = $1; return ("
  // },
  // // {{#each }}
  // {
  //   regex: /{{#each\s+([^}]+)\s*}}/g,
  //   replace: "{(this._lookup('$1', context) || []).map((context, index) => {return ("
  // },
  // // {{/each}}
  // {
  //   regex: /{{\/each}}/g,
  //   replace: ");})}"
  // },
  // // {{#if}} {{/if}}{{else}}
  // {
  //   // regex: XRegExp('({{#(\w+)[^}]+}})([\w\W]*?(?R)*)({{(\/\2|else)}})', 'g'),
  //   regex: /({{#(?:if|unless)[^}]+}})([\w\W]*?({{#if[^}]*}}[\w\W]*?({{else}})?[\w\W]*?{{\/if}}[\w\W]*?)*)({{(\/if|else)}})/g,
  //   // replace: "):($1)}"
  //   replace: function($0, $1, $2, $3, $4, $5) {
  //     // console.log(arguments);
  //     // let markup = ReactCompiler.parseMarkup(`${$2}`);
  //     return ''; //$1 + markup + $5;
  //   }
  // },
  // // // ^{{#if}}
  // // {
  // //   regex: /^\W*{{#if\s+([\w]+)\s*}}/g,
  // //   replace: "<span>{this._lookup('$1', context) ? ("
  // // },
  // // // ^{{#if ...}}
  // // {
  // //   regex: /^\W*{{#if\s+(.+)\s*}}/g,
  // //   replace: "<span>{$1 ? ("
  // // },
  // // // {{else}} {{/if}}$
  // // {
  // //   regex: /(?:{{else}})([\w\W]*?({{#if[^}]*}}[\w\W]*?({{else}})?[\w\W]*?{{\/if}}[\w\W]*?)*){{\/if}}\W*$/g,
  // //   replace: function($0, $1, $2) {
  // //     const markup = ReactCompiler.parseMarkup(`${$1}`);
  // //     return `):(${markup})}</span>`;
  // //   }
  // // },
  // // // {{/if}}$
  // // {
  // //   regex: /{{\/if}}\W*$/g,
  // //   replace: "):''}</span>"
  // // },
  // // {{#if}}
  // {
  //   regex: /{{#if\s+(\w+)\s*}}/g,
  //   replace: function($0, $1) {
  //     if (/\s*(?:true|false)\s*/.test($1)) {
  //       return `{${$1} ? (`;
  //     }
  //     else {
  //       return `{this._lookup('${$1}', context) ? (`;
  //     }
  //   }
  // },
  // // {{else}} {{/if}}
  // {
  //   regex: /(?:{{else}})([\w\W]*?({{#if[^}]*}}[\w\W]*?({{else}})?[\w\W]*?{{\/if}}[\w\W]*?)*){{\/if}}/g,
  //   // replace: "):($1)}"
  //   replace: function($0, $1, $2) {
  //     const markup = ReactCompiler.parseMarkup(`${$1}`);
  //     return `):(${markup})}`;
  //   }
  // },
  // // {{/if}}
  // {
  //   regex: /{{\/if}}/g,
  //   replace: "):''}"
  // },
  // // // ^{{#unless}}
  // // {
  // //   regex: /^\W*{{#unless\s+(\w+)\s*}}/g,
  // //   replace: "<span>{!this._lookup('$1', context) ? ("
  // // },
  // // // {{/unless}}$
  // // {
  // //   regex: /{{\/unless}}\W*$/g,
  // //   replace: "):''}</span>"
  // // },
  // // {{#unless}}
  // {
  //   regex: /{{#unless\s+(\w+)\s*}}/g,
  //   replace: function($0, $1) {
  //     if (/\s*(?:true|false)\s*/.test($1)) {
  //       return `{!${$1} ? (`;
  //     }
  //     else {
  //       return `{!this._lookup('${$1}', context) ? (`;
  //     }
  //   }
  // },
  // // {{else}} {{/unless}}
  // {
  //   regex: /(?:{{else}}(?![\w\W]*{{else}}))([\w\W]*){{\/unless}}/g,
  //   replace: "):($1)}"
  // },
  //
  // // {{/unless}}
  // {
  //   regex: /{{\/unless}}/g,
  //   replace: "):''}"
  // },


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
    // replace: " className={this._lookup('$1', context) ? '' + new classNames(this.lookup('$1', context)) : ''}"
  },

  // {{helper}} SafeString – Dynamic Attribute (other)
  {
    regex: /={{([^}]*)}}/g,
    replace: function($0, $1) {
      const helperWithArguments = ReactCompiler.parseArguments(`${$1}`);
      return `={context(${helperWithArguments})}`;
    }
    // replace: "={this._lookup('$1', context) ? '' + new SafeString(this._lookup('$1', context)) : ''}"
  },

  // {{helper}} SafeString – In Attribute Values (class)
  {
    regex: /\sclass="([^\"{]*){{([^}]*)}}([^\"{]*)\"/g,
    replace: function($0, $1, $2, $3) {
      const helperWithArguments = ReactCompiler.parseArguments(`${$2}`);
      return ` className={'${$1}' + classNames(${helperWithArguments}) + '${$3}'}`;
    }
    // replace: " className={this._lookup('$2', context) ? '$1' + new classNames(this._lookup('$2', context)) + '$3' : ''}"
  },
  // {{helper}} SafeString – In Attribute Values (other)
  {
    regex: /="([^\"{]*){{([^}]*)}}([^\"{]*)\"/g,
    replace: function($0, $1, $2, $3) {
      const helperWithArguments = ReactCompiler.parseArguments(`${$2}`);
      return `={'${$1}' + context(${helperWithArguments}) + '${$3}'}`;
    }
    // replace: "={this._lookup('$2', context)? '$1' + new classNames(this._lookup('$2', context)) + '$3' : ''}"
  },
  // {{helper}} SafeString
  {
    regex: /{{((?!else)[^}]*)}}/g,
    replace: function($0, $1) {
      const helperWithArguments = ReactCompiler.parseArguments(`${$1}`);
      return `{context(${helperWithArguments})}`;
    }
  },
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
