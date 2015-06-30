var _eval = Npm.require('eval');
var cheerio = Npm.require('cheerio');

var handler = function (compileStep) {
  var source = compileStep.read().toString('utf8');

  // Split out event maps.
  var eventMaps = source.split(/Template\.([^\.]+)\.events\(\{/i);
  // console.log(eventMaps);
  for(var i = 1; i <= eventMaps.length-1; i+=2) {
    var className = eventMaps[i];
    // Split out the trailing end after the template.
    var eventMap = (eventMaps[i+1] + '').split(/\n\}\)/i);
    eventMap = (eventMap[0]|| '').trim();
    if (eventMap) {
      var jsxEventMap = Babel.transformMeteor('module.exports = {' + eventMap + '};', {
        sourceMap: false,
        extraWhitelist: ["react"]
      });
      var mapContent = jsxEventMap.code;
      if (mapContent) {
        var res = _eval(mapContent);
        if (typeof res == 'object') {
          for(var key in res) {
            var selectors = key.split(',');
            for(var j=0; j < selectors.length; j++) {
              var selector = selectors[j].split(' ');
              var event = selector[0];
              var select = selector[1];
              var $ = cheerio.load('<Page class="yo">{hej}</Page>');
              $(select).attr("onClick", "this.events['" + selectors[j] + "']");
              console.log($.html());
              // console.log(event, CSSselect.compile(select));
            }
          }
        }
        // console.log(res);
      }
    }
  }

  var parts = source.split(/<template name="(\w+)">/i);
  var jsx = "\nvar Template = Template || {};\n";
  var extras = parts[0];
  for(var i=1; i <= parts.length-1; i+=2) {
    var className = parts[i];
    jsx += "Template." + className + " = {\n";
    jsx += "  onCreated: function(f) {return this._onCreated = f || (this._onCreated || function(){})},\n";
    jsx += "  helpers: function(o) {return this._helpers = o || (this._helpers || {})},\n";
    jsx += "};\n";
  }
  for(var i=1; i <= parts.length-1; i+=2) {
    var className = parts[i];
    // Split out the trailing end after the template.
    var code = parts[i+1].split(/<\/template>/i);

    // Fix that annoying issue with React, and allow usage of class.
    var markup = (code[0] || '').trim().replace(/\sclass=/g, ' className=');

    // ES6 Template for React components.
    jsx += className + " = React.createClass({displayName: \"" + className + "\",\n";
    jsx += "  _created: false,\n";
    jsx += "  mixins: [ReactMeteorData],\n";
    jsx += "  getMeteorData() {\n";
    jsx += "    let self = this;\n";
    jsx += "    if (!self._created) {\n";
    jsx += "      Tracker.nonreactive(function(){Template." + className + ".onCreated().call(self)});\n";
    jsx += "      self._created = true;\n";
    jsx += "    }\n";
    jsx += "    let _helpers = {};\n";
    jsx += "    let helpers = Template." + className + ".helpers();\n";
    jsx += "    for (let key in helpers) {\n";
    jsx += "      _helpers[key] = helpers[key].call(self);\n";
    jsx += "    };\n";
    jsx += "    return _helpers;\n";
    jsx += "  },\n";
    jsx += "  render: function() {\n";
    jsx += "    return (" + markup + ");";
    jsx += "  }\n";
    jsx += "});\n";
    extras += (code[1] || '');
  }

  var outputFile = compileStep.inputPath + ".js";

  try {
    var result = Babel.transformMeteor(jsx + extras, {
      sourceMap: true,
      filename: compileStep.pathForSourceMap,
      sourceMapName: compileStep.pathForSourceMap,
      extraWhitelist: ["react"]
    });
  } catch (e) {
    if (e.loc) {
      // Babel error
      compileStep.error({
        message: e.message,
        sourcePath: compileStep.inputPath,
        line: e.loc.line,
        column: e.loc.column
      });
      return;
    } else {
      throw e;
    }
  }

  compileStep.addJavaScript({
    path: outputFile,
    sourcePath: compileStep.inputPath,
    data: result.code,
    sourceMap: JSON.stringify(result.map)
  });
};

Plugin.registerSourceHandler('html.jsx', handler);
