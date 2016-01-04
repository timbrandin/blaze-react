// // Getting ready for ES6 Direct Proxies.
// if (typeof Proxy !== 'undefined') {
//   let handler = {
//     get: function(target, name) {
//       if (typeof target[name] === 'object') {
//         return new Proxy(target[name], handler);
//       }
//       else if (typeof target[name] !== 'undefined') {
//         return target[name];
//       }
//       else {
//         return '';
//       }
//     }
//   };
//
//   context = new Proxy(context, handler);
// }

// XXX A temporary solution until ES6 Proxies are supported in major browsers.
var helper = {
  get: function(target, name, type, key) {
    if (target) {
      if (type == 'array') {
        if (target[name] instanceof Array) {
          return _.map(target[name], function(_data) {
            let data = _data;
            // If we're in a "each in"-loop set the iterator key on the context.
            if (typeof key != 'undefined') {
              data = {};
              data[key] = _data;
            }
            data.__proto__ = target;
            return new ContextProxy(data);
          });
        }
        return [];
      }
      if (type == 'value') {
        return target[name];
      }
      if (typeof target[name] === 'object') {
        let data = target[name];
        data.__proto__ = target;
        return new ContextProxy(target[name]);
      }
      if (typeof target[name] !== 'undefined') {
        return target[name];
      }
    }
    return '';
  }
}
// Recursive lookup.
ContextProxy = class ContextProxy {
  constructor(target) {
    return (dotObject, type, key) => {
      // Do not look any further if dotObject is "".
      if (dotObject.length == 0) {
        return helper.get([target], 0, type, key);
      }
      // Split out the current name from the dotObject.
      let [name, ...rest] = dotObject.split('.');

      // Look for the value for the name in the target.
      let value = helper.get(target, name, type, key);
      // Continue recursive to next level ContextProxy.
      if (typeof value === 'function') {
        return value(rest.join('.'), type);
      }
      return value;
    };
  }
}
