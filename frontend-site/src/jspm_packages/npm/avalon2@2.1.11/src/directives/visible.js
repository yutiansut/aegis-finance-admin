/* */ 
var update = require('./_update');
var none = 'none';
function parseDisplay(elem, val) {
  var doc = elem.ownerDocument;
  var nodeName = elem.nodeName;
  var key = '_' + nodeName;
  if (!parseDisplay[key]) {
    var temp = doc.body.appendChild(doc.createElement(nodeName));
    if (avalon.modern) {
      val = getComputedStyle(temp, null).display;
    } else {
      val = temp.currentStyle.display;
    }
    doc.body.removeChild(temp);
    if (val === none) {
      val = 'block';
    }
    parseDisplay[key] = val;
  }
  return parseDisplay[key];
}
avalon.parseDisplay = parseDisplay;
avalon.directive('visible', {
  diff: function(copy, src, name) {
    var c = !!copy[name];
    if (copy === src || c !== src[name]) {
      src[name] = c;
      update(src, this.update);
    }
  },
  update: function(dom, vdom) {
    if (!dom || dom.nodeType !== 1) {
      return;
    }
    var show = vdom['ms-visible'];
    var display = dom.style.display;
    var value;
    if (show) {
      if (display === none) {
        value = vdom.displayValue;
        if (!value) {
          dom.style.display = '';
        }
      }
      if (dom.style.display === '' && avalon(dom).css('display') === none && avalon.contains(dom.ownerDocument, dom)) {
        value = parseDisplay(dom);
      }
    } else {
      if (display !== none) {
        value = none;
        vdom.displayValue = display;
      }
    }
    function cb() {
      if (value !== void 0) {
        dom.style.display = value;
      }
    }
    avalon.applyEffect(dom, vdom, {
      hook: show ? 'onEnterDone' : 'onLeaveDone',
      cb: cb
    });
  }
});
