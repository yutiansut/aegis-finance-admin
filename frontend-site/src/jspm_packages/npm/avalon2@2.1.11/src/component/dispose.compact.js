/* */ 
var ret = require('./dispose.share');
var fireDisposeHook = ret.fireDisposeHook;
var fireDisposeHooks = ret.fireDisposeHooks;
var fireDisposeHookDelay = ret.fireDisposeHookDelay;
function byMutationEvent(dom) {
  dom.addEventListener("DOMNodeRemovedFromDocument", function() {
    fireDisposeHookDelay(dom);
  });
}
function byRewritePrototype() {
  if (byRewritePrototype.execute) {
    return;
  }
  byRewritePrototype.execute = true;
  var p = Node.prototype;
  function rewite(name, fn) {
    var cb = p[name];
    p[name] = function(a, b) {
      return fn.call(this, cb, a, b);
    };
  }
  rewite('removeChild', function(fn, a, b) {
    fn.call(this, a, b);
    if (a.nodeType === 1) {
      fireDisposeHookDelay(a);
    }
    return a;
  });
  rewite('replaceChild', function(fn, a, b) {
    fn.call(this, a, b);
    if (a.nodeType === 1) {
      fireDisposeHookDelay(a);
    }
    return a;
  });
  var ep = Element.prototype,
      oldSetter;
  function newSetter(html) {
    var all = avalon.slice(this.getElementsByTagName('*'));
    oldSetter.call(this, html);
    fireDisposeHooks(all);
  }
  if (!Object.getOwnPropertyDescriptor) {
    oldSetter = ep.__lookupSetter__('innerHTML');
    ep.__defineSetter__('innerHTML', newSetter);
  } else {
    var obj = Object.getOwnPropertyDescriptor(ep, 'innerHTML');
    oldSetter = obj.set;
    obj.set = newSetter;
    Object.defineProperty(ep, 'innerHTML', obj);
  }
  rewite('appendChild', function(fn, a) {
    fn.call(this, a);
    if (a.nodeType === 1 && this.nodeType === 11) {
      fireDisposeHookDelay(a);
    }
    return a;
  });
  rewite('insertBefore', function(fn, a, b) {
    fn.call(this, a, b);
    if (a.nodeType === 1 && this.nodeType === 11) {
      fireDisposeHookDelay(a);
    }
    return a;
  });
}
var checkDisposeNodes = [];
var checkID = 0;
function byPolling(dom) {
  avalon.Array.ensure(checkDisposeNodes, dom);
  if (!checkID) {
    checkID = setInterval(function() {
      for (var i = 0,
          el; el = checkDisposeNodes[i]; ) {
        if (false === fireDisposeHook(el)) {
          avalon.Array.removeAt(checkDisposeNodes, i);
        } else {
          i++;
        }
      }
      if (checkDisposeNodes.length == 0) {
        clearInterval(checkID);
        checkID = 0;
      }
    }, 700);
  }
}
module.exports = function onComponentDispose(dom) {
  if (window.chrome && window.MutationEvent) {
    byMutationEvent(dom);
  } else if (avalon.modern && typeof window.Node === 'function') {
    byRewritePrototype(dom);
  } else {
    byPolling(dom);
  }
};
