RT = RT || {};
ReactTemplate = {};

/**
 * Helper to create React Components for Blaze Templates.
 * @param  {String} type          Template or body.
 * @param  {String} className     The name of the template.
 * @param  {Function} renderFunc  Function used to render the template.
 * @return {void}
 */
React.Component.createFromBlaze = function(type, className, renderFunc) {
  // Assign the render function to ReactTemplate for later use and allow for overrides.
  ReactTemplate[className] = renderFunc;

  // Create React Component based on the BlazeReact class.
  Template[className] = class extends BlazeReact {
    constructor(props) {
      super(props, className);
    }
  }

  // If type is body, we also want to render the component.
  if (type === 'body') {
    // If the app is using flow-router-ssr we can also get server side rendering,
    // here we setup so we don't get warnings of missing route for "/".
    if (Package['kadira:flow-router-ssr'] && Meteor.isClient) {
      // Disable warnings of missing "/" route.
      Package['kadira:flow-router-ssr'].FlowRouter.route('/');
    }

    // Wait for DOM is loaded.
    Meteor.startup(function() {
      // Create and instanciate the React Component.
      let body = React.createElement(Template[className]);
      if (Meteor.isClient) {
        ReactDOM.render(body, Template._getRootNode());
      }
      // If the app is using flow-router-ssr setup server side rendering using the "/" route.
      else if (Package['kadira:flow-router-ssr']) {
        // Enable fast page loads using flow-router-ssr.
        var FlowRouter = Package['kadira:flow-router-ssr'].FlowRouter;
        FlowRouter.route('/', {
          action: function() {
            var rootNodeHtml = Template._buildRootNode();
            let elHtml = ReactDOMServer.renderToString(body);
            let html = rootNodeHtml.replace('</span>', elHtml + '</span>');

            var ssrContext = FlowRouter.ssrContext.get();
            ssrContext.setHtml(html);
          }
        });
      }
    });
  }
}

// Build out Handlebars basic SafeString type
RT.SafeString = function(string) {
  this.string = string;
};
RT.SafeString.prototype.toString = RT.SafeString.prototype.toHTML = function() {
  return '' + this.string;
};

// Helper to build out class from a list, object or a string in an attribute.
RT.classNames = function(obj) {
  this.obj = obj;
};
RT.classNames.prototype.toString = RT.classNames.prototype.toHTML = function() {
  return '' + new RT.SafeString(RT._classNames(this.obj));
};

// Helper to lookup a referenced name in the context.
RT.lookup = function(context, name) {
  const tests = name.split('.');
  if (!context) {
    return false;
  }
  // Look in the context for a matching dot-object pattern.
  let obj = context;
  for (let i in tests) {
    let test = tests[i];
    if (typeof obj === 'undefined') {
      return false;
    }
    // If we're running through an each-in loop pass on the context.
    if (i == tests.length - 1 && context.__context) {
      props = Object.getOwnPropertyDescriptor(obj, test);
      if (props.hasOwnProperty('get')) {
        obj = props.get.call(context.__context);
      }
      else {
        obj = props.value;
      }
    }
    else {
      // Iterate on to next child in dot-object pattern.
      obj = obj[test];
    }
  }
  // Last check if undefined.
  if (typeof obj === 'undefined') {
    return false;
  }
  return obj;
};

RT.string = function(context, string) {
  let value = RT.lookup(context, string);
  if (value !== false) {
    return "" + new RT.SafeString(value);
  }
  return "";
}

RT.get = function(props) {
  // A template component exists.
  if (Template && Template[props.__name]) {
    return React.createElement(Template[props.__name], _.omit(props, '__name'));
  }
  // A template exists.
  else if (ReactTemplate[props.__name]) {
    return React.createElement(ReactTemplate[props.__name], _.omit(props, '__name'));
  }
  return "";
}

RT.event = function(component, key, context) {
  if (component && component.events && component.events[key]) {
    return component.events[key].bind(component, context);
  }
}
