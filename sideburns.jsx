Meteor.startup(function() {
  if (Meteor.isClient) {
    // for(var name in ReactTemplate) {
    //   var template = ReactTemplate[name];
    //
    //   Template[name] = new class extends React.Component {
    //     constructor(props) {
    //       super(props);
    //       console.log('yo');
    //     }
    //     helpers() {
    //       console.log(arguments);
    //     }
    //     render() {
    //       return template(this.state);
    //     }
    //   }
    // }

    // Paint the body template.
    // var el = React.createElement(ReactTemplate.body);
    // ReactDOM.render(el, document.body);
  }
  // console.log(ReactTemplate);
})
