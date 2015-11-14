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
    replace: "<RT.get __name='$2' context={context}/>"
  },
  // Add return and key={index} inside {{#each}}.
  {
    regex: /({{#each\s+[^}]+}}[^<]*)(<\w+)/g,
    replace: "$1return ($2 key={index}"
  },
  // {{#each}} in
  {
    regex: /{{#each\s+([^\s]+)\s+in\s+([^}]+)\s*}}/g,
    replace: "{(RT.lookup(context, '$2') || []).map(function($1, index){let context = component.data; context.$1 = $1; context.__context = $1;"
  },
  // {{/each}}
  {
    regex: /{{\/each}}/g,
    replace: ");})}"
  },
  // ^{{#if}}
  {
    regex: /^\W*{{#if\s+([\w]+)\s*}}/g,
    replace: "<span>{RT.lookup(context, '$1') ? ("
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
    replace: "{RT.lookup(context, '$1') ? ("
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
    replace: "<span>{!RT.lookup(context, '$1') ? ("
  },
  // {{/unless}}$
  {
    regex: /{{\/unless}}\W*$/g,
    replace: "):''}</span>"
  },
  // {{#unless}}
  {
    regex: /{{#unless\s+(\w+)\s*}}/g,
    replace: "{!RT.lookup(context, '$1') ? ("
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
    replace: "{RT.lookup(context, '$1') ? context.$1 : ''}"
  },
  // {{helper}} SafeString – Dynamic Attribute (class)
  {
    regex: /\sclass={{([^}]*)}}/g,
    replace: " className={RT.lookup(context, '$1') ? '' + new RT.classNames(context.$1) : ''}"
  },

  // {{helper}} SafeString – Dynamic Attribute (other)
  {
    regex: /={{([^}]*)}}/g,
    replace: "={RT.lookup(context, '$1') ? '' + new RT.SafeString(context.$1) : ''}"
  },

  // {{helper}} SafeString – In Attribute Values (class)
  {
    regex: /\sclass="([^\"{]*){{([^}]*)}}([^\"{]*)\"/g,
    replace: " className={RT.lookup(context, '$2') ? '$1' + new RT.classNames(context.$2) + '$3' : ''}"
  },
  // {{helper}} SafeString – In Attribute Values (other)
  {
    regex: /="([^\"{]*){{([^}]*)}}([^\"{]*)\"/g,
    replace: "={RT.lookup(context, '$2')? '$1' + new RT.classNames(context.$2) + '$3' : ''}"
  },
  // {{helper}} SafeString
  {
    regex: /{{([^}]*)}}/g,
    // replace: "{RT.lookup(context, '$1') ? '' + new RT.SafeString(context.$1) : ''}"
    replace: "{RT.string(context, '$1')}"
  },
  // Fix that annoying issue with React, and allow usage of class.
  {
    regex: /\sclass=/g,
    replace: " className="
  },
  // Fix that annoying issue with React, and allow usage of for.
  {
    regex: /\sfor=/g,
    replace: " htmlFor="
  },
  // Fix that annoying issue with React, and allow usage of tabindex.
  {
    regex: /\stabindex=/g,
    replace: " tabIndex="
  }
];
