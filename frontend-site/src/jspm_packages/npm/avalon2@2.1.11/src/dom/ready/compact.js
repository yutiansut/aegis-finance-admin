/* */ 
var scan = require('./scan');
scan.htmlfy = require('./htmlfy');
var document = avalon.document;
var window = avalon.window;
var root = avalon.root;
var readyList = [],
    isReady;
var fireReady = function(fn) {
  isReady = true;
  while (fn = readyList.shift()) {
    fn(avalon);
  }
};
function doScrollCheck() {
  try {
    root.doScroll('left');
    fireReady();
  } catch (e) {
    setTimeout(doScrollCheck);
  }
}
if (document.readyState === 'complete') {
  setTimeout(fireReady);
} else if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', fireReady);
} else if (document.attachEvent) {
  document.attachEvent('onreadystatechange', function() {
    if (document.readyState === 'complete') {
      fireReady();
    }
  });
  try {
    var isTop = window.frameElement === null;
  } catch (e) {}
  if (root.doScroll && isTop && window.external) {
    doScrollCheck();
  }
}
if (window.document) {
  avalon.bind(window, 'load', fireReady);
}
avalon.ready = function(fn) {
  if (!isReady) {
    readyList.push(fn);
  } else {
    fn(avalon);
  }
};
avalon.ready(function() {
  scan(document.body);
});
