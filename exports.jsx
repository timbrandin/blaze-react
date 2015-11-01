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
        this._context = {};
        this._helpers = Template[name]._helpers || {};
        _.each(this._helpers, (fn, helper) => {
          this._context[helper] = function() {
            if (!self._comps[helper]) {
              let state = {}, initial = true;
              self._comps[helper] = Tracker.autorun(() => {
                state[helper] = fn.apply(self, arguments);
                if (!initial)
                  self.setState(state);
              });
              initial = false;
              return state[helper];
            }
            else {
              return self.state && self.state[helper] ? self.state[helper] : '';
            }
          }
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
        this.events = this.events || {};
        _.extend(this.events, events);
      }

      render() {
        return ReactTemplate[name](this._context);
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
