/* */ 
var scan = require('./scan');
scan.htmlfy = function(el) {
  return el.outerHTML;
};
var document = avalon.document;
var window = avalon.window;
var readyList = [],
    isReady;
var fireReady = function(fn) {
  isReady = true;
  while (fn = readyList.shift()) {
    fn(avalon);
  }
};
if (document.readyState === 'complete') {
  setTimeout(fireReady);
} else {
  document.addEventListener('DOMContentLoaded', fireReady);
}
avalon.bind(window, 'load', fireReady);
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
