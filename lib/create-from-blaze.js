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
  ReactTemplate[className] = function(data) {
    // Pass the data through the context proxy to allow for unavailable
    // variables and attributes in the template.
    let context = new ContextProxy(data);
    const markup = (key) => {
      return {__html: context(key)}
    };
    return renderFunc.call(this, context);
  };

  // Create React Component based on the BlazeReact class.
  Template[className] = class Template extends BlazeReact {
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
