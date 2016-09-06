/* */ 
var evaluatorPool = require('./evaluatorPool');
var rregexp = /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/g;
var rstring = /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/g;
var rfill = /\?\?\d+/g;
var brackets = /\(([^)]*)\)/;
var rshortCircuit = /\|\|/g;
var rpipeline = /\|(?=\w)/;
var ruselessSp = /\s*(\.|\|)\s*/g;
var rAt = /(^|[^\w\u00c0-\uFFFF_])(@|##)(?=[$\w])/g;
var rhandleName = /^(?:\@|##)[$\w\.]+$/i;
var rfilters = /\|.+/g;
var rvar = /((?:\@|\$|\#\#)?\w+)/g;
function collectLocal(str, ret) {
  var arr = str.replace(rfilters, '').match(rvar);
  if (arr) {
    arr.filter(function(el) {
      if (!/^[@\d\-]/.test(el) && el.slice(0, 2) !== '##' && el !== '$event' && !avalon.keyMap[el]) {
        ret[el] = 1;
      }
    });
  }
}
function extLocal(ret) {
  var arr = [];
  for (var i in ret) {
    arr.push('var ' + i + ' = __local__[' + avalon.quote(i) + ']');
  }
  return arr;
}
function parseExpr(str, category) {
  var binding = {};
  category = category || 'other';
  if (typeof str === 'object') {
    category = str.type;
    binding = str;
    str = binding.expr;
  }
  if (typeof str !== 'string')
    return '';
  var cacheID = str;
  var cacheStr = evaluatorPool.get(category + ':' + cacheID);
  if (cacheStr) {
    return cacheStr;
  }
  var number = 1;
  var maps = {};
  function dig(a) {
    var key = '??' + number++;
    maps[key] = a;
    return key;
  }
  function fill(a) {
    return maps[a];
  }
  var input = str.replace(rregexp, dig).replace(rstring, dig).replace(rshortCircuit, dig).replace(ruselessSp, '$1').split(rpipeline);
  var _body = input.shift();
  var local = {};
  var body = _body.replace(rfill, fill).trim();
  if (category === 'on' && rhandleName.test(body)) {
    body = body + '($event)';
  }
  body = body.replace(rAt, '$1__vmodel__.');
  if (category === 'js') {
    return evaluatorPool.put(category + ':' + cacheID, body);
  } else if (category === 'on') {
    collectLocal(_body, local);
  }
  var filters = input.map(function(str) {
    collectLocal(str.replace(/^\w+/g, ""), local);
    str = str.replace(rfill, fill).replace(rAt, '$1__vmodel__.');
    var hasBracket = false;
    str = str.replace(brackets, function(a, b) {
      hasBracket = true;
      return /\S/.test(b) ? '(__value__,' + b + ');' : '(__value__);';
    });
    if (!hasBracket) {
      str += '(__value__);';
    }
    str = str.replace(/(\w+)/, 'avalon.__format__("$1")');
    return '__value__ = ' + str;
  });
  var ret = [];
  if (category === 'on') {
    filters = filters.map(function(el) {
      return el.replace(/__value__/g, '$event');
    });
    if (filters.length) {
      filters.push('if($event.$return){\n\treturn;\n}');
    }
    if (!avalon.modern) {
      body = body.replace(/__vmodel__\.([^(]+)\(([^)]*)\)/, function(a, b, c) {
        return '__vmodel__.' + b + ".call(__vmodel__" + (/\S/.test(c) ? ',' + c : "") + ")";
      });
    }
    ret = ['function ms_on($event, __local__){', 'try{', extLocal(local).join('\n'), '\tvar __vmodel__ = this;', '\t' + body, '}catch(e){', quoteError(str, category), '}', '}'];
    filters.unshift(2, 0);
  } else if (category === 'duplex') {
    var getterBody = ['function (__vmodel__){', 'try{', 'return ' + body + '\n', '}catch(e){', quoteError(str, category).replace('parse', 'get'), '}', '}'];
    evaluatorPool.put('duplex:' + cacheID, getterBody.join('\n'));
    var setterBody = ['function (__vmodel__,__value__){', 'try{', '\t' + body + ' = __value__', '}catch(e){', quoteError(str, category).replace('parse', 'set'), '}', '}'];
    evaluatorPool.put('duplex:set:' + cacheID, setterBody.join('\n'));
    if (input.length) {
      var formatBody = ['function (__vmodel__, __value__){', 'try{', filters.join('\n'), 'return __value__\n', '}catch(e){', quoteError(str, category).replace('parse', 'format'), '}', '}'];
      evaluatorPool.put('duplex:format:' + cacheID, formatBody.join('\n'));
    }
    return evaluatorPool.get('duplex:' + cacheID);
  } else {
    ret = ['(function(){', 'try{', 'var __value__ = ' + body, (category === 'text' ? 'return avalon.parsers.string(__value__)' : 'return __value__'), '}catch(e){', quoteError(str, category), '\treturn ""', '}', '})()'];
    filters.unshift(3, 0);
  }
  ret.splice.apply(ret, filters);
  cacheStr = ret.join('\n');
  evaluatorPool.put(category + ':' + cacheID, cacheStr);
  return cacheStr;
}
function quoteError(str, type) {
  return '\tavalon.warn(e, ' + avalon.quote('parse ' + type + ' binding【 ' + str + ' 】fail') + ')';
}
module.exports = avalon.parseExpr = parseExpr;