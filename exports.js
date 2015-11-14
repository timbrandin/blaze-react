RT = RT || {};
ReactTemplate = {};

// Build out Handlebars basic SafeString type
RT.SafeString = function(string) {
  this.string = string;
};
RT.SafeString.prototype.toString = RT.SafeString.prototype.toHTML = function() {
  return '' + this.string;
};

RT.classNames = function(obj) {
  this.obj = obj;
};
RT.classNames.prototype.toString = RT.classNames.prototype.toHTML = function() {
  return '' + new RT.SafeString(RT._classNames(this.obj));
};

RT.lookup = function(context, string) {
  const tests = string.split('.');
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

RT.template = function(name) {
  Template._init('template', name);
}

RT.body = function(name) {
  Template._init('body', name);
}
