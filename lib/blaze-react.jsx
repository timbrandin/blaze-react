/* Static Template methods */

Template = class {
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

    this._globalHelpers[this.className] = func;
  }
};

/* Blaze React Component */

BlazeReact = class extends React.Component {
  constructor(props, className) {
    super(props);
    this.className = className;
    this.init();
  }

  /**
   * Initiates helpers, computations and sets the context.
   */
  init() {
    const self = this;
    this._comps = {};
    this.data = {};
    this.events = Template[this.className]._events || {};
    this.helpers = Template[this.className]._helpers || {};

    _.extend(this.helpers, Template._globalHelpers);

    _.each(this.helpers, (fn, helper) => {
      // Define properties for all helpers.
      Object.defineProperty(this.data, helper, {
        get: function(...args) {
          args.push(self);
          if (typeof self._comps[helper] === 'undefined') {
            // Create a computation for the helper.
            let state = {}, initial = true;
            self._comps[helper] = Tracker.autorun(() => {
              state[helper] = fn.apply(this, args);
              // If helper returns a cursor, let's fetch the data for the state.
              if (state[helper] instanceof LocalCollection.Cursor) {
                state[helper] = state[helper].fetch();
              }
              if (!initial) {
                // Set the state on the React Component.
                self.setState(state);
              }
            });
            initial = false;
          }
          return fn.apply(this, args);
        }
      });
    });
  }

  componentWillMount() {
    Template[this.className]._callbacks = Template[this.className]._callbacks || {};
    Template[this.className]._callbacks.created = Template[this.className]._callbacks.created || [];

    // Call all registered 'onCreated' callbacks
    _.each(Template[this.className]._callbacks.created, (func) => {
      func.apply(this);
    });
  }

  componentDidMount() {
    Template[this.className]._callbacks = Template[this.className]._callbacks || {};
    Template[this.className]._callbacks.rendered = Template[this.className]._callbacks.rendered || [];

    // Call all registered 'onRendered' callbacks
    _.each(Template[this.className]._callbacks.rendered, (func) => {
      func.apply(this);
    });
  }

  componentWillUnmount() {
    // Prevent certain methods from being iniated in onDestroyed callback
    Template[this.className].isDestroyed = true;
    Template[this.className]._callbacks = Template[this.className]._callbacks || {};
    Template[this.className]._callbacks.destroyed = Template[this.className]._callbacks.destroyed || [];

    _.each(this._comps, (comp) => {
      comp.stop();
    });
    // Call all registered 'onDestroyed' callbacks
    _.each(Template[this.className]._callbacks.destroyed, (func) => {
      func.apply(this);
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
    this._callbacks = this._callbacks || {};
    this._callbacks.created = this._callbacks.created || [];
    // Add onCreated callback
    this._callbacks.created.push(callback);
  }

  static onRendered(callback) {
    if (typeof callback !== "function") {
      throw new Error("onRendered callback must be a function");
    }
    this._callbacks = this._callbacks || {};
    this._callbacks.rendered = this._callbacks.rendered || [];
    // Add onRendered callback
    this._callbacks.rendered.push(callback);
  }

  static onDestroyed(callback) {
    if (typeof callback !== "function") {
      throw new Error("onDestroyed callback must be a function");
    }
    this._callbacks = this._callbacks || {};
    this._callbacks.destroyed = this._callbacks.destroyed || [];
    // Add onDestroyed callback
    this._callbacks.destroyed.push(callback);
  }

  autorun(runFunc, onError) {
    this._trackers = this._trackers || [];

    if (Tracker.active) {
      throw new Error(
        "Can't call Template#autorun from a Tracker Computation;"
      + " try calling it from the created or rendered callback");
    }
    // Give the autorun function a better name for debugging and profiling.
    // The `displayName` property is not part of the spec but browsers like Chrome
    // and Firefox prefer it in debuggers over the name function was declared by.
    //runFunc.displayName =
    //  (self.name || 'anonymous') + ':' + (displayName || 'anonymous');
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

  subscribe(name, ...args) {
    if (this.isDestroyed) {
      throw new Error("Can't subscribe inside onDestroyed callback!");
    }
    let subHandles = this._subscriptionHandles = this._subscriptionHandles || {};
    // This dependency is used to identify state transitions in
    // _subscriptionHandles which could cause the result of
    // subscriptionsReady to change. Basically this is triggered
    // whenever a new subscription handle is added or when a subscription handle
    // is removed and they are not ready.
    this._allSubsReadyDep = this._allSubsReadyDep || new Tracker.Dependency();
    this._allSubsReady = this._allSubsReady || false;
    // Duplicate logic from Meteor.subscribe
    let options = {};
    if (args.length) {
      let lastParam = _.last(args);

      // Match pattern to check if the last arg is an options argument
      let lastParamOptionsPattern = {
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

    let subHandle;
    let oldStopped = options.onStop;
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

    let connection = options.connection;
    let callbacks = _.pick(options, ["onReady", "onError", "onStop"]);

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

  subscriptionsReady() {
    // This dependency is used to identify state transitions in
    // _subscriptionHandles which could cause the result of
    // subscriptionsReady to change. Basically this is triggered
    // whenever a new subscription handle is added or when a subscription handle
    // is removed and they are not ready.
    this._allSubsReadyDep = this._allSubsReadyDep || new Tracker.Dependency();
    this._allSubsReady = this._allSubsReady || false;
    this._subscriptionHandles = this._subscriptionHandles || {};

    this._allSubsReadyDep.depend();

    this._allSubsReady = _.all(this._subscriptionHandles, function (handle) {
      return handle.ready();
    });

    return this._allSubsReady;
  }

  // Helper to lookup a referenced name in the context.
  _lookup(name, context) {
    let found = '';
    let previousContext = context;

    for(let ctx of [context, this.data, this.props.parent.data]) {
      let value = this.__lookup(name, ctx, previousContext);
      console.log(name, ctx, value);
      if (value !== undefined) {
        found = value;
        break;
      }
      previousContext = ctx;
    };

    return found;
  }

  __lookup(name, context, previousContext) {
    const tests = name.split('.');
    if (!context) {
      return;
    }
    // Look in the context for a matching dot-object pattern.
    let obj = context;
    for (let i in tests) {
      let test = tests[i];
      if (typeof obj === 'undefined') {
        return;
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
        props = Object.getOwnPropertyDescriptor(obj, test);
        if (typeof obj == 'object' && props && props.hasOwnProperty('get')) {
          obj = props.get.call(previousContext);
        }
        else {
          obj = obj[test];
        }
      }
    }
    // Last check if undefined.
    if (typeof obj === 'undefined') {
      return;
    }
    return obj;
  }

  // Helper to lookup and return a template or component.
  _inject(props) {
    // A component exists.
    if (Template && Template[props.__name]) {
      return React.createElement(Template[props.__name], _.omit(props, '__name'));
    }
    // A template exists.
    else if (ReactTemplate[props.__name]) {
      return React.createElement(ReactTemplate[props.__name], _.omit(props, '__name'));
    }
    return "";
  }

  render() {
    return ReactTemplate[this.className].call(this, this.data);
  }
};
