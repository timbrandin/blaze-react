ReactRegex = [
  // Add fragment to all outer most tags to allow for adjacent elements.
  {
    regex: /<(\w+)[^<>]*>[\w\W]*?(<\1[^<>]*>[\w\W]*?<\/\1>)*[\w\W]*?<\/\1>/g,
    replace: "<FRAGMENT>$&</FRAGMENT>"
  },
  // Create fragments of remaining content that is not within an outer most tag.
  {
    regex: /<\/FRAGMENT>([\w\W]+?)<FRAGMENT>/g,
    replace: "<FRAGMENT>$&</FRAGMENT>"
  },
  // Create fragments for leading content.
  {
    regex: /^([\w\W]+)<FRAGMENT>/g,
    replace: "<FRAGMENT>$1</FRAGMENT><FRAGMENT>"
  },
  // Create fragments for trailing content.
  {
    regex: /(?:<\/FRAGMENT>(?!<FRAGMENT>)([\w\W]+)$)/g,
    replace: "</FRAGMENT><FRAGMENT>$1</FRAGMENT>"
  },
  // Remove empty fragments.
  {
    regex: /<FRAGMENT>([\s]+)<\/FRAGMENT>/g,
    replace: "$1"
  },
  // Start the element array in case of multiple fragments.
  {
    regex: /^([\s]*)<FRAGMENT>([\w\W]+(?=<FRAGMENT>))/,
    replace: "<div>$1$2"
  },
  // End the element array in case of multiple fragments.
  {
    regex: /(<\/FRAGMENT>[\w\W]*?<FRAGMENT>[\w\W]*?)<\/FRAGMENT>(\s*)$/,
    replace: "$1$2</div>"
  },
  // Split fragments in elements.
  {
    regex: /<\/FRAGMENT>([\s]*)<FRAGMENT>/g,
    replace: "$1" // ",$1"
  },
  // Clear away remaining FRAGMENTS, occurs when only on fragment is found in the template.
  {
    regex: /<\/?FRAGMENT>/g,
    replace: ""
  },
  // Append child components when using {{> template/component}}.
  {
    regex: /({{>\s+([^}]+)}})/g,
    replace: "<this._inject __name='$2' parent={this}/>"
  },
  // Add key={index} inside {{#each}}.
  {
    regex: /({{#each\s+[^}]+}}[^<{]*?)(<\w+)+/g,
    replace: "$1$2 key={index} data-context={this._track(context)}"
  },
  // {{else}} {{/each}}
  {
    regex: /(?:{{else}})([\w\W]*?({{#each[^}]*}}[\w\W]*?({{else}})?[\w\W]*?{{\/each}}[\w\W]*)*){{\/each}}/g,
    replace: function($0, $1, $2) {
      const markup = ReactCompiler.parseMarkup($1 || '');
      return `);}).else(<span>${markup}</span>)}`;
    }
  },
  // {{#each in }}
  {
    regex: /{{#each\s+([^\s]+)\s+in\s+([^}]+)\s*}}/g,
    replace: "{(this._lookup('$2', context) || []).map(($1, index) => {let context = {}; context.$1 = $1; context.__context = $1; return ("
  },
  // {{#each }}
  {
    regex: /{{#each\s+([^}]+)\s*}}/g,
    replace: "{(this._lookup('$1', context) || []).map((context, index) => {return ("
  },
  // {{/each}}
  {
    regex: /{{\/each}}/g,
    replace: ");})}"
  },
  // ^{{#if}}
  {
    regex: /^\W*{{#if\s+([\w]+)\s*}}/g,
    replace: "<span>{this._lookup('$1', context) ? ("
  },
  // ^{{#if ...}}
  {
    regex: /^\W*{{#if\s+(.+)\s*}}/g,
    replace: "<span>{$1 ? ("
  },
  // {{else}} {{/if}}$
  {
    regex: /(?:{{else}}(?![\w\W]*{{else}}))([\w\W]*){{\/if}}\W*$/g,
    replace: "):($1)}</span>"
  },
  // {{/if}}$
  {
    regex: /{{\/if}}\W*$/g,
    replace: "):''}</span>"
  },

  // {{#if}}
  {
    regex: /{{#if\s+(\w+)\s*}}/g,
    replace: "{this._lookup('$1', context) ? ("
  },
  // {{else}} {{/if}}
  {
    regex: /(?:{{else}}(?![\w\W]*{{else}}))([\w\W]*){{\/if}}/g,
    replace: "):($1)}"
  },
  // {{/if}}
  {
    regex: /{{\/if}}/g,
    replace: "):''}"
  },
  // ^{{#unless}}
  {
    regex: /^\W*{{#unless\s+(\w+)\s*}}/g,
    replace: "<span>{!this._lookup('$1', context) ? ("
  },
  // {{/unless}}$
  {
    regex: /{{\/unless}}\W*$/g,
    replace: "):''}</span>"
  },
  // {{#unless}}
  {
    regex: /{{#unless\s+(\w+)\s*}}/g,
    replace: "{!this._lookup('$1', context) ? ("
  },
  // {{else}} {{/unless}}
  {
    regex: /(?:{{else}}(?![\w\W]*{{else}}))([\w\W]*){{\/unless}}/g,
    replace: "):($1)}"
  },

  // {{/unless}}
  {
    regex: /{{\/unless}}/g,
    replace: "):''}"
  },

  // {{{helper}}} raw HTML
  {
    regex: /{{{([^}]*)}}}/g,
    replace: "{this._lookup('$1', context) ? context.$1 : ''}"
  },
  // {{helper}} SafeString – Dynamic Attribute (class)
  {
    regex: /\sclass={{([^}]*)}}/g,
    replace: " className={this._lookup('$1', context) ? '' + new classNames(this.lookup('$1', context)) : ''}"
  },

  // {{helper}} SafeString – Dynamic Attribute (other)
  {
    regex: /={{([^}]*)}}/g,
    replace: "={this._lookup('$1', context) ? '' + new SafeString(this._lookup('$1', context)) : ''}"
  },

  // {{helper}} SafeString – In Attribute Values (class)
  {
    regex: /\sclass="([^\"{]*){{([^}]*)}}([^\"{]*)\"/g,
    replace: " className={this._lookup('$2', context) ? '$1' + new classNames(this._lookup('$2', context)) + '$3' : ''}"
  },
  // {{helper}} SafeString – In Attribute Values (other)
  {
    regex: /="([^\"{]*){{([^}]*)}}([^\"{]*)\"/g,
    replace: "={this._lookup('$2', context)? '$1' + new classNames(this._lookup('$2', context)) + '$3' : ''}"
  },
  // {{helper}} SafeString
  {
    regex: /{{([^}]*)}}/g,
    replace: "{'' + new SafeString(this._lookup('$1', context))}"
  },
  // () Empty parathesises.
  {
    regex: /\([\s\n\t\r]+\)/g,
    replace: "''"
  },

  /* Replace all React JSX CamelCase attributes. */

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
