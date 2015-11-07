Template = class {
  static _init(type, name) {
    Template[name] = class extends React.Component {
      constructor(props) {
        super(props);

        Template[name]._callbacks = {
          created: [],
          rendered: [],
          destroyed: []
        };

        console.log("constructing "+ name + " with: ", this);

        // This dependency is used to identify state transitions in
        // _subscriptionHandles which could cause the result of
        // subscriptionsReady to change. Basically this is triggered
        // whenever a new subscription handle is added or when a subscription handle
        // is removed and they are not ready.
        this._allSubsReadyDep = new Tracker.Dependency();
        this._allSubsReady = false;
        this.subscriptionHandles = {};

        this._trackers = [];

        this.init();
      }

      /**
       * Initiates helpers, computations and sets the context.
       */
      init() {
        // Create TemplateInstance
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
                  if (!initial) {
                    self.setState(state);
                  }
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

      componentWillMount() {
        var initState = {};

        // Call all registered 'onCreated' callbacks
        _.each(this._callbacks.created, function (func) {
          func();
          // Add initial state objects to return to getInitialState()
          _.extend(initState, state);
        });

        return initState || {};
      }

      componentDidMount() {
        // this.init(true);
        // console.log(this.state);

        // Call all registered 'onRendered' callbacks
        _.each(this._callbacks.rendered, function (func) {
          func();
        });
      }

      componentWillUnmount() {
        // Prevent certain methods from being iniated in onDestroyed callback
        this.isDestroyed = true;

        for (let comp of this._comps) {
          comp.stop();
        }
        // Call all registered 'onDestroyed' callbacks
        _.each(this._callbacks.destroyed, function (func) {
          func();
        });
        // Stop all template subscriptions
        _.each(this.subscriptionHandles, function (handle) {
          handle.stop();
        });
      }

      static helpers(helpers) {
        this._helpers = this._helpers || {};
        _.extend(this._helpers, helpers);
      }

      static events(events) {
        this._events = this._events || {};
        _.extend(this._events, events);
      }

      static onCreated(callback) {
        if (typeof callback !== "function") {
          throw new Error("onCreated callback must be a function");
        }
        console.log("onCreated context: ", this);
        // Add onCreated callback
        this._callbacks.created.push(callback);
      }

      static onRendered(callback) {
        if (typeof callback !== "function") {
          throw new Error("onRendered callback must be a function");
        }
        // Add onRendered callback
        this._callbacks.rendered.push(callback);
      }

      static onDestroyed(callback) {
        if (typeof callback !== "function") {
          throw new Error("onDestroyed callback must be a function");
        }
        // Add onDestroyed callback
        this._callbacks.destroyed.push(callback);
      }

      static autorun(runFunc, onError) {
        if (Tracker.active) {
          throw new Error(
            "Can't call Template#autorun from a Tracker Computation;"
          + " try calling it from the created or rendered callback");
        }
        // Give the autorun function a better name for debugging and profiling.
        // The `displayName` property is not part of the spec but browsers like Chrome
        // and Firefox prefer it in debuggers over the name function was declared by.
        runFunc.displayName =
          (self.name || 'anonymous') + ':' + (displayName || 'anonymous');
        // Create autorun
        let comp = Tracker.autorun(runFunc, onError);
        // Track the tracker ;)
        this._trackers.push(comp);

        comp.onStop(() => {
          if (! this.isDestroyed) {
            let i = _.indexOf(this._trackers, comp);
            this._trackers.pull(i);
          }
        });
        return comp;
      }

      static subscribe(name, ...args) {
        if (this.isDestroyed) {
          throw new Error("Can't subscribe inside onDestroyed callback!");
        }
        let subHandles = this._subscriptionHandles = this._subscriptionHandles || {};
        // Duplicate logic from Meteor.subscribe
        var options = {};
        if (args.length) {
          var lastParam = _.last(args);

          // Match pattern to check if the last arg is an options argument
          var lastParamOptionsPattern = {
            onReady: Match.Optional(Function),
            // XXX COMPAT WITH 1.0.3.1 onError used to exist, but now we use
            // onStop with an error callback instead.
            onError: Match.Optional(Function),
            onStop: Match.Optional(Function),
            connection: Match.Optional(Match.Any)
          };

          if (_.isFunction(lastParam)) {
            options.onReady = args.pop();
          } else if (lastParam && Match.test(lastParam, lastParamOptionsPattern)) {
            options = args.pop();
          }
        }

        var subHandle;
        var oldStopped = options.onStop;
        options.onStop = (error) => {
          // When the subscription is stopped, remove it from the set of tracked
          // subscriptions to avoid this list growing without bound
          delete subHandles[subHandle.subscriptionId];

          // Removing a subscription can only change the result of subscriptionsReady
          // if we are not ready (that subscription could be the one blocking us being
          // ready).
          if (! this._allSubsReady) {
            this._allSubsReadyDep.changed();
          }

          if (oldStopped) {
            oldStopped(error);
          }
        };

        var connection = options.connection;
        var callbacks = _.pick(options, ["onReady", "onError", "onStop"]);

        // The callbacks are passed as the last item in the arguments array passed to
        // View#subscribe
        args.push(callbacks);

        // Activate subscription
        if (connection) {
          subHandle = connection.subscribe.apply(connection, arguments);
        } else {
          subHandle = Meteor.subscribe.apply(Meteor, arguments);
        }

        if (! _.has(subHandles, subHandle.subscriptionId)) {
          subHandles[subHandle.subscriptionId] = subHandle;

          // Adding a new subscription will always cause us to transition from ready
          // to not ready, but if we are already not ready then this can't make us
          // ready.
          if (this._allSubsReady) {
            this._allSubsReadyDep.changed();
          }
        }

        return subHandle;
      }

      static subscriptionsReady() {
        this._allSubsReadyDep.depend();

        this._allSubsReady = _.all(this._subscriptionHandles, function (handle) {
          return handle.ready();
        });

        return this._allSubsReady;
      }

      render() {
        return ReactTemplate[name](this, this.data);
      }
    };
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

  static registerHelper (name, func) {
    this._globalHelpers = this._globalHelpers || {};

    this._globalHelpers[name] = func;
  }
};
