Template = {
  _init: function(type, name) {
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
      if (Meteor.isClient) {
        Meteor.startup(function() {
          let body = React.createElement(Template[name]);
          ReactDOM.render(body, document.body);
        });
      }
    }
  }
};
