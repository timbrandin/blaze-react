Tinytest.add(
  "blaze-react - transpiling - {{#each docs}}", function (test, expect) {
    let str = `
      <div>
        {{#each docs}}
          Hello world
        {{/each}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {_.toArray(context('docs')).length > 0 ? _.toArray(context('docs')).map((context, index) => {return (<Fragment key={index} context={context} component={this}>
          Hello world
        </Fragment>)}):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#each docs}} {{else}}", function (test, expect) {
    let str = `
      <div>
        {{#each docs}}
          Hello world
        {{else}}
          No documents found.
        {{/each}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {_.toArray(context('docs')).length > 0 ? _.toArray(context('docs')).map((context, index) => {return (<Fragment key={index} context={context} component={this}>
          Hello world
        </Fragment>)}):(<Fragment>
          No documents found.
        </Fragment>)}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#each docs}} (nested)", function (test, expect) {
    let str = `
      <div>
        {{#each docs}}
          {{#each docs}}
            Hello world
          {{/each}}
        {{/each}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {_.toArray(context('docs')).length > 0 ? _.toArray(context('docs')).map((context, index) => {return (<Fragment key={index} context={context} component={this}>
          {_.toArray(context('docs')).length > 0 ? _.toArray(context('docs')).map((context, index) => {return (<Fragment key={index} context={context} component={this}>
            Hello world
          </Fragment>)}):''}
        </Fragment>)}):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#each doc in docs}}", function (test, expect) {
    let str = `
      <div>
        {{#each doc in docs}}
          Hello world
        {{/each}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {_.toArray(context('docs')).length > 0 ? _.toArray(context('docs')).map((doc, index) => {return (<Fragment key={index} context={doc} component={this}>
          Hello world
        </Fragment>)}):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#each doc in docs}} (nested)", function (test, expect) {
    let str = `
      <div>
        {{#each doc in docs}}
          {{#each doc in docs}}
            Hello world
          {{/each}}
        {{/each}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {_.toArray(context('docs')).length > 0 ? _.toArray(context('docs')).map((doc, index) => {return (<Fragment key={index} context={doc} component={this}>
          {_.toArray(context('docs')).length > 0 ? _.toArray(context('docs')).map((doc, index) => {return (<Fragment key={index} context={doc} component={this}>
            Hello world
          </Fragment>)}):''}
        </Fragment>)}):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#with doc}}", function (test, expect) {
    let str = `
      <div>
        {{#with doc}}
          Hello world {{name}}
        {{/with}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {context('doc') ? (<Fragment context={context('doc')} component={this}>
          Hello world {context('name')}
        </Fragment>):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#with doc}} (nested)", function (test, expect) {
    let str = `
      <div>
        {{#with doc}}
          {{#with doc}}
            Hello world {{name}}
          {{/with}}
        {{/with}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {context('doc') ? (<Fragment context={context('doc')} component={this}>
          {context('doc') ? (<Fragment context={context('doc')} component={this}>
            Hello world {context('name')}
          </Fragment>):''}
        </Fragment>):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#if boolean}}", function (test, expect) {
    let str = `
      <div>
        {{#if true}}
          Hello world
        {{/if}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {true ? (<Fragment>
          Hello world
        </Fragment>):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#if helper}}", function (test, expect) {
    str = `
      <div>
        {{#if docs}}
          Hello world
        {{/if}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {context('docs') ? (<Fragment>
          Hello world
        </Fragment>):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#if helper arg=value}}", function (test, expect) {
    str = `
      <div>
        {{#if docs arg=value}}
          Hello world
        {{/unless}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {context('docs', {arg: context('value')}) ? (<Fragment>
          Hello world
        </Fragment>):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#if helper arg1=value arg2=value}}", function (test, expect) {
    str = `
      <div>
        {{#if docs arg1=value arg2=value}}
          Hello world
        {{/unless}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {context('docs', {arg1: context('value'), arg2: context('value')}) ? (<Fragment>
          Hello world
        </Fragment>):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#if helper}} (nested)", function (test, expect) {
    str = `
      <div>
        {{#if docs}}
          {{#if docs}}
            Hello world
          {{/if}}
        {{/if}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {context('docs') ? (<Fragment>
          {context('docs') ? (<Fragment>
            Hello world
          </Fragment>):''}
        </Fragment>):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#unless boolean}}", function (test, expect) {
    let str = `
      <div>
        {{#unless true}}
          Hello world
        {{/unless}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {!true ? (<Fragment>
          Hello world
        </Fragment>):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#unless helper}}", function (test, expect) {
    str = `
      <div>
        {{#unless docs}}
          Hello world
        {{/unless}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {!context('docs') ? (<Fragment>
          Hello world
        </Fragment>):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#unless helper arg=value}}", function (test, expect) {
    str = `
      <div>
        {{#unless docs arg=value}}
          Hello world
        {{/unless}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {!context('docs', {arg: context('value')}) ? (<Fragment>
          Hello world
        </Fragment>):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#unless helper arg1=value arg2=value}}", function (test, expect) {
    str = `
      <div>
        {{#unless docs arg1=value arg2=value}}
          Hello world
        {{/unless}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {!context('docs', {arg1: context('value'), arg2: context('value')}) ? (<Fragment>
          Hello world
        </Fragment>):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{#unless helper}} (nested)", function (test, expect) {
    str = `
      <div>
        {{#unless docs}}
          {{#unless docs}}
            Hello world
          {{/unless}}
        {{/unless}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {!context('docs') ? (<Fragment>
          {!context('docs') ? (<Fragment>
            Hello world
          </Fragment>):''}
        </Fragment>):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{> template}}", function (test, expect) {
    let str = `
      <div>
        {{> template}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        <Inject __template='template' parent={this}/>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{helper}}", function (test, expect) {
    let str = `
      <div>
        {{helper}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {context('helper')}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{helper arg=value}}", function (test, expect) {
    let str = `
      <div>
        {{helper arg=value}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {context('helper', {arg: context('value')})}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{helper arg1=value arg2=value}}", function (test, expect) {
    let str = `
      <div>
        {{helper arg1=value arg2=value}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {context('helper', {arg1: context('value'), arg2: context('value')})}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{helper \"arg1\" arg2=value arg3=\"arg3\"}}", function (test, expect) {
    let str = `
      <div>
        {{helper "arg1" arg2=value arg3="arg3"}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {context('helper', {0: "arg1", arg2: context('value'), arg3: "arg3"})}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{{helper}}} (raw HTML)", function (test, expect) {
    let str = `
      <div>
        {{{helper}}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        <span dangerouslySetInnerHTML={markup('helper')}></span>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{{helper arg=value}}}} (raw HTML)", function (test, expect) {
    let str = `
      <div>
        {{{helper arg=value}}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        <span dangerouslySetInnerHTML={markup('helper', {arg: context('value')})}></span>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{{helper arg1=value arg2=value}}}} (raw HTML)", function (test, expect) {
    let str = `
      <div>
        {{{helper arg1=value arg2=value}}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        <span dangerouslySetInnerHTML={markup('helper', {arg1: context('value'), arg2: context('value')})}></span>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - {{{helper \"arg1\" arg2=value arg3=\"arg3\"}}} (raw HTML)", function (test, expect) {
    let str = `
      <div>
        {{{helper "arg1" arg2=value arg3="arg3"}}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        <span dangerouslySetInnerHTML={markup('helper', {0: "arg1", arg2: context('value'), arg3: "arg3"})}></span>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - class={{helper}} – Dynamic Attribute (class)", function (test, expect) {
    let str = `
      <div class={{helper}}>
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div className={classNames('helper')}>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - class={{helper arg=value}} – Dynamic Attribute (class)", function (test, expect) {
    let str = `
      <div class={{helper arg=value}}>
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div className={classNames('helper', {arg: context('value')})}>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - class={{helper arg1=value arg2=value}} – Dynamic Attribute (class)", function (test, expect) {
    let str = `
      <div class={{helper arg1=value arg2=value}}>
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div className={classNames('helper', {arg1: context('value'), arg2: context('value')})}>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - class={{helper \"arg1\" arg2=value arg3=\"arg3\"}} – Dynamic Attribute (class)", function (test, expect) {
    let str = `
      <div class={{helper "arg1" arg2=value arg3="arg3"}}>
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div className={classNames('helper', {0: "arg1", arg2: context('value'), arg3: "arg3"})}>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - title={{helper}} – Dynamic Attribute (other)", function (test, expect) {
    let str = `
      <div title={{helper}}>
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div title={context('helper')}>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - class=\"{{helper}}\" – In Attribute Values (class)", function (test, expect) {
    let str = `
      <div class="{{helper}}">
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div className={'' + classNames('helper') + ''}>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - class=\"{{helper arg=value}}\" – In Attribute Values (class)", function (test, expect) {
    let str = `
      <div class="{{helper arg=value}}">
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div className={'' + classNames('helper', {arg: context('value')}) + ''}>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - class=\"{{helper arg1=value arg2=value}}\" – In Attribute Values (class)", function (test, expect) {
    let str = `
      <div class="{{helper arg1=value arg2=value}}">
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div className={'' + classNames('helper', {arg1: context('value'), arg2: context('value')}) + ''}>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - class=\"{{helper \"arg1\" arg2=value arg3=\"arg3\"}}\" – In Attribute Values (class)", function (test, expect) {
    let str = `
      <div class="{{helper "arg1" arg2=value arg3="arg3"}}">
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div className={'' + classNames('helper', {0: "arg1", arg2: context('value'), arg3: "arg3"}) + ''}>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - title=\"{{helper}}\" – In Attribute Values (other)", function (test, expect) {
    let str = `
      <div title="{{helper}}">
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div title={'' + context('helper') + ''}>
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - template", function (test, expect) {
    let str = `
      <template name="template">
        <div>Hello world</div>
      </template>
    `;
    test.equal(ReactCompiler.parse(str), `
      React.Component.createFromBlaze("template", "template", function(context) {return (<Fragment context={context}>
        <div>Hello world</div>
      </Fragment>)});
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - body", function (test, expect) {
    let str = `
      <body>
        <div>Hello world</div>
      </body>
    `;
    test.equal(ReactCompiler.parse(str), `
      React.Component.createFromBlaze("body", "body", function(context) {return (<Fragment context={context}>
        <div>Hello world</div>
      </Fragment>)});
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - body {{> template}}", function (test, expect) {
    let str = `
      <body>
        {{> hello}}
      </body>
    `;
    test.equal(ReactCompiler.parse(str), `
      React.Component.createFromBlaze("body", "body", function(context) {return (<Fragment context={context}>
        <Inject __template='hello' parent={this}/>
      </Fragment>)});
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - head", function (test, expect) {
    let str = `
      <head>
        <title>Hello world</title>
      </head>`;
    test.equal(ReactCompiler.parse(str), `
      DocHead.setTitle("Hello world");
      `);
  });
