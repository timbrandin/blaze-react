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
  get: function(target, name) {
    if (target) {
      if (target[name] instanceof LocalCollection.Cursor) {
        return target[name].fetch();
      }
      if (target[name] instanceof Date) {
        return "" + target[name];
      }
      if (typeof target[name] === 'object') {
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
    return (dotObject) => {
      // Do not look any further if dotObject is "".
      if (dotObject.length == 0) {
        return target;
      }
      // Split out the current name from the dotObject.
      let [name, ...rest] = dotObject.split('.');

      // Look for the value for the name in the target.
      let value = helper.get(target, name);
      // Continue recursive to next level ContextProxy.
      if (typeof value === 'function') {
        return value(rest.join('.'));
      }
      return value;
    };
  }
}
