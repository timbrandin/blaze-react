Tinytest.add(
  "blaze-react - transpiling - #each", function (test, expect) {
    let str = `
      <div>
        {{#each docs}}
          Hello world
        {{/each}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {(this._lookup('docs', context) || []).map((context, index) => {return (
          Hello world
        );})}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - #each in", function (test, expect) {
    let str = `
      <div>
        {{#each doc in docs}}
          Hello world
        {{/each}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {(this._lookup('docs', context) || []).map((doc, index) => {let context = {}; context.doc = doc; context.__context = doc; return (
          Hello world
        );})}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - #if", function (test, expect) {
    let str = `
      <div>
        {{#if true}}
          Hello world
        {{/if}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {true ? (
          Hello world
        ):''}
      </div>
    `);
  });

Tinytest.add(
  "blaze-react - transpiling - #unless", function (test, expect) {
    let str = `
      <div>
        {{#unless true}}
          Hello world
        {{/unless}}
      </div>
    `;
    test.equal(ReactCompiler.parseMarkup(str), `
      <div>
        {!true ? (
          Hello world
        ):''}
      </div>
    `);
  });

  Tinytest.add(
    "blaze-react - transpiling - >template", function (test, expect) {
      let str = `
        <div>
          {{> template}}
        </div>
      `;
      test.equal(ReactCompiler.parseMarkup(str), `
        <div>
          <this._inject __name='template' parent={this}/>
        </div>
      `);
    });
