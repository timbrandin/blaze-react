Inject = class Inject extends React.Component {
  render() {
    // A component exists.
    if (Template && Template[this.props.__template]) {
      return React.createElement(Template[this.props.__template], _.omit(this.props, '__template'));
    }
    // A template exists.
    else if (ReactTemplate[this.props.__template]) {
      return React.createElement(ReactTemplate[this.props.__template], _.omit(this.props, '__template'));
    }
    return "";
  }
}
