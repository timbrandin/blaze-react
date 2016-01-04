Fragment = class Fragment extends React.Component {
  // Lifecycle method to set the context for this fragment on the parent
  // component.
  componentWillMount() {
    this.setupContext(this.props);
  }

  // Lifecycle method to set the newly updated context for this fragment on the
  // parent component.
  componentWillUpdate(nextProps) {
    this.setupContext(nextProps);
  }

  // Helper to setup the current context on the parent component.
  setupContext(props) {
    if (props.component && props.context) {
      if (!props.component._contexts) {
        props.component._contexts = {};
      }
      props.component._contexts[this._reactInternalInstance._rootNodeID] = props.context;
    }
  }

  // Render method that surrounds a list of elements or a string with a span and
  // marks if the fragment is redefining the context for the children.
  render(): ?ReactElement {
    let children = this.props.children;

    if (!children) {
      return null;
    }
    else if (children instanceof Array || typeof children == 'string') {
      if (this.props.context) {
        return (<span data-ctx=''>{children}</span>);
      }
      return (<span>{children}</span>);
    }
    else {
      let child = children;
      if (this.props.context) {
        return React.cloneElement(child, {'data-ctx': ''});
      }
      return React.Children.only(child);
    }
  }
}
