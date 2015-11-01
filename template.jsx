Template = class {
  static _init(type, name) {
    Template[name] = class extends React.Component {
      constructor(props) {
        super(props);
        this.init();
      }

      /**
       * Initiates helpers, computations and sets the context.
       */
      init() {
        const self = this;
        this._comps = {};
        this.state = {};
        this.data = {};
        this.events = Template[name]._events || {};
        this.helpers = Template[name]._helpers || {};

        _.each(this.helpers, (fn, helper) => {
          // Define properties for all helpers.
          Object.defineProperty(this.data, helper, {
            get: function() {
              if (!self._comps[helper]) {
                let state = {}, initial = true;
                self._comps[helper] = Tracker.autorun(() => {
                  self.state[helper] = fn.apply(self, arguments);
                  if (!initial)
                    self.setState(state);
                });
                initial = false;
              }
              if (self.state && typeof self.state[helper] !== "undefined") {
                return self.state[helper];
              }
            }
          });
        });
      }

      componentDidMount() {
        // this.init(true);
        // console.log(this.state);
      }

      componentWillUnmount() {
        for (let comp of this._comps) {
          comp.stop();
        }
      }

      static helpers(helpers) {
        this._helpers = this._helpers || {};
        _.extend(this._helpers, helpers);
      }

      static events(events) {
        this._events = this._events || {};
        _.extend(this._events, events);
      }

      render() {
        return ReactTemplate[name](this, this.data);
      }
    }
    if (type === 'body') {
      if (Package['kadira:flow-router-ssr'] && Meteor.isClient) {
        // Disable warnings of missing "/" route.
        Package['kadira:flow-router-ssr'].FlowRouter.route('/');
      }

      // Wait for DOM is loaded.
      Meteor.startup(function() {
        let body = React.createElement(Template[name]);
        if (Meteor.isClient) {
          ReactDOM.render(body, Template._getRootNode());
        }
        else if (Package['kadira:flow-router-ssr']) {
          // Enable fast page loads using flow-router-ssr.
          var FlowRouter = Package['kadira:flow-router-ssr'].FlowRouter;
          FlowRouter.setDeferScriptLoading(true);
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

  static _buildRootNode() {
    return `<span id="react-root"></span>`;
  }

  static _getRootNode() {
    var rootNode = document.getElementById('react-root');

    if(rootNode) {
      return rootNode;
    } else {
      var rootNodeHtml = Template._buildRootNode();
      var body = document.getElementsByTagName('body')[0];
      body.insertAdjacentHTML('beforeend', rootNodeHtml);
      rootNode = document.getElementById('react-root');
      return rootNode;
    }
  }
};
