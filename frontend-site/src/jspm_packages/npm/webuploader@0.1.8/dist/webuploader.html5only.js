/* */ 
"format cjs";
(function(root, factory) {
  var modules = {},
      _require = function(deps, callback) {
        var args,
            len,
            i;
        if (typeof deps === 'string') {
          return getModule(deps);
        } else {
          args = [];
          for (len = deps.length, i = 0; i < len; i++) {
            args.push(getModule(deps[i]));
          }
          return callback.apply(null, args);
        }
      },
      _define = function(id, deps, factory) {
        if (arguments.length === 2) {
          factory = deps;
          deps = null;
        }
        _require(deps || [], function() {
          setModule(id, factory, arguments);
        });
      },
      setModule = function(id, factory, args) {
        var module = {exports: factory},
            returned;
        if (typeof factory === 'function') {
          args.length || (args = [_require, module.exports, module]);
          returned = factory.apply(null, args);
          returned !== undefined && (module.exports = returned);
        }
        modules[id] = module.exports;
      },
      getModule = function(id) {
        var module = modules[id] || root[id];
        if (!module) {
          throw new Error('`' + id + '` is undefined');
        }
        return module;
      },
      exportsTo = function(obj) {
        var key,
            host,
            parts,
            part,
            last,
            ucFirst;
        ucFirst = function(str) {
          return str && (str.charAt(0).toUpperCase() + str.substr(1));
        };
        for (key in modules) {
          host = obj;
          if (!modules.hasOwnProperty(key)) {
            continue;
          }
          parts = key.split('/');
          last = ucFirst(parts.pop());
          while ((part = ucFirst(parts.shift()))) {
            host[part] = host[part] || {};
            host = host[part];
          }
          host[last] = modules[key];
        }
        return obj;
      },
      makeExport = function(dollar) {
        root.__dollar = dollar;
        return exportsTo(factory(root, _define, _require));
      },
      origin;
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = makeExport();
  } else if (typeof define === 'function' && define.amd) {
    define(['jquery'], makeExport);
  } else {
    origin = root.WebUploader;
    root.WebUploader = makeExport();
    root.WebUploader.noConflict = function() {
      root.WebUploader = origin;
    };
  }
})(window, function(window, define, require) {
  define('dollar-third', [], function() {
    var req = window.require;
    var $ = window.__dollar || window.jQuery || window.Zepto || req('jquery') || req('zepto');
    if (!$) {
      throw new Error('jQuery or Zepto not found!');
    }
    return $;
  });
  define('dollar', ['dollar-third'], function(_) {
    return _;
  });
  define('promise-third', ['dollar'], function($) {
    return {
      Deferred: $.Deferred,
      when: $.when,
      isPromise: function(anything) {
        return anything && typeof anything.then === 'function';
      }
    };
  });
  define('promise', ['promise-third'], function(_) {
    return _;
  });
  define('base', ['dollar', 'promise'], function($, promise) {
    var noop = function() {},
        call = Function.call;
    function uncurryThis(fn) {
      return function() {
        return call.apply(fn, arguments);
      };
    }
    function bindFn(fn, context) {
      return function() {
        return fn.apply(context, arguments);
      };
    }
    function createObject(proto) {
      var f;
      if (Object.create) {
        return Object.create(proto);
      } else {
        f = function() {};
        f.prototype = proto;
        return new f();
      }
    }
    return {
      version: '0.1.6',
      $: $,
      Deferred: promise.Deferred,
      isPromise: promise.isPromise,
      when: promise.when,
      browser: (function(ua) {
        var ret = {},
            webkit = ua.match(/WebKit\/([\d.]+)/),
            chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            ie = ua.match(/MSIE\s([\d\.]+)/) || ua.match(/(?:trident)(?:.*rv:([\w.]+))?/i),
            firefox = ua.match(/Firefox\/([\d.]+)/),
            safari = ua.match(/Safari\/([\d.]+)/),
            opera = ua.match(/OPR\/([\d.]+)/);
        webkit && (ret.webkit = parseFloat(webkit[1]));
        chrome && (ret.chrome = parseFloat(chrome[1]));
        ie && (ret.ie = parseFloat(ie[1]));
        firefox && (ret.firefox = parseFloat(firefox[1]));
        safari && (ret.safari = parseFloat(safari[1]));
        opera && (ret.opera = parseFloat(opera[1]));
        return ret;
      })(navigator.userAgent),
      os: (function(ua) {
        var ret = {},
            android = ua.match(/(?:Android);?[\s\/]+([\d.]+)?/),
            ios = ua.match(/(?:iPad|iPod|iPhone).*OS\s([\d_]+)/);
        android && (ret.android = parseFloat(android[1]));
        ios && (ret.ios = parseFloat(ios[1].replace(/_/g, '.')));
        return ret;
      })(navigator.userAgent),
      inherits: function(Super, protos, staticProtos) {
        var child;
        if (typeof protos === 'function') {
          child = protos;
          protos = null;
        } else if (protos && protos.hasOwnProperty('constructor')) {
          child = protos.constructor;
        } else {
          child = function() {
            return Super.apply(this, arguments);
          };
        }
        $.extend(true, child, Super, staticProtos || {});
        child.__super__ = Super.prototype;
        child.prototype = createObject(Super.prototype);
        protos && $.extend(true, child.prototype, protos);
        return child;
      },
      noop: noop,
      bindFn: bindFn,
      log: (function() {
        if (window.console) {
          return bindFn(console.log, console);
        }
        return noop;
      })(),
      nextTick: (function() {
        return function(cb) {
          setTimeout(cb, 1);
        };
      })(),
      slice: uncurryThis([].slice),
      guid: (function() {
        var counter = 0;
        return function(prefix) {
          var guid = (+new Date()).toString(32),
              i = 0;
          for (; i < 5; i++) {
            guid += Math.floor(Math.random() * 65535).toString(32);
          }
          return (prefix || 'wu_') + guid + (counter++).toString(32);
        };
      })(),
      formatSize: function(size, pointLength, units) {
        var unit;
        units = units || ['B', 'K', 'M', 'G', 'TB'];
        while ((unit = units.shift()) && size > 1024) {
          size = size / 1024;
        }
        return (unit === 'B' ? size : size.toFixed(pointLength || 2)) + unit;
      }
    };
  });
  define('mediator', ['base'], function(Base) {
    var $ = Base.$,
        slice = [].slice,
        separator = /\s+/,
        protos;
    function findHandlers(arr, name, callback, context) {
      return $.grep(arr, function(handler) {
        return handler && (!name || handler.e === name) && (!callback || handler.cb === callback || handler.cb._cb === callback) && (!context || handler.ctx === context);
      });
    }
    function eachEvent(events, callback, iterator) {
      $.each((events || '').split(separator), function(_, key) {
        iterator(key, callback);
      });
    }
    function triggerHanders(events, args) {
      var stoped = false,
          i = -1,
          len = events.length,
          handler;
      while (++i < len) {
        handler = events[i];
        if (handler.cb.apply(handler.ctx2, args) === false) {
          stoped = true;
          break;
        }
      }
      return !stoped;
    }
    protos = {
      on: function(name, callback, context) {
        var me = this,
            set;
        if (!callback) {
          return this;
        }
        set = this._events || (this._events = []);
        eachEvent(name, callback, function(name, callback) {
          var handler = {e: name};
          handler.cb = callback;
          handler.ctx = context;
          handler.ctx2 = context || me;
          handler.id = set.length;
          set.push(handler);
        });
        return this;
      },
      once: function(name, callback, context) {
        var me = this;
        if (!callback) {
          return me;
        }
        eachEvent(name, callback, function(name, callback) {
          var once = function() {
            me.off(name, once);
            return callback.apply(context || me, arguments);
          };
          once._cb = callback;
          me.on(name, once, context);
        });
        return me;
      },
      off: function(name, cb, ctx) {
        var events = this._events;
        if (!events) {
          return this;
        }
        if (!name && !cb && !ctx) {
          this._events = [];
          return this;
        }
        eachEvent(name, cb, function(name, cb) {
          $.each(findHandlers(events, name, cb, ctx), function() {
            delete events[this.id];
          });
        });
        return this;
      },
      trigger: function(type) {
        var args,
            events,
            allEvents;
        if (!this._events || !type) {
          return this;
        }
        args = slice.call(arguments, 1);
        events = findHandlers(this._events, type);
        allEvents = findHandlers(this._events, 'all');
        return triggerHanders(events, args) && triggerHanders(allEvents, arguments);
      }
    };
    return $.extend({installTo: function(obj) {
        return $.extend(obj, protos);
      }}, protos);
  });
  define('uploader', ['base', 'mediator'], function(Base, Mediator) {
    var $ = Base.$;
    function Uploader(opts) {
      this.options = $.extend(true, {}, Uploader.options, opts);
      this._init(this.options);
    }
    Uploader.options = {};
    Mediator.installTo(Uploader.prototype);
    $.each({
      upload: 'start-upload',
      stop: 'stop-upload',
      getFile: 'get-file',
      getFiles: 'get-files',
      addFile: 'add-file',
      addFiles: 'add-file',
      sort: 'sort-files',
      removeFile: 'remove-file',
      cancelFile: 'cancel-file',
      skipFile: 'skip-file',
      retry: 'retry',
      isInProgress: 'is-in-progress',
      makeThumb: 'make-thumb',
      md5File: 'md5-file',
      getDimension: 'get-dimension',
      addButton: 'add-btn',
      predictRuntimeType: 'predict-runtime-type',
      refresh: 'refresh',
      disable: 'disable',
      enable: 'enable',
      reset: 'reset'
    }, function(fn, command) {
      Uploader.prototype[fn] = function() {
        return this.request(command, arguments);
      };
    });
    $.extend(Uploader.prototype, {
      state: 'pending',
      _init: function(opts) {
        var me = this;
        me.request('init', opts, function() {
          me.state = 'ready';
          me.trigger('ready');
        });
      },
      option: function(key, val) {
        var opts = this.options;
        if (arguments.length > 1) {
          if ($.isPlainObject(val) && $.isPlainObject(opts[key])) {
            $.extend(opts[key], val);
          } else {
            opts[key] = val;
          }
        } else {
          return key ? opts[key] : opts;
        }
      },
      getStats: function() {
        var stats = this.request('get-stats');
        return stats ? {
          successNum: stats.numOfSuccess,
          progressNum: stats.numOfProgress,
          cancelNum: stats.numOfCancel,
          invalidNum: stats.numOfInvalid,
          uploadFailNum: stats.numOfUploadFailed,
          queueNum: stats.numOfQueue,
          interruptNum: stats.numofInterrupt
        } : {};
      },
      trigger: function(type) {
        var args = [].slice.call(arguments, 1),
            opts = this.options,
            name = 'on' + type.substring(0, 1).toUpperCase() + type.substring(1);
        if (Mediator.trigger.apply(this, arguments) === false || $.isFunction(opts[name]) && opts[name].apply(this, args) === false || $.isFunction(this[name]) && this[name].apply(this, args) === false || Mediator.trigger.apply(Mediator, [this, type].concat(args)) === false) {
          return false;
        }
        return true;
      },
      destroy: function() {
        this.request('destroy', arguments);
        this.off();
      },
      request: Base.noop
    });
    Base.create = Uploader.create = function(opts) {
      return new Uploader(opts);
    };
    Base.Uploader = Uploader;
    return Uploader;
  });
  define('runtime/runtime', ['base', 'mediator'], function(Base, Mediator) {
    var $ = Base.$,
        factories = {},
        getFirstKey = function(obj) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              return key;
            }
          }
          return null;
        };
    function Runtime(options) {
      this.options = $.extend({container: document.body}, options);
      this.uid = Base.guid('rt_');
    }
    $.extend(Runtime.prototype, {
      getContainer: function() {
        var opts = this.options,
            parent,
            container;
        if (this._container) {
          return this._container;
        }
        parent = $(opts.container || document.body);
        container = $(document.createElement('div'));
        container.attr('id', 'rt_' + this.uid);
        container.css({
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        });
        parent.append(container);
        parent.addClass('webuploader-container');
        this._container = container;
        this._parent = parent;
        return container;
      },
      init: Base.noop,
      exec: Base.noop,
      destroy: function() {
        this._container && this._container.remove();
        this._parent && this._parent.removeClass('webuploader-container');
        this.off();
      }
    });
    Runtime.orders = 'html5,flash';
    Runtime.addRuntime = function(type, factory) {
      factories[type] = factory;
    };
    Runtime.hasRuntime = function(type) {
      return !!(type ? factories[type] : getFirstKey(factories));
    };
    Runtime.create = function(opts, orders) {
      var type,
          runtime;
      orders = orders || Runtime.orders;
      $.each(orders.split(/\s*,\s*/g), function() {
        if (factories[this]) {
          type = this;
          return false;
        }
      });
      type = type || getFirstKey(factories);
      if (!type) {
        throw new Error('Runtime Error');
      }
      runtime = new factories[type](opts);
      return runtime;
    };
    Mediator.installTo(Runtime.prototype);
    return Runtime;
  });
  define('runtime/client', ['base', 'mediator', 'runtime/runtime'], function(Base, Mediator, Runtime) {
    var cache;
    cache = (function() {
      var obj = {};
      return {
        add: function(runtime) {
          obj[runtime.uid] = runtime;
        },
        get: function(ruid, standalone) {
          var i;
          if (ruid) {
            return obj[ruid];
          }
          for (i in obj) {
            if (standalone && obj[i].__standalone) {
              continue;
            }
            return obj[i];
          }
          return null;
        },
        remove: function(runtime) {
          delete obj[runtime.uid];
        }
      };
    })();
    function RuntimeClient(component, standalone) {
      var deferred = Base.Deferred(),
          runtime;
      this.uid = Base.guid('client_');
      this.runtimeReady = function(cb) {
        return deferred.done(cb);
      };
      this.connectRuntime = function(opts, cb) {
        if (runtime) {
          throw new Error('already connected!');
        }
        deferred.done(cb);
        if (typeof opts === 'string' && cache.get(opts)) {
          runtime = cache.get(opts);
        }
        runtime = runtime || cache.get(null, standalone);
        if (!runtime) {
          runtime = Runtime.create(opts, opts.runtimeOrder);
          runtime.__promise = deferred.promise();
          runtime.once('ready', deferred.resolve);
          runtime.init();
          cache.add(runtime);
          runtime.__client = 1;
        } else {
          Base.$.extend(runtime.options, opts);
          runtime.__promise.then(deferred.resolve);
          runtime.__client++;
        }
        standalone && (runtime.__standalone = standalone);
        return runtime;
      };
      this.getRuntime = function() {
        return runtime;
      };
      this.disconnectRuntime = function() {
        if (!runtime) {
          return;
        }
        runtime.__client--;
        if (runtime.__client <= 0) {
          cache.remove(runtime);
          delete runtime.__promise;
          runtime.destroy();
        }
        runtime = null;
      };
      this.exec = function() {
        if (!runtime) {
          return;
        }
        var args = Base.slice(arguments);
        component && args.unshift(component);
        return runtime.exec.apply(this, args);
      };
      this.getRuid = function() {
        return runtime && runtime.uid;
      };
      this.destroy = (function(destroy) {
        return function() {
          destroy && destroy.apply(this, arguments);
          this.trigger('destroy');
          this.off();
          this.exec('destroy');
          this.disconnectRuntime();
        };
      })(this.destroy);
    }
    Mediator.installTo(RuntimeClient.prototype);
    return RuntimeClient;
  });
  define('lib/dnd', ['base', 'mediator', 'runtime/client'], function(Base, Mediator, RuntimeClent) {
    var $ = Base.$;
    function DragAndDrop(opts) {
      opts = this.options = $.extend({}, DragAndDrop.options, opts);
      opts.container = $(opts.container);
      if (!opts.container.length) {
        return;
      }
      RuntimeClent.call(this, 'DragAndDrop');
    }
    DragAndDrop.options = {
      accept: null,
      disableGlobalDnd: false
    };
    Base.inherits(RuntimeClent, {
      constructor: DragAndDrop,
      init: function() {
        var me = this;
        me.connectRuntime(me.options, function() {
          me.exec('init');
          me.trigger('ready');
        });
      }
    });
    Mediator.installTo(DragAndDrop.prototype);
    return DragAndDrop;
  });
  define('widgets/widget', ['base', 'uploader'], function(Base, Uploader) {
    var $ = Base.$,
        _init = Uploader.prototype._init,
        _destroy = Uploader.prototype.destroy,
        IGNORE = {},
        widgetClass = [];
    function isArrayLike(obj) {
      if (!obj) {
        return false;
      }
      var length = obj.length,
          type = $.type(obj);
      if (obj.nodeType === 1 && length) {
        return true;
      }
      return type === 'array' || type !== 'function' && type !== 'string' && (length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj);
    }
    function Widget(uploader) {
      this.owner = uploader;
      this.options = uploader.options;
    }
    $.extend(Widget.prototype, {
      init: Base.noop,
      invoke: function(apiName, args) {
        var map = this.responseMap;
        if (!map || !(apiName in map) || !(map[apiName] in this) || !$.isFunction(this[map[apiName]])) {
          return IGNORE;
        }
        return this[map[apiName]].apply(this, args);
      },
      request: function() {
        return this.owner.request.apply(this.owner, arguments);
      }
    });
    $.extend(Uploader.prototype, {
      _init: function() {
        var me = this,
            widgets = me._widgets = [],
            deactives = me.options.disableWidgets || '';
        $.each(widgetClass, function(_, klass) {
          (!deactives || !~deactives.indexOf(klass._name)) && widgets.push(new klass(me));
        });
        return _init.apply(me, arguments);
      },
      request: function(apiName, args, callback) {
        var i = 0,
            widgets = this._widgets,
            len = widgets && widgets.length,
            rlts = [],
            dfds = [],
            widget,
            rlt,
            promise,
            key;
        args = isArrayLike(args) ? args : [args];
        for (; i < len; i++) {
          widget = widgets[i];
          rlt = widget.invoke(apiName, args);
          if (rlt !== IGNORE) {
            if (Base.isPromise(rlt)) {
              dfds.push(rlt);
            } else {
              rlts.push(rlt);
            }
          }
        }
        if (callback || dfds.length) {
          promise = Base.when.apply(Base, dfds);
          key = promise.pipe ? 'pipe' : 'then';
          return promise[key](function() {
            var deferred = Base.Deferred(),
                args = arguments;
            if (args.length === 1) {
              args = args[0];
            }
            setTimeout(function() {
              deferred.resolve(args);
            }, 1);
            return deferred.promise();
          })[callback ? key : 'done'](callback || Base.noop);
        } else {
          return rlts[0];
        }
      },
      destroy: function() {
        _destroy.apply(this, arguments);
        this._widgets = null;
      }
    });
    Uploader.register = Widget.register = function(responseMap, widgetProto) {
      var map = {
        init: 'init',
        destroy: 'destroy',
        name: 'anonymous'
      },
          klass;
      if (arguments.length === 1) {
        widgetProto = responseMap;
        $.each(widgetProto, function(key) {
          if (key[0] === '_' || key === 'name') {
            key === 'name' && (map.name = widgetProto.name);
            return;
          }
          map[key.replace(/[A-Z]/g, '-$&').toLowerCase()] = key;
        });
      } else {
        map = $.extend(map, responseMap);
      }
      widgetProto.responseMap = map;
      klass = Base.inherits(Widget, widgetProto);
      klass._name = map.name;
      widgetClass.push(klass);
      return klass;
    };
    Uploader.unRegister = Widget.unRegister = function(name) {
      if (!name || name === 'anonymous') {
        return;
      }
      for (var i = widgetClass.length; i--; ) {
        if (widgetClass[i]._name === name) {
          widgetClass.splice(i, 1);
        }
      }
    };
    return Widget;
  });
  define('widgets/filednd', ['base', 'uploader', 'lib/dnd', 'widgets/widget'], function(Base, Uploader, Dnd) {
    var $ = Base.$;
    Uploader.options.dnd = '';
    return Uploader.register({
      name: 'dnd',
      init: function(opts) {
        if (!opts.dnd || this.request('predict-runtime-type') !== 'html5') {
          return;
        }
        var me = this,
            deferred = Base.Deferred(),
            options = $.extend({}, {
              disableGlobalDnd: opts.disableGlobalDnd,
              container: opts.dnd,
              accept: opts.accept
            }),
            dnd;
        this.dnd = dnd = new Dnd(options);
        dnd.once('ready', deferred.resolve);
        dnd.on('drop', function(files) {
          me.request('add-file', [files]);
        });
        dnd.on('accept', function(items) {
          return me.owner.trigger('dndAccept', items);
        });
        dnd.init();
        return deferred.promise();
      },
      destroy: function() {
        this.dnd && this.dnd.destroy();
      }
    });
  });
  define('lib/filepaste', ['base', 'mediator', 'runtime/client'], function(Base, Mediator, RuntimeClent) {
    var $ = Base.$;
    function FilePaste(opts) {
      opts = this.options = $.extend({}, opts);
      opts.container = $(opts.container || document.body);
      RuntimeClent.call(this, 'FilePaste');
    }
    Base.inherits(RuntimeClent, {
      constructor: FilePaste,
      init: function() {
        var me = this;
        me.connectRuntime(me.options, function() {
          me.exec('init');
          me.trigger('ready');
        });
      }
    });
    Mediator.installTo(FilePaste.prototype);
    return FilePaste;
  });
  define('widgets/filepaste', ['base', 'uploader', 'lib/filepaste', 'widgets/widget'], function(Base, Uploader, FilePaste) {
    var $ = Base.$;
    return Uploader.register({
      name: 'paste',
      init: function(opts) {
        if (!opts.paste || this.request('predict-runtime-type') !== 'html5') {
          return;
        }
        var me = this,
            deferred = Base.Deferred(),
            options = $.extend({}, {
              container: opts.paste,
              accept: opts.accept
            }),
            paste;
        this.paste = paste = new FilePaste(options);
        paste.once('ready', deferred.resolve);
        paste.on('paste', function(files) {
          me.owner.request('add-file', [files]);
        });
        paste.init();
        return deferred.promise();
      },
      destroy: function() {
        this.paste && this.paste.destroy();
      }
    });
  });
  define('lib/blob', ['base', 'runtime/client'], function(Base, RuntimeClient) {
    function Blob(ruid, source) {
      var me = this;
      me.source = source;
      me.ruid = ruid;
      this.size = source.size || 0;
      if (!source.type && this.ext && ~'jpg,jpeg,png,gif,bmp'.indexOf(this.ext)) {
        this.type = 'image/' + (this.ext === 'jpg' ? 'jpeg' : this.ext);
      } else {
        this.type = source.type || 'application/octet-stream';
      }
      RuntimeClient.call(me, 'Blob');
      this.uid = source.uid || this.uid;
      if (ruid) {
        me.connectRuntime(ruid);
      }
    }
    Base.inherits(RuntimeClient, {
      constructor: Blob,
      slice: function(start, end) {
        return this.exec('slice', start, end);
      },
      getSource: function() {
        return this.source;
      }
    });
    return Blob;
  });
  define('lib/file', ['base', 'lib/blob'], function(Base, Blob) {
    var uid = 1,
        rExt = /\.([^.]+)$/;
    function File(ruid, file) {
      var ext;
      this.name = file.name || ('untitled' + uid++);
      ext = rExt.exec(file.name) ? RegExp.$1.toLowerCase() : '';
      if (!ext && file.type) {
        ext = /\/(jpg|jpeg|png|gif|bmp)$/i.exec(file.type) ? RegExp.$1.toLowerCase() : '';
        this.name += '.' + ext;
      }
      this.ext = ext;
      this.lastModifiedDate = file.lastModifiedDate || (new Date()).toLocaleString();
      Blob.apply(this, arguments);
    }
    return Base.inherits(Blob, File);
  });
  define('lib/filepicker', ['base', 'runtime/client', 'lib/file'], function(Base, RuntimeClient, File) {
    var $ = Base.$;
    function FilePicker(opts) {
      opts = this.options = $.extend({}, FilePicker.options, opts);
      opts.container = $(opts.id);
      if (!opts.container.length) {
        throw new Error('按钮指定错误');
      }
      opts.innerHTML = opts.innerHTML || opts.label || opts.container.html() || '';
      opts.button = $(opts.button || document.createElement('div'));
      opts.button.html(opts.innerHTML);
      opts.container.html(opts.button);
      RuntimeClient.call(this, 'FilePicker', true);
    }
    FilePicker.options = {
      button: null,
      container: null,
      label: null,
      innerHTML: null,
      multiple: true,
      accept: null,
      name: 'file',
      style: 'webuploader-pick'
    };
    Base.inherits(RuntimeClient, {
      constructor: FilePicker,
      init: function() {
        var me = this,
            opts = me.options,
            button = opts.button,
            style = opts.style;
        if (style)
          button.addClass('webuploader-pick');
        me.on('all', function(type) {
          var files;
          switch (type) {
            case 'mouseenter':
              if (style)
                button.addClass('webuploader-pick-hover');
              break;
            case 'mouseleave':
              if (style)
                button.removeClass('webuploader-pick-hover');
              break;
            case 'change':
              files = me.exec('getFiles');
              me.trigger('select', $.map(files, function(file) {
                file = new File(me.getRuid(), file);
                file._refer = opts.container;
                return file;
              }), opts.container);
              break;
          }
        });
        me.connectRuntime(opts, function() {
          me.refresh();
          me.exec('init', opts);
          me.trigger('ready');
        });
        this._resizeHandler = Base.bindFn(this.refresh, this);
        $(window).on('resize', this._resizeHandler);
      },
      refresh: function() {
        var shimContainer = this.getRuntime().getContainer(),
            button = this.options.button,
            width = button.outerWidth ? button.outerWidth() : button.width(),
            height = button.outerHeight ? button.outerHeight() : button.height(),
            pos = button.offset();
        width && height && shimContainer.css({
          bottom: 'auto',
          right: 'auto',
          width: width + 'px',
          height: height + 'px'
        }).offset(pos);
      },
      enable: function() {
        var btn = this.options.button;
        btn.removeClass('webuploader-pick-disable');
        this.refresh();
      },
      disable: function() {
        var btn = this.options.button;
        this.getRuntime().getContainer().css({top: '-99999px'});
        btn.addClass('webuploader-pick-disable');
      },
      destroy: function() {
        var btn = this.options.button;
        $(window).off('resize', this._resizeHandler);
        btn.removeClass('webuploader-pick-disable webuploader-pick-hover ' + 'webuploader-pick');
      }
    });
    return FilePicker;
  });
  define('widgets/filepicker', ['base', 'uploader', 'lib/filepicker', 'widgets/widget'], function(Base, Uploader, FilePicker) {
    var $ = Base.$;
    $.extend(Uploader.options, {
      pick: null,
      accept: null
    });
    return Uploader.register({
      name: 'picker',
      init: function(opts) {
        this.pickers = [];
        return opts.pick && this.addBtn(opts.pick);
      },
      refresh: function() {
        $.each(this.pickers, function() {
          this.refresh();
        });
      },
      addBtn: function(pick) {
        var me = this,
            opts = me.options,
            accept = opts.accept,
            promises = [];
        if (!pick) {
          return;
        }
        $.isPlainObject(pick) || (pick = {id: pick});
        $(pick.id).each(function() {
          var options,
              picker,
              deferred;
          deferred = Base.Deferred();
          options = $.extend({}, pick, {
            accept: $.isPlainObject(accept) ? [accept] : accept,
            swf: opts.swf,
            runtimeOrder: opts.runtimeOrder,
            id: this
          });
          picker = new FilePicker(options);
          picker.once('ready', deferred.resolve);
          picker.on('select', function(files) {
            me.owner.request('add-file', [files]);
          });
          picker.on('dialogopen', function() {
            me.owner.trigger('dialogOpen', picker.button);
          });
          picker.init();
          me.pickers.push(picker);
          promises.push(deferred.promise());
        });
        return Base.when.apply(Base, promises);
      },
      disable: function() {
        $.each(this.pickers, function() {
          this.disable();
        });
      },
      enable: function() {
        $.each(this.pickers, function() {
          this.enable();
        });
      },
      destroy: function() {
        $.each(this.pickers, function() {
          this.destroy();
        });
        this.pickers = null;
      }
    });
  });
  define('lib/image', ['base', 'runtime/client', 'lib/blob'], function(Base, RuntimeClient, Blob) {
    var $ = Base.$;
    function Image(opts) {
      this.options = $.extend({}, Image.options, opts);
      RuntimeClient.call(this, 'Image');
      this.on('load', function() {
        this._info = this.exec('info');
        this._meta = this.exec('meta');
      });
    }
    Image.options = {
      quality: 90,
      crop: false,
      preserveHeaders: false,
      allowMagnify: false
    };
    Base.inherits(RuntimeClient, {
      constructor: Image,
      info: function(val) {
        if (val) {
          this._info = val;
          return this;
        }
        return this._info;
      },
      meta: function(val) {
        if (val) {
          this._meta = val;
          return this;
        }
        return this._meta;
      },
      loadFromBlob: function(blob) {
        var me = this,
            ruid = blob.getRuid();
        this.connectRuntime(ruid, function() {
          me.exec('init', me.options);
          me.exec('loadFromBlob', blob);
        });
      },
      resize: function() {
        var args = Base.slice(arguments);
        return this.exec.apply(this, ['resize'].concat(args));
      },
      crop: function() {
        var args = Base.slice(arguments);
        return this.exec.apply(this, ['crop'].concat(args));
      },
      getAsDataUrl: function(type) {
        return this.exec('getAsDataUrl', type);
      },
      getAsBlob: function(type) {
        var blob = this.exec('getAsBlob', type);
        return new Blob(this.getRuid(), blob);
      }
    });
    return Image;
  });
  define('widgets/image', ['base', 'uploader', 'lib/image', 'widgets/widget'], function(Base, Uploader, Image) {
    var $ = Base.$,
        throttle;
    throttle = (function(max) {
      var occupied = 0,
          waiting = [],
          tick = function() {
            var item;
            while (waiting.length && occupied < max) {
              item = waiting.shift();
              occupied += item[0];
              item[1]();
            }
          };
      return function(emiter, size, cb) {
        waiting.push([size, cb]);
        emiter.once('destroy', function() {
          occupied -= size;
          setTimeout(tick, 1);
        });
        setTimeout(tick, 1);
      };
    })(5 * 1024 * 1024);
    $.extend(Uploader.options, {
      thumb: {
        width: 110,
        height: 110,
        quality: 70,
        allowMagnify: true,
        crop: true,
        preserveHeaders: false,
        type: 'image/jpeg'
      },
      compress: {
        width: 1600,
        height: 1600,
        quality: 90,
        allowMagnify: false,
        crop: false,
        preserveHeaders: true
      }
    });
    return Uploader.register({
      name: 'image',
      makeThumb: function(file, cb, width, height) {
        var opts,
            image;
        file = this.request('get-file', file);
        if (!file.type.match(/^image/)) {
          cb(true);
          return;
        }
        opts = $.extend({}, this.options.thumb);
        if ($.isPlainObject(width)) {
          opts = $.extend(opts, width);
          width = null;
        }
        width = width || opts.width;
        height = height || opts.height;
        image = new Image(opts);
        image.once('load', function() {
          file._info = file._info || image.info();
          file._meta = file._meta || image.meta();
          if (width <= 1 && width > 0) {
            width = file._info.width * width;
          }
          if (height <= 1 && height > 0) {
            height = file._info.height * height;
          }
          image.resize(width, height);
        });
        image.once('complete', function() {
          cb(false, image.getAsDataUrl(opts.type));
          image.destroy();
        });
        image.once('error', function(reason) {
          cb(reason || true);
          image.destroy();
        });
        throttle(image, file.source.size, function() {
          file._info && image.info(file._info);
          file._meta && image.meta(file._meta);
          image.loadFromBlob(file.source);
        });
      },
      beforeSendFile: function(file) {
        var opts = this.options.compress || this.options.resize,
            compressSize = opts && opts.compressSize || 0,
            noCompressIfLarger = opts && opts.noCompressIfLarger || false,
            image,
            deferred;
        file = this.request('get-file', file);
        if (!opts || !~'image/jpeg,image/jpg'.indexOf(file.type) || file.size < compressSize || file._compressed) {
          return;
        }
        opts = $.extend({}, opts);
        deferred = Base.Deferred();
        image = new Image(opts);
        deferred.always(function() {
          image.destroy();
          image = null;
        });
        image.once('error', deferred.reject);
        image.once('load', function() {
          var width = opts.width,
              height = opts.height;
          file._info = file._info || image.info();
          file._meta = file._meta || image.meta();
          if (width <= 1 && width > 0) {
            width = file._info.width * width;
          }
          if (height <= 1 && height > 0) {
            height = file._info.height * height;
          }
          image.resize(width, height);
        });
        image.once('complete', function() {
          var blob,
              size;
          try {
            blob = image.getAsBlob(opts.type);
            size = file.size;
            if (!noCompressIfLarger || blob.size < size) {
              file.source = blob;
              file.size = blob.size;
              file.trigger('resize', blob.size, size);
            }
            file._compressed = true;
            deferred.resolve();
          } catch (e) {
            deferred.resolve();
          }
        });
        file._info && image.info(file._info);
        file._meta && image.meta(file._meta);
        image.loadFromBlob(file.source);
        return deferred.promise();
      }
    });
  });
  define('file', ['base', 'mediator'], function(Base, Mediator) {
    var $ = Base.$,
        idPrefix = 'WU_FILE_',
        idSuffix = 0,
        rExt = /\.([^.]+)$/,
        statusMap = {};
    function gid() {
      return idPrefix + idSuffix++;
    }
    function WUFile(source) {
      this.name = source.name || 'Untitled';
      this.size = source.size || 0;
      this.type = source.type || 'application/octet-stream';
      this.lastModifiedDate = source.lastModifiedDate || (new Date() * 1);
      this.id = gid();
      this.ext = rExt.exec(this.name) ? RegExp.$1 : '';
      this.statusText = '';
      statusMap[this.id] = WUFile.Status.INITED;
      this.source = source;
      this.loaded = 0;
      this.on('error', function(msg) {
        this.setStatus(WUFile.Status.ERROR, msg);
      });
    }
    $.extend(WUFile.prototype, {
      setStatus: function(status, text) {
        var prevStatus = statusMap[this.id];
        typeof text !== 'undefined' && (this.statusText = text);
        if (status !== prevStatus) {
          statusMap[this.id] = status;
          this.trigger('statuschange', status, prevStatus);
        }
      },
      getStatus: function() {
        return statusMap[this.id];
      },
      getSource: function() {
        return this.source;
      },
      destroy: function() {
        this.off();
        delete statusMap[this.id];
      }
    });
    Mediator.installTo(WUFile.prototype);
    WUFile.Status = {
      INITED: 'inited',
      QUEUED: 'queued',
      PROGRESS: 'progress',
      ERROR: 'error',
      COMPLETE: 'complete',
      CANCELLED: 'cancelled',
      INTERRUPT: 'interrupt',
      INVALID: 'invalid'
    };
    return WUFile;
  });
  define('queue', ['base', 'mediator', 'file'], function(Base, Mediator, WUFile) {
    var $ = Base.$,
        STATUS = WUFile.Status;
    function Queue() {
      this.stats = {
        numOfQueue: 0,
        numOfSuccess: 0,
        numOfCancel: 0,
        numOfProgress: 0,
        numOfUploadFailed: 0,
        numOfInvalid: 0,
        numofDeleted: 0,
        numofInterrupt: 0
      };
      this._queue = [];
      this._map = {};
    }
    $.extend(Queue.prototype, {
      append: function(file) {
        this._queue.push(file);
        this._fileAdded(file);
        return this;
      },
      prepend: function(file) {
        this._queue.unshift(file);
        this._fileAdded(file);
        return this;
      },
      getFile: function(fileId) {
        if (typeof fileId !== 'string') {
          return fileId;
        }
        return this._map[fileId];
      },
      fetch: function(status) {
        var len = this._queue.length,
            i,
            file;
        status = status || STATUS.QUEUED;
        for (i = 0; i < len; i++) {
          file = this._queue[i];
          if (status === file.getStatus()) {
            return file;
          }
        }
        return null;
      },
      sort: function(fn) {
        if (typeof fn === 'function') {
          this._queue.sort(fn);
        }
      },
      getFiles: function() {
        var sts = [].slice.call(arguments, 0),
            ret = [],
            i = 0,
            len = this._queue.length,
            file;
        for (; i < len; i++) {
          file = this._queue[i];
          if (sts.length && !~$.inArray(file.getStatus(), sts)) {
            continue;
          }
          ret.push(file);
        }
        return ret;
      },
      removeFile: function(file) {
        var me = this,
            existing = this._map[file.id];
        if (existing) {
          delete this._map[file.id];
          file.destroy();
          this.stats.numofDeleted++;
        }
      },
      _fileAdded: function(file) {
        var me = this,
            existing = this._map[file.id];
        if (!existing) {
          this._map[file.id] = file;
          file.on('statuschange', function(cur, pre) {
            me._onFileStatusChange(cur, pre);
          });
        }
      },
      _onFileStatusChange: function(curStatus, preStatus) {
        var stats = this.stats;
        switch (preStatus) {
          case STATUS.PROGRESS:
            stats.numOfProgress--;
            break;
          case STATUS.QUEUED:
            stats.numOfQueue--;
            break;
          case STATUS.ERROR:
            stats.numOfUploadFailed--;
            break;
          case STATUS.INVALID:
            stats.numOfInvalid--;
            break;
          case STATUS.INTERRUPT:
            stats.numofInterrupt--;
            break;
        }
        switch (curStatus) {
          case STATUS.QUEUED:
            stats.numOfQueue++;
            break;
          case STATUS.PROGRESS:
            stats.numOfProgress++;
            break;
          case STATUS.ERROR:
            stats.numOfUploadFailed++;
            break;
          case STATUS.COMPLETE:
            stats.numOfSuccess++;
            break;
          case STATUS.CANCELLED:
            stats.numOfCancel++;
            break;
          case STATUS.INVALID:
            stats.numOfInvalid++;
            break;
          case STATUS.INTERRUPT:
            stats.numofInterrupt++;
            break;
        }
      }
    });
    Mediator.installTo(Queue.prototype);
    return Queue;
  });
  define('widgets/queue', ['base', 'uploader', 'queue', 'file', 'lib/file', 'runtime/client', 'widgets/widget'], function(Base, Uploader, Queue, WUFile, File, RuntimeClient) {
    var $ = Base.$,
        rExt = /\.\w+$/,
        Status = WUFile.Status;
    return Uploader.register({
      name: 'queue',
      init: function(opts) {
        var me = this,
            deferred,
            len,
            i,
            item,
            arr,
            accept,
            runtime;
        if ($.isPlainObject(opts.accept)) {
          opts.accept = [opts.accept];
        }
        if (opts.accept) {
          arr = [];
          for (i = 0, len = opts.accept.length; i < len; i++) {
            item = opts.accept[i].extensions;
            item && arr.push(item);
          }
          if (arr.length) {
            accept = '\\.' + arr.join(',').replace(/,/g, '$|\\.').replace(/\*/g, '.*') + '$';
          }
          me.accept = new RegExp(accept, 'i');
        }
        me.queue = new Queue();
        me.stats = me.queue.stats;
        if (this.request('predict-runtime-type') !== 'html5') {
          return;
        }
        deferred = Base.Deferred();
        this.placeholder = runtime = new RuntimeClient('Placeholder');
        runtime.connectRuntime({runtimeOrder: 'html5'}, function() {
          me._ruid = runtime.getRuid();
          deferred.resolve();
        });
        return deferred.promise();
      },
      _wrapFile: function(file) {
        if (!(file instanceof WUFile)) {
          if (!(file instanceof File)) {
            if (!this._ruid) {
              throw new Error('Can\'t add external files.');
            }
            file = new File(this._ruid, file);
          }
          file = new WUFile(file);
        }
        return file;
      },
      acceptFile: function(file) {
        var invalid = !file || !file.size || this.accept && rExt.exec(file.name) && !this.accept.test(file.name);
        return !invalid;
      },
      _addFile: function(file) {
        var me = this;
        file = me._wrapFile(file);
        if (!me.owner.trigger('beforeFileQueued', file)) {
          return;
        }
        if (!me.acceptFile(file)) {
          me.owner.trigger('error', 'Q_TYPE_DENIED', file);
          return;
        }
        me.queue.append(file);
        me.owner.trigger('fileQueued', file);
        return file;
      },
      getFile: function(fileId) {
        return this.queue.getFile(fileId);
      },
      addFile: function(files) {
        var me = this;
        if (!files.length) {
          files = [files];
        }
        files = $.map(files, function(file) {
          return me._addFile(file);
        });
        if (files.length) {
          me.owner.trigger('filesQueued', files);
          if (me.options.auto) {
            setTimeout(function() {
              me.request('start-upload');
            }, 20);
          }
        }
      },
      getStats: function() {
        return this.stats;
      },
      removeFile: function(file, remove) {
        var me = this;
        file = file.id ? file : me.queue.getFile(file);
        this.request('cancel-file', file);
        if (remove) {
          this.queue.removeFile(file);
        }
      },
      getFiles: function() {
        return this.queue.getFiles.apply(this.queue, arguments);
      },
      fetchFile: function() {
        return this.queue.fetch.apply(this.queue, arguments);
      },
      retry: function(file, noForceStart) {
        var me = this,
            files,
            i,
            len;
        if (file) {
          file = file.id ? file : me.queue.getFile(file);
          file.setStatus(Status.QUEUED);
          noForceStart || me.request('start-upload');
          return;
        }
        files = me.queue.getFiles(Status.ERROR);
        i = 0;
        len = files.length;
        for (; i < len; i++) {
          file = files[i];
          file.setStatus(Status.QUEUED);
        }
        me.request('start-upload');
      },
      sortFiles: function() {
        return this.queue.sort.apply(this.queue, arguments);
      },
      reset: function() {
        this.owner.trigger('reset');
        this.queue = new Queue();
        this.stats = this.queue.stats;
      },
      destroy: function() {
        this.reset();
        this.placeholder && this.placeholder.destroy();
      }
    });
  });
  define('widgets/runtime', ['uploader', 'runtime/runtime', 'widgets/widget'], function(Uploader, Runtime) {
    Uploader.support = function() {
      return Runtime.hasRuntime.apply(Runtime, arguments);
    };
    return Uploader.register({
      name: 'runtime',
      init: function() {
        if (!this.predictRuntimeType()) {
          throw Error('Runtime Error');
        }
      },
      predictRuntimeType: function() {
        var orders = this.options.runtimeOrder || Runtime.orders,
            type = this.type,
            i,
            len;
        if (!type) {
          orders = orders.split(/\s*,\s*/g);
          for (i = 0, len = orders.length; i < len; i++) {
            if (Runtime.hasRuntime(orders[i])) {
              this.type = type = orders[i];
              break;
            }
          }
        }
        return type;
      }
    });
  });
  define('lib/transport', ['base', 'runtime/client', 'mediator'], function(Base, RuntimeClient, Mediator) {
    var $ = Base.$;
    function Transport(opts) {
      var me = this;
      opts = me.options = $.extend(true, {}, Transport.options, opts || {});
      RuntimeClient.call(this, 'Transport');
      this._blob = null;
      this._formData = opts.formData || {};
      this._headers = opts.headers || {};
      this.on('progress', this._timeout);
      this.on('load error', function() {
        me.trigger('progress', 1);
        clearTimeout(me._timer);
      });
    }
    Transport.options = {
      server: '',
      method: 'POST',
      withCredentials: false,
      fileVal: 'file',
      timeout: 2 * 60 * 1000,
      formData: {},
      headers: {},
      sendAsBinary: false
    };
    $.extend(Transport.prototype, {
      appendBlob: function(key, blob, filename) {
        var me = this,
            opts = me.options;
        if (me.getRuid()) {
          me.disconnectRuntime();
        }
        me.connectRuntime(blob.ruid, function() {
          me.exec('init');
        });
        me._blob = blob;
        opts.fileVal = key || opts.fileVal;
        opts.filename = filename || opts.filename;
      },
      append: function(key, value) {
        if (typeof key === 'object') {
          $.extend(this._formData, key);
        } else {
          this._formData[key] = value;
        }
      },
      setRequestHeader: function(key, value) {
        if (typeof key === 'object') {
          $.extend(this._headers, key);
        } else {
          this._headers[key] = value;
        }
      },
      send: function(method) {
        this.exec('send', method);
        this._timeout();
      },
      abort: function() {
        clearTimeout(this._timer);
        return this.exec('abort');
      },
      destroy: function() {
        this.trigger('destroy');
        this.off();
        this.exec('destroy');
        this.disconnectRuntime();
      },
      getResponse: function() {
        return this.exec('getResponse');
      },
      getResponseAsJson: function() {
        return this.exec('getResponseAsJson');
      },
      getStatus: function() {
        return this.exec('getStatus');
      },
      _timeout: function() {
        var me = this,
            duration = me.options.timeout;
        if (!duration) {
          return;
        }
        clearTimeout(me._timer);
        me._timer = setTimeout(function() {
          me.abort();
          me.trigger('error', 'timeout');
        }, duration);
      }
    });
    Mediator.installTo(Transport.prototype);
    return Transport;
  });
  define('widgets/upload', ['base', 'uploader', 'file', 'lib/transport', 'widgets/widget'], function(Base, Uploader, WUFile, Transport) {
    var $ = Base.$,
        isPromise = Base.isPromise,
        Status = WUFile.Status;
    $.extend(Uploader.options, {
      prepareNextFile: false,
      chunked: false,
      chunkSize: 5 * 1024 * 1024,
      chunkRetry: 2,
      threads: 3,
      formData: {}
    });
    function CuteFile(file, chunkSize) {
      var pending = [],
          blob = file.source,
          total = blob.size,
          chunks = chunkSize ? Math.ceil(total / chunkSize) : 1,
          start = 0,
          index = 0,
          len,
          api;
      api = {
        file: file,
        has: function() {
          return !!pending.length;
        },
        shift: function() {
          return pending.shift();
        },
        unshift: function(block) {
          pending.unshift(block);
        }
      };
      while (index < chunks) {
        len = Math.min(chunkSize, total - start);
        pending.push({
          file: file,
          start: start,
          end: chunkSize ? (start + len) : total,
          total: total,
          chunks: chunks,
          chunk: index++,
          cuted: api
        });
        start += len;
      }
      file.blocks = pending.concat();
      file.remaning = pending.length;
      return api;
    }
    Uploader.register({
      name: 'upload',
      init: function() {
        var owner = this.owner,
            me = this;
        this.runing = false;
        this.progress = false;
        owner.on('startUpload', function() {
          me.progress = true;
        }).on('uploadFinished', function() {
          me.progress = false;
        });
        this.pool = [];
        this.stack = [];
        this.pending = [];
        this.remaning = 0;
        this.__tick = Base.bindFn(this._tick, this);
        owner.on('uploadComplete', function(file) {
          file.blocks && $.each(file.blocks, function(_, v) {
            v.transport && (v.transport.abort(), v.transport.destroy());
            delete v.transport;
          });
          delete file.blocks;
          delete file.remaning;
        });
      },
      reset: function() {
        this.request('stop-upload', true);
        this.runing = false;
        this.pool = [];
        this.stack = [];
        this.pending = [];
        this.remaning = 0;
        this._trigged = false;
        this._promise = null;
      },
      startUpload: function(file) {
        var me = this;
        $.each(me.request('get-files', Status.INVALID), function() {
          me.request('remove-file', this);
        });
        if (file) {
          file = file.id ? file : me.request('get-file', file);
          if (file.getStatus() === Status.INTERRUPT) {
            file.setStatus(Status.QUEUED);
            $.each(me.pool, function(_, v) {
              if (v.file !== file) {
                return;
              }
              v.transport && v.transport.send();
              file.setStatus(Status.PROGRESS);
            });
          } else if (file.getStatus() !== Status.PROGRESS) {
            file.setStatus(Status.QUEUED);
          }
        } else {
          $.each(me.request('get-files', [Status.INITED]), function() {
            this.setStatus(Status.QUEUED);
          });
        }
        if (me.runing) {
          return Base.nextTick(me.__tick);
        }
        me.runing = true;
        var files = [];
        file || $.each(me.pool, function(_, v) {
          var file = v.file;
          if (file.getStatus() === Status.INTERRUPT) {
            me._trigged = false;
            files.push(file);
            v.transport && v.transport.send();
          }
        });
        $.each(files, function() {
          this.setStatus(Status.PROGRESS);
        });
        file || $.each(me.request('get-files', Status.INTERRUPT), function() {
          this.setStatus(Status.PROGRESS);
        });
        me._trigged = false;
        Base.nextTick(me.__tick);
        me.owner.trigger('startUpload');
      },
      stopUpload: function(file, interrupt) {
        var me = this,
            block;
        if (file === true) {
          interrupt = file;
          file = null;
        }
        if (me.runing === false) {
          return;
        }
        if (file) {
          file = file.id ? file : me.request('get-file', file);
          if (file.getStatus() !== Status.PROGRESS && file.getStatus() !== Status.QUEUED) {
            return;
          }
          file.setStatus(Status.INTERRUPT);
          $.each(me.pool, function(_, v) {
            if (v.file === file) {
              block = v;
              return false;
            }
          });
          block.transport && block.transport.abort();
          if (interrupt) {
            me._putback(block);
            me._popBlock(block);
          }
          return Base.nextTick(me.__tick);
        }
        me.runing = false;
        if (this._promise && this._promise.file) {
          this._promise.file.setStatus(Status.INTERRUPT);
        }
        interrupt && $.each(me.pool, function(_, v) {
          v.transport && v.transport.abort();
          v.file.setStatus(Status.INTERRUPT);
        });
        me.owner.trigger('stopUpload');
      },
      cancelFile: function(file) {
        file = file.id ? file : this.request('get-file', file);
        file.blocks && $.each(file.blocks, function(_, v) {
          var _tr = v.transport;
          if (_tr) {
            _tr.abort();
            _tr.destroy();
            delete v.transport;
          }
        });
        file.setStatus(Status.CANCELLED);
        this.owner.trigger('fileDequeued', file);
      },
      isInProgress: function() {
        return !!this.progress;
      },
      _getStats: function() {
        return this.request('get-stats');
      },
      skipFile: function(file, status) {
        file = file.id ? file : this.request('get-file', file);
        file.setStatus(status || Status.COMPLETE);
        file.skipped = true;
        file.blocks && $.each(file.blocks, function(_, v) {
          var _tr = v.transport;
          if (_tr) {
            _tr.abort();
            _tr.destroy();
            delete v.transport;
          }
        });
        this.owner.trigger('uploadSkip', file);
      },
      _tick: function() {
        var me = this,
            opts = me.options,
            fn,
            val;
        if (me._promise) {
          return me._promise.always(me.__tick);
        }
        if (me.pool.length < opts.threads && (val = me._nextBlock())) {
          me._trigged = false;
          fn = function(val) {
            me._promise = null;
            val && val.file && me._startSend(val);
            Base.nextTick(me.__tick);
          };
          me._promise = isPromise(val) ? val.always(fn) : fn(val);
        } else if (!me.remaning && !me._getStats().numOfQueue && !me._getStats().numofInterrupt) {
          me.runing = false;
          me._trigged || Base.nextTick(function() {
            me.owner.trigger('uploadFinished');
          });
          me._trigged = true;
        }
      },
      _putback: function(block) {
        var idx;
        block.cuted.unshift(block);
        idx = this.stack.indexOf(block.cuted);
        if (!~idx) {
          this.stack.unshift(block.cuted);
        }
      },
      _getStack: function() {
        var i = 0,
            act;
        while ((act = this.stack[i++])) {
          if (act.has() && act.file.getStatus() === Status.PROGRESS) {
            return act;
          } else if (!act.has() || act.file.getStatus() !== Status.PROGRESS && act.file.getStatus() !== Status.INTERRUPT) {
            this.stack.splice(--i, 1);
          }
        }
        return null;
      },
      _nextBlock: function() {
        var me = this,
            opts = me.options,
            act,
            next,
            done,
            preparing;
        if ((act = this._getStack())) {
          if (opts.prepareNextFile && !me.pending.length) {
            me._prepareNextFile();
          }
          return act.shift();
        } else if (me.runing) {
          if (!me.pending.length && me._getStats().numOfQueue) {
            me._prepareNextFile();
          }
          next = me.pending.shift();
          done = function(file) {
            if (!file) {
              return null;
            }
            act = CuteFile(file, opts.chunked ? opts.chunkSize : 0);
            me.stack.push(act);
            return act.shift();
          };
          if (isPromise(next)) {
            preparing = next.file;
            next = next[next.pipe ? 'pipe' : 'then'](done);
            next.file = preparing;
            return next;
          }
          return done(next);
        }
      },
      _prepareNextFile: function() {
        var me = this,
            file = me.request('fetch-file'),
            pending = me.pending,
            promise;
        if (file) {
          promise = me.request('before-send-file', file, function() {
            if (file.getStatus() === Status.PROGRESS || file.getStatus() === Status.INTERRUPT) {
              return file;
            }
            return me._finishFile(file);
          });
          me.owner.trigger('uploadStart', file);
          file.setStatus(Status.PROGRESS);
          promise.file = file;
          promise.done(function() {
            var idx = $.inArray(promise, pending);
            ~idx && pending.splice(idx, 1, file);
          });
          promise.fail(function(reason) {
            file.setStatus(Status.ERROR, reason);
            me.owner.trigger('uploadError', file, reason);
            me.owner.trigger('uploadComplete', file);
          });
          pending.push(promise);
        }
      },
      _popBlock: function(block) {
        var idx = $.inArray(block, this.pool);
        this.pool.splice(idx, 1);
        block.file.remaning--;
        this.remaning--;
      },
      _startSend: function(block) {
        var me = this,
            file = block.file,
            promise;
        if (file.getStatus() !== Status.PROGRESS) {
          if (file.getStatus() === Status.INTERRUPT) {
            me._putback(block);
          }
          return;
        }
        me.pool.push(block);
        me.remaning++;
        block.blob = block.chunks === 1 ? file.source : file.source.slice(block.start, block.end);
        promise = me.request('before-send', block, function() {
          if (file.getStatus() === Status.PROGRESS) {
            me._doSend(block);
          } else {
            me._popBlock(block);
            Base.nextTick(me.__tick);
          }
        });
        promise.fail(function() {
          if (file.remaning === 1) {
            me._finishFile(file).always(function() {
              block.percentage = 1;
              me._popBlock(block);
              me.owner.trigger('uploadComplete', file);
              Base.nextTick(me.__tick);
            });
          } else {
            block.percentage = 1;
            me.updateFileProgress(file);
            me._popBlock(block);
            Base.nextTick(me.__tick);
          }
        });
      },
      _doSend: function(block) {
        var me = this,
            owner = me.owner,
            opts = me.options,
            file = block.file,
            tr = new Transport(opts),
            data = $.extend({}, opts.formData),
            headers = $.extend({}, opts.headers),
            requestAccept,
            ret;
        block.transport = tr;
        tr.on('destroy', function() {
          delete block.transport;
          me._popBlock(block);
          Base.nextTick(me.__tick);
        });
        tr.on('progress', function(percentage) {
          block.percentage = percentage;
          me.updateFileProgress(file);
        });
        requestAccept = function(reject) {
          var fn;
          ret = tr.getResponseAsJson() || {};
          ret._raw = tr.getResponse();
          fn = function(value) {
            reject = value;
          };
          if (!owner.trigger('uploadAccept', block, ret, fn)) {
            reject = reject || 'server';
          }
          return reject;
        };
        tr.on('error', function(type, flag) {
          block.retried = block.retried || 0;
          if (block.chunks > 1 && ~'http,abort'.indexOf(type) && block.retried < opts.chunkRetry) {
            block.retried++;
            tr.send();
          } else {
            if (!flag && type === 'server') {
              type = requestAccept(type);
            }
            file.setStatus(Status.ERROR, type);
            owner.trigger('uploadError', file, type);
            owner.trigger('uploadComplete', file);
          }
        });
        tr.on('load', function() {
          var reason;
          if ((reason = requestAccept())) {
            tr.trigger('error', reason, true);
            return;
          }
          if (file.remaning === 1) {
            me._finishFile(file, ret);
          } else {
            tr.destroy();
          }
        });
        data = $.extend(data, {
          id: file.id,
          name: file.name,
          type: file.type,
          lastModifiedDate: file.lastModifiedDate,
          size: file.size
        });
        block.chunks > 1 && $.extend(data, {
          chunks: block.chunks,
          chunk: block.chunk
        });
        owner.trigger('uploadBeforeSend', block, data, headers);
        tr.appendBlob(opts.fileVal, block.blob, file.name);
        tr.append(data);
        tr.setRequestHeader(headers);
        tr.send();
      },
      _finishFile: function(file, ret, hds) {
        var owner = this.owner;
        return owner.request('after-send-file', arguments, function() {
          file.setStatus(Status.COMPLETE);
          owner.trigger('uploadSuccess', file, ret, hds);
        }).fail(function(reason) {
          if (file.getStatus() === Status.PROGRESS) {
            file.setStatus(Status.ERROR, reason);
          }
          owner.trigger('uploadError', file, reason);
        }).always(function() {
          owner.trigger('uploadComplete', file);
        });
      },
      updateFileProgress: function(file) {
        var totalPercent = 0,
            uploaded = 0;
        if (!file.blocks) {
          return;
        }
        $.each(file.blocks, function(_, v) {
          uploaded += (v.percentage || 0) * (v.end - v.start);
        });
        totalPercent = uploaded / file.size;
        this.owner.trigger('uploadProgress', file, totalPercent || 0);
      }
    });
  });
  define('widgets/validator', ['base', 'uploader', 'file', 'widgets/widget'], function(Base, Uploader, WUFile) {
    var $ = Base.$,
        validators = {},
        api;
    api = {
      addValidator: function(type, cb) {
        validators[type] = cb;
      },
      removeValidator: function(type) {
        delete validators[type];
      }
    };
    Uploader.register({
      name: 'validator',
      init: function() {
        var me = this;
        Base.nextTick(function() {
          $.each(validators, function() {
            this.call(me.owner);
          });
        });
      }
    });
    api.addValidator('fileNumLimit', function() {
      var uploader = this,
          opts = uploader.options,
          count = 0,
          max = parseInt(opts.fileNumLimit, 10),
          flag = true;
      if (!max) {
        return;
      }
      uploader.on('beforeFileQueued', function(file) {
        if (count >= max && flag) {
          flag = false;
          this.trigger('error', 'Q_EXCEED_NUM_LIMIT', max, file);
          setTimeout(function() {
            flag = true;
          }, 1);
        }
        return count >= max ? false : true;
      });
      uploader.on('fileQueued', function() {
        count++;
      });
      uploader.on('fileDequeued', function() {
        count--;
      });
      uploader.on('reset', function() {
        count = 0;
      });
    });
    api.addValidator('fileSizeLimit', function() {
      var uploader = this,
          opts = uploader.options,
          count = 0,
          max = parseInt(opts.fileSizeLimit, 10),
          flag = true;
      if (!max) {
        return;
      }
      uploader.on('beforeFileQueued', function(file) {
        var invalid = count + file.size > max;
        if (invalid && flag) {
          flag = false;
          this.trigger('error', 'Q_EXCEED_SIZE_LIMIT', max, file);
          setTimeout(function() {
            flag = true;
          }, 1);
        }
        return invalid ? false : true;
      });
      uploader.on('fileQueued', function(file) {
        count += file.size;
      });
      uploader.on('fileDequeued', function(file) {
        count -= file.size;
      });
      uploader.on('reset', function() {
        count = 0;
      });
    });
    api.addValidator('fileSingleSizeLimit', function() {
      var uploader = this,
          opts = uploader.options,
          max = opts.fileSingleSizeLimit;
      if (!max) {
        return;
      }
      uploader.on('beforeFileQueued', function(file) {
        if (file.size > max) {
          file.setStatus(WUFile.Status.INVALID, 'exceed_size');
          this.trigger('error', 'F_EXCEED_SIZE', max, file);
          return false;
        }
      });
    });
    api.addValidator('duplicate', function() {
      var uploader = this,
          opts = uploader.options,
          mapping = {};
      if (opts.duplicate) {
        return;
      }
      function hashString(str) {
        var hash = 0,
            i = 0,
            len = str.length,
            _char;
        for (; i < len; i++) {
          _char = str.charCodeAt(i);
          hash = _char + (hash << 6) + (hash << 16) - hash;
        }
        return hash;
      }
      uploader.on('beforeFileQueued', function(file) {
        var hash = file.__hash || (file.__hash = hashString(file.name + file.size + file.lastModifiedDate));
        if (mapping[hash]) {
          this.trigger('error', 'F_DUPLICATE', file);
          return false;
        }
      });
      uploader.on('fileQueued', function(file) {
        var hash = file.__hash;
        hash && (mapping[hash] = true);
      });
      uploader.on('fileDequeued', function(file) {
        var hash = file.__hash;
        hash && (delete mapping[hash]);
      });
      uploader.on('reset', function() {
        mapping = {};
      });
    });
    return api;
  });
  define('runtime/compbase', [], function() {
    function CompBase(owner, runtime) {
      this.owner = owner;
      this.options = owner.options;
      this.getRuntime = function() {
        return runtime;
      };
      this.getRuid = function() {
        return runtime.uid;
      };
      this.trigger = function() {
        return owner.trigger.apply(owner, arguments);
      };
    }
    return CompBase;
  });
  define('runtime/html5/runtime', ['base', 'runtime/runtime', 'runtime/compbase'], function(Base, Runtime, CompBase) {
    var type = 'html5',
        components = {};
    function Html5Runtime() {
      var pool = {},
          me = this,
          destroy = this.destroy;
      Runtime.apply(me, arguments);
      me.type = type;
      me.exec = function(comp, fn) {
        var client = this,
            uid = client.uid,
            args = Base.slice(arguments, 2),
            instance;
        if (components[comp]) {
          instance = pool[uid] = pool[uid] || new components[comp](client, me);
          if (instance[fn]) {
            return instance[fn].apply(instance, args);
          }
        }
      };
      me.destroy = function() {
        return destroy && destroy.apply(this, arguments);
      };
    }
    Base.inherits(Runtime, {
      constructor: Html5Runtime,
      init: function() {
        var me = this;
        setTimeout(function() {
          me.trigger('ready');
        }, 1);
      }
    });
    Html5Runtime.register = function(name, component) {
      var klass = components[name] = Base.inherits(CompBase, component);
      return klass;
    };
    if (window.Blob && window.FileReader && window.DataView) {
      Runtime.addRuntime(type, Html5Runtime);
    }
    return Html5Runtime;
  });
  define('runtime/html5/blob', ['runtime/html5/runtime', 'lib/blob'], function(Html5Runtime, Blob) {
    return Html5Runtime.register('Blob', {slice: function(start, end) {
        var blob = this.owner.source,
            slice = blob.slice || blob.webkitSlice || blob.mozSlice;
        blob = slice.call(blob, start, end);
        return new Blob(this.getRuid(), blob);
      }});
  });
  define('runtime/html5/dnd', ['base', 'runtime/html5/runtime', 'lib/file'], function(Base, Html5Runtime, File) {
    var $ = Base.$,
        prefix = 'webuploader-dnd-';
    return Html5Runtime.register('DragAndDrop', {
      init: function() {
        var elem = this.elem = this.options.container;
        this.dragEnterHandler = Base.bindFn(this._dragEnterHandler, this);
        this.dragOverHandler = Base.bindFn(this._dragOverHandler, this);
        this.dragLeaveHandler = Base.bindFn(this._dragLeaveHandler, this);
        this.dropHandler = Base.bindFn(this._dropHandler, this);
        this.dndOver = false;
        elem.on('dragenter', this.dragEnterHandler);
        elem.on('dragover', this.dragOverHandler);
        elem.on('dragleave', this.dragLeaveHandler);
        elem.on('drop', this.dropHandler);
        if (this.options.disableGlobalDnd) {
          $(document).on('dragover', this.dragOverHandler);
          $(document).on('drop', this.dropHandler);
        }
      },
      _dragEnterHandler: function(e) {
        var me = this,
            denied = me._denied || false,
            items;
        e = e.originalEvent || e;
        if (!me.dndOver) {
          me.dndOver = true;
          items = e.dataTransfer.items;
          if (items && items.length) {
            me._denied = denied = !me.trigger('accept', items);
          }
          me.elem.addClass(prefix + 'over');
          me.elem[denied ? 'addClass' : 'removeClass'](prefix + 'denied');
        }
        e.dataTransfer.dropEffect = denied ? 'none' : 'copy';
        return false;
      },
      _dragOverHandler: function(e) {
        var parentElem = this.elem.parent().get(0);
        if (parentElem && !$.contains(parentElem, e.currentTarget)) {
          return false;
        }
        clearTimeout(this._leaveTimer);
        this._dragEnterHandler.call(this, e);
        return false;
      },
      _dragLeaveHandler: function() {
        var me = this,
            handler;
        handler = function() {
          me.dndOver = false;
          me.elem.removeClass(prefix + 'over ' + prefix + 'denied');
        };
        clearTimeout(me._leaveTimer);
        me._leaveTimer = setTimeout(handler, 100);
        return false;
      },
      _dropHandler: function(e) {
        var me = this,
            ruid = me.getRuid(),
            parentElem = me.elem.parent().get(0),
            dataTransfer,
            data;
        if (parentElem && !$.contains(parentElem, e.currentTarget)) {
          return false;
        }
        e = e.originalEvent || e;
        dataTransfer = e.dataTransfer;
        try {
          data = dataTransfer.getData('text/html');
        } catch (err) {}
        me.dndOver = false;
        me.elem.removeClass(prefix + 'over');
        if (data) {
          return;
        }
        me._getTansferFiles(dataTransfer, function(results) {
          me.trigger('drop', $.map(results, function(file) {
            return new File(ruid, file);
          }));
        });
        return false;
      },
      _getTansferFiles: function(dataTransfer, callback) {
        var results = [],
            promises = [],
            items,
            files,
            file,
            item,
            i,
            len,
            canAccessFolder;
        items = dataTransfer.items;
        files = dataTransfer.files;
        canAccessFolder = !!(items && items[0].webkitGetAsEntry);
        for (i = 0, len = files.length; i < len; i++) {
          file = files[i];
          item = items && items[i];
          if (canAccessFolder && item.webkitGetAsEntry().isDirectory) {
            promises.push(this._traverseDirectoryTree(item.webkitGetAsEntry(), results));
          } else {
            results.push(file);
          }
        }
        Base.when.apply(Base, promises).done(function() {
          if (!results.length) {
            return;
          }
          callback(results);
        });
      },
      _traverseDirectoryTree: function(entry, results) {
        var deferred = Base.Deferred(),
            me = this;
        if (entry.isFile) {
          entry.file(function(file) {
            results.push(file);
            deferred.resolve();
          });
        } else if (entry.isDirectory) {
          entry.createReader().readEntries(function(entries) {
            var len = entries.length,
                promises = [],
                arr = [],
                i;
            for (i = 0; i < len; i++) {
              promises.push(me._traverseDirectoryTree(entries[i], arr));
            }
            Base.when.apply(Base, promises).then(function() {
              results.push.apply(results, arr);
              deferred.resolve();
            }, deferred.reject);
          });
        }
        return deferred.promise();
      },
      destroy: function() {
        var elem = this.elem;
        if (!elem) {
          return;
        }
        elem.off('dragenter', this.dragEnterHandler);
        elem.off('dragover', this.dragOverHandler);
        elem.off('dragleave', this.dragLeaveHandler);
        elem.off('drop', this.dropHandler);
        if (this.options.disableGlobalDnd) {
          $(document).off('dragover', this.dragOverHandler);
          $(document).off('drop', this.dropHandler);
        }
      }
    });
  });
  define('runtime/html5/filepaste', ['base', 'runtime/html5/runtime', 'lib/file'], function(Base, Html5Runtime, File) {
    return Html5Runtime.register('FilePaste', {
      init: function() {
        var opts = this.options,
            elem = this.elem = opts.container,
            accept = '.*',
            arr,
            i,
            len,
            item;
        if (opts.accept) {
          arr = [];
          for (i = 0, len = opts.accept.length; i < len; i++) {
            item = opts.accept[i].mimeTypes;
            item && arr.push(item);
          }
          if (arr.length) {
            accept = arr.join(',');
            accept = accept.replace(/,/g, '|').replace(/\*/g, '.*');
          }
        }
        this.accept = accept = new RegExp(accept, 'i');
        this.hander = Base.bindFn(this._pasteHander, this);
        elem.on('paste', this.hander);
      },
      _pasteHander: function(e) {
        var allowed = [],
            ruid = this.getRuid(),
            items,
            item,
            blob,
            i,
            len;
        e = e.originalEvent || e;
        items = e.clipboardData.items;
        for (i = 0, len = items.length; i < len; i++) {
          item = items[i];
          if (item.kind !== 'file' || !(blob = item.getAsFile())) {
            continue;
          }
          allowed.push(new File(ruid, blob));
        }
        if (allowed.length) {
          e.preventDefault();
          e.stopPropagation();
          this.trigger('paste', allowed);
        }
      },
      destroy: function() {
        this.elem.off('paste', this.hander);
      }
    });
  });
  define('runtime/html5/filepicker', ['base', 'runtime/html5/runtime'], function(Base, Html5Runtime) {
    var $ = Base.$;
    return Html5Runtime.register('FilePicker', {
      init: function() {
        var container = this.getRuntime().getContainer(),
            me = this,
            owner = me.owner,
            opts = me.options,
            label = this.label = $(document.createElement('label')),
            input = this.input = $(document.createElement('input')),
            arr,
            i,
            len,
            mouseHandler;
        input.attr('type', 'file');
        input.attr('capture', 'camera');
        input.attr('name', opts.name);
        input.addClass('webuploader-element-invisible');
        label.on('click', function(e) {
          input.trigger('click');
          e.stopPropagation();
          owner.trigger('dialogopen');
        });
        label.css({
          opacity: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: 'pointer',
          background: '#ffffff'
        });
        if (opts.multiple) {
          input.attr('multiple', 'multiple');
        }
        if (opts.accept && opts.accept.length > 0) {
          arr = [];
          for (i = 0, len = opts.accept.length; i < len; i++) {
            arr.push(opts.accept[i].mimeTypes);
          }
          input.attr('accept', arr.join(','));
        }
        container.append(input);
        container.append(label);
        mouseHandler = function(e) {
          owner.trigger(e.type);
        };
        input.on('change', function(e) {
          var fn = arguments.callee,
              clone;
          me.files = e.target.files;
          clone = this.cloneNode(true);
          clone.value = null;
          this.parentNode.replaceChild(clone, this);
          input.off();
          input = $(clone).on('change', fn).on('mouseenter mouseleave', mouseHandler);
          owner.trigger('change');
        });
        label.on('mouseenter mouseleave', mouseHandler);
      },
      getFiles: function() {
        return this.files;
      },
      destroy: function() {
        this.input.off();
        this.label.off();
      }
    });
  });
  define('runtime/html5/util', ['base'], function(Base) {
    var urlAPI = window.createObjectURL && window || window.URL && URL.revokeObjectURL && URL || window.webkitURL,
        createObjectURL = Base.noop,
        revokeObjectURL = createObjectURL;
    if (urlAPI) {
      createObjectURL = function() {
        return urlAPI.createObjectURL.apply(urlAPI, arguments);
      };
      revokeObjectURL = function() {
        return urlAPI.revokeObjectURL.apply(urlAPI, arguments);
      };
    }
    return {
      createObjectURL: createObjectURL,
      revokeObjectURL: revokeObjectURL,
      dataURL2Blob: function(dataURI) {
        var byteStr,
            intArray,
            ab,
            i,
            mimetype,
            parts;
        parts = dataURI.split(',');
        if (~parts[0].indexOf('base64')) {
          byteStr = atob(parts[1]);
        } else {
          byteStr = decodeURIComponent(parts[1]);
        }
        ab = new ArrayBuffer(byteStr.length);
        intArray = new Uint8Array(ab);
        for (i = 0; i < byteStr.length; i++) {
          intArray[i] = byteStr.charCodeAt(i);
        }
        mimetype = parts[0].split(':')[1].split(';')[0];
        return this.arrayBufferToBlob(ab, mimetype);
      },
      dataURL2ArrayBuffer: function(dataURI) {
        var byteStr,
            intArray,
            i,
            parts;
        parts = dataURI.split(',');
        if (~parts[0].indexOf('base64')) {
          byteStr = atob(parts[1]);
        } else {
          byteStr = decodeURIComponent(parts[1]);
        }
        intArray = new Uint8Array(byteStr.length);
        for (i = 0; i < byteStr.length; i++) {
          intArray[i] = byteStr.charCodeAt(i);
        }
        return intArray.buffer;
      },
      arrayBufferToBlob: function(buffer, type) {
        var builder = window.BlobBuilder || window.WebKitBlobBuilder,
            bb;
        if (builder) {
          bb = new builder();
          bb.append(buffer);
          return bb.getBlob(type);
        }
        return new Blob([buffer], type ? {type: type} : {});
      },
      canvasToDataUrl: function(canvas, type, quality) {
        return canvas.toDataURL(type, quality / 100);
      },
      parseMeta: function(blob, callback) {
        callback(false, {});
      },
      updateImageHead: function(data) {
        return data;
      }
    };
  });
  define('runtime/html5/imagemeta', ['runtime/html5/util'], function(Util) {
    var api;
    api = {
      parsers: {0xffe1: []},
      maxMetaDataSize: 262144,
      parse: function(blob, cb) {
        var me = this,
            fr = new FileReader();
        fr.onload = function() {
          cb(false, me._parse(this.result));
          fr = fr.onload = fr.onerror = null;
        };
        fr.onerror = function(e) {
          cb(e.message);
          fr = fr.onload = fr.onerror = null;
        };
        blob = blob.slice(0, me.maxMetaDataSize);
        fr.readAsArrayBuffer(blob.getSource());
      },
      _parse: function(buffer, noParse) {
        if (buffer.byteLength < 6) {
          return;
        }
        var dataview = new DataView(buffer),
            offset = 2,
            maxOffset = dataview.byteLength - 4,
            headLength = offset,
            ret = {},
            markerBytes,
            markerLength,
            parsers,
            i;
        if (dataview.getUint16(0) === 0xffd8) {
          while (offset < maxOffset) {
            markerBytes = dataview.getUint16(offset);
            if (markerBytes >= 0xffe0 && markerBytes <= 0xffef || markerBytes === 0xfffe) {
              markerLength = dataview.getUint16(offset + 2) + 2;
              if (offset + markerLength > dataview.byteLength) {
                break;
              }
              parsers = api.parsers[markerBytes];
              if (!noParse && parsers) {
                for (i = 0; i < parsers.length; i += 1) {
                  parsers[i].call(api, dataview, offset, markerLength, ret);
                }
              }
              offset += markerLength;
              headLength = offset;
            } else {
              break;
            }
          }
          if (headLength > 6) {
            if (buffer.slice) {
              ret.imageHead = buffer.slice(2, headLength);
            } else {
              ret.imageHead = new Uint8Array(buffer).subarray(2, headLength);
            }
          }
        }
        return ret;
      },
      updateImageHead: function(buffer, head) {
        var data = this._parse(buffer, true),
            buf1,
            buf2,
            bodyoffset;
        bodyoffset = 2;
        if (data.imageHead) {
          bodyoffset = 2 + data.imageHead.byteLength;
        }
        if (buffer.slice) {
          buf2 = buffer.slice(bodyoffset);
        } else {
          buf2 = new Uint8Array(buffer).subarray(bodyoffset);
        }
        buf1 = new Uint8Array(head.byteLength + 2 + buf2.byteLength);
        buf1[0] = 0xFF;
        buf1[1] = 0xD8;
        buf1.set(new Uint8Array(head), 2);
        buf1.set(new Uint8Array(buf2), head.byteLength + 2);
        return buf1.buffer;
      }
    };
    Util.parseMeta = function() {
      return api.parse.apply(api, arguments);
    };
    Util.updateImageHead = function() {
      return api.updateImageHead.apply(api, arguments);
    };
    return api;
  });
  define('runtime/html5/imagemeta/exif', ['base', 'runtime/html5/imagemeta'], function(Base, ImageMeta) {
    var EXIF = {};
    EXIF.ExifMap = function() {
      return this;
    };
    EXIF.ExifMap.prototype.map = {'Orientation': 0x0112};
    EXIF.ExifMap.prototype.get = function(id) {
      return this[id] || this[this.map[id]];
    };
    EXIF.exifTagTypes = {
      1: {
        getValue: function(dataView, dataOffset) {
          return dataView.getUint8(dataOffset);
        },
        size: 1
      },
      2: {
        getValue: function(dataView, dataOffset) {
          return String.fromCharCode(dataView.getUint8(dataOffset));
        },
        size: 1,
        ascii: true
      },
      3: {
        getValue: function(dataView, dataOffset, littleEndian) {
          return dataView.getUint16(dataOffset, littleEndian);
        },
        size: 2
      },
      4: {
        getValue: function(dataView, dataOffset, littleEndian) {
          return dataView.getUint32(dataOffset, littleEndian);
        },
        size: 4
      },
      5: {
        getValue: function(dataView, dataOffset, littleEndian) {
          return dataView.getUint32(dataOffset, littleEndian) / dataView.getUint32(dataOffset + 4, littleEndian);
        },
        size: 8
      },
      9: {
        getValue: function(dataView, dataOffset, littleEndian) {
          return dataView.getInt32(dataOffset, littleEndian);
        },
        size: 4
      },
      10: {
        getValue: function(dataView, dataOffset, littleEndian) {
          return dataView.getInt32(dataOffset, littleEndian) / dataView.getInt32(dataOffset + 4, littleEndian);
        },
        size: 8
      }
    };
    EXIF.exifTagTypes[7] = EXIF.exifTagTypes[1];
    EXIF.getExifValue = function(dataView, tiffOffset, offset, type, length, littleEndian) {
      var tagType = EXIF.exifTagTypes[type],
          tagSize,
          dataOffset,
          values,
          i,
          str,
          c;
      if (!tagType) {
        Base.log('Invalid Exif data: Invalid tag type.');
        return;
      }
      tagSize = tagType.size * length;
      dataOffset = tagSize > 4 ? tiffOffset + dataView.getUint32(offset + 8, littleEndian) : (offset + 8);
      if (dataOffset + tagSize > dataView.byteLength) {
        Base.log('Invalid Exif data: Invalid data offset.');
        return;
      }
      if (length === 1) {
        return tagType.getValue(dataView, dataOffset, littleEndian);
      }
      values = [];
      for (i = 0; i < length; i += 1) {
        values[i] = tagType.getValue(dataView, dataOffset + i * tagType.size, littleEndian);
      }
      if (tagType.ascii) {
        str = '';
        for (i = 0; i < values.length; i += 1) {
          c = values[i];
          if (c === '\u0000') {
            break;
          }
          str += c;
        }
        return str;
      }
      return values;
    };
    EXIF.parseExifTag = function(dataView, tiffOffset, offset, littleEndian, data) {
      var tag = dataView.getUint16(offset, littleEndian);
      data.exif[tag] = EXIF.getExifValue(dataView, tiffOffset, offset, dataView.getUint16(offset + 2, littleEndian), dataView.getUint32(offset + 4, littleEndian), littleEndian);
    };
    EXIF.parseExifTags = function(dataView, tiffOffset, dirOffset, littleEndian, data) {
      var tagsNumber,
          dirEndOffset,
          i;
      if (dirOffset + 6 > dataView.byteLength) {
        Base.log('Invalid Exif data: Invalid directory offset.');
        return;
      }
      tagsNumber = dataView.getUint16(dirOffset, littleEndian);
      dirEndOffset = dirOffset + 2 + 12 * tagsNumber;
      if (dirEndOffset + 4 > dataView.byteLength) {
        Base.log('Invalid Exif data: Invalid directory size.');
        return;
      }
      for (i = 0; i < tagsNumber; i += 1) {
        this.parseExifTag(dataView, tiffOffset, dirOffset + 2 + 12 * i, littleEndian, data);
      }
      return dataView.getUint32(dirEndOffset, littleEndian);
    };
    EXIF.parseExifData = function(dataView, offset, length, data) {
      var tiffOffset = offset + 10,
          littleEndian,
          dirOffset;
      if (dataView.getUint32(offset + 4) !== 0x45786966) {
        return;
      }
      if (tiffOffset + 8 > dataView.byteLength) {
        Base.log('Invalid Exif data: Invalid segment size.');
        return;
      }
      if (dataView.getUint16(offset + 8) !== 0x0000) {
        Base.log('Invalid Exif data: Missing byte alignment offset.');
        return;
      }
      switch (dataView.getUint16(tiffOffset)) {
        case 0x4949:
          littleEndian = true;
          break;
        case 0x4D4D:
          littleEndian = false;
          break;
        default:
          Base.log('Invalid Exif data: Invalid byte alignment marker.');
          return;
      }
      if (dataView.getUint16(tiffOffset + 2, littleEndian) !== 0x002A) {
        Base.log('Invalid Exif data: Missing TIFF marker.');
        return;
      }
      dirOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
      data.exif = new EXIF.ExifMap();
      dirOffset = EXIF.parseExifTags(dataView, tiffOffset, tiffOffset + dirOffset, littleEndian, data);
    };
    ImageMeta.parsers[0xffe1].push(EXIF.parseExifData);
    return EXIF;
  });
  define('runtime/html5/image', ['base', 'runtime/html5/runtime', 'runtime/html5/util'], function(Base, Html5Runtime, Util) {
    var BLANK = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';
    return Html5Runtime.register('Image', {
      modified: false,
      init: function() {
        var me = this,
            img = new Image();
        img.onload = function() {
          me._info = {
            type: me.type,
            width: this.width,
            height: this.height
          };
          if (!me._metas && 'image/jpeg' === me.type) {
            Util.parseMeta(me._blob, function(error, ret) {
              me._metas = ret;
              me.owner.trigger('load');
            });
          } else {
            me.owner.trigger('load');
          }
        };
        img.onerror = function() {
          me.owner.trigger('error');
        };
        me._img = img;
      },
      loadFromBlob: function(blob) {
        var me = this,
            img = me._img;
        me._blob = blob;
        me.type = blob.type;
        img.src = Util.createObjectURL(blob.getSource());
        me.owner.once('load', function() {
          Util.revokeObjectURL(img.src);
        });
      },
      resize: function(width, height) {
        var canvas = this._canvas || (this._canvas = document.createElement('canvas'));
        this._resize(this._img, canvas, width, height);
        this._blob = null;
        this.modified = true;
        this.owner.trigger('complete', 'resize');
      },
      crop: function(x, y, w, h, s) {
        var cvs = this._canvas || (this._canvas = document.createElement('canvas')),
            opts = this.options,
            img = this._img,
            iw = img.naturalWidth,
            ih = img.naturalHeight,
            orientation = this.getOrientation();
        s = s || 1;
        cvs.width = w;
        cvs.height = h;
        opts.preserveHeaders || this._rotate2Orientaion(cvs, orientation);
        this._renderImageToCanvas(cvs, img, -x, -y, iw * s, ih * s);
        this._blob = null;
        this.modified = true;
        this.owner.trigger('complete', 'crop');
      },
      getAsBlob: function(type) {
        var blob = this._blob,
            opts = this.options,
            canvas;
        type = type || this.type;
        if (this.modified || this.type !== type) {
          canvas = this._canvas;
          if (type === 'image/jpeg') {
            blob = Util.canvasToDataUrl(canvas, type, opts.quality);
            if (opts.preserveHeaders && this._metas && this._metas.imageHead) {
              blob = Util.dataURL2ArrayBuffer(blob);
              blob = Util.updateImageHead(blob, this._metas.imageHead);
              blob = Util.arrayBufferToBlob(blob, type);
              return blob;
            }
          } else {
            blob = Util.canvasToDataUrl(canvas, type);
          }
          blob = Util.dataURL2Blob(blob);
        }
        return blob;
      },
      getAsDataUrl: function(type) {
        var opts = this.options;
        type = type || this.type;
        if (type === 'image/jpeg') {
          return Util.canvasToDataUrl(this._canvas, type, opts.quality);
        } else {
          return this._canvas.toDataURL(type);
        }
      },
      getOrientation: function() {
        return this._metas && this._metas.exif && this._metas.exif.get('Orientation') || 1;
      },
      info: function(val) {
        if (val) {
          this._info = val;
          return this;
        }
        return this._info;
      },
      meta: function(val) {
        if (val) {
          this._metas = val;
          return this;
        }
        return this._metas;
      },
      destroy: function() {
        var canvas = this._canvas;
        this._img.onload = null;
        if (canvas) {
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          canvas.width = canvas.height = 0;
          this._canvas = null;
        }
        this._img.src = BLANK;
        this._img = this._blob = null;
      },
      _resize: function(img, cvs, width, height) {
        var opts = this.options,
            naturalWidth = img.width,
            naturalHeight = img.height,
            orientation = this.getOrientation(),
            scale,
            w,
            h,
            x,
            y;
        if (~[5, 6, 7, 8].indexOf(orientation)) {
          width ^= height;
          height ^= width;
          width ^= height;
        }
        scale = Math[opts.crop ? 'max' : 'min'](width / naturalWidth, height / naturalHeight);
        opts.allowMagnify || (scale = Math.min(1, scale));
        w = naturalWidth * scale;
        h = naturalHeight * scale;
        if (opts.crop) {
          cvs.width = width;
          cvs.height = height;
        } else {
          cvs.width = w;
          cvs.height = h;
        }
        x = (cvs.width - w) / 2;
        y = (cvs.height - h) / 2;
        opts.preserveHeaders || this._rotate2Orientaion(cvs, orientation);
        this._renderImageToCanvas(cvs, img, x, y, w, h);
      },
      _rotate2Orientaion: function(canvas, orientation) {
        var width = canvas.width,
            height = canvas.height,
            ctx = canvas.getContext('2d');
        switch (orientation) {
          case 5:
          case 6:
          case 7:
          case 8:
            canvas.width = height;
            canvas.height = width;
            break;
        }
        switch (orientation) {
          case 2:
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
            break;
          case 3:
            ctx.translate(width, height);
            ctx.rotate(Math.PI);
            break;
          case 4:
            ctx.translate(0, height);
            ctx.scale(1, -1);
            break;
          case 5:
            ctx.rotate(0.5 * Math.PI);
            ctx.scale(1, -1);
            break;
          case 6:
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(0, -height);
            break;
          case 7:
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(width, -height);
            ctx.scale(-1, 1);
            break;
          case 8:
            ctx.rotate(-0.5 * Math.PI);
            ctx.translate(-width, 0);
            break;
        }
      },
      _renderImageToCanvas: (function() {
        if (!Base.os.ios) {
          return function(canvas) {
            var args = Base.slice(arguments, 1),
                ctx = canvas.getContext('2d');
            ctx.drawImage.apply(ctx, args);
          };
        }
        function detectVerticalSquash(img, iw, ih) {
          var canvas = document.createElement('canvas'),
              ctx = canvas.getContext('2d'),
              sy = 0,
              ey = ih,
              py = ih,
              data,
              alpha,
              ratio;
          canvas.width = 1;
          canvas.height = ih;
          ctx.drawImage(img, 0, 0);
          data = ctx.getImageData(0, 0, 1, ih).data;
          while (py > sy) {
            alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
              ey = py;
            } else {
              sy = py;
            }
            py = (ey + sy) >> 1;
          }
          ratio = (py / ih);
          return (ratio === 0) ? 1 : ratio;
        }
        if (Base.os.ios >= 7) {
          return function(canvas, img, x, y, w, h) {
            var iw = img.naturalWidth,
                ih = img.naturalHeight,
                vertSquashRatio = detectVerticalSquash(img, iw, ih);
            return canvas.getContext('2d').drawImage(img, 0, 0, iw * vertSquashRatio, ih * vertSquashRatio, x, y, w, h);
          };
        }
        function detectSubsampling(img) {
          var iw = img.naturalWidth,
              ih = img.naturalHeight,
              canvas,
              ctx;
          if (iw * ih > 1024 * 1024) {
            canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1;
            ctx = canvas.getContext('2d');
            ctx.drawImage(img, -iw + 1, 0);
            return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
          } else {
            return false;
          }
        }
        return function(canvas, img, x, y, width, height) {
          var iw = img.naturalWidth,
              ih = img.naturalHeight,
              ctx = canvas.getContext('2d'),
              subsampled = detectSubsampling(img),
              doSquash = this.type === 'image/jpeg',
              d = 1024,
              sy = 0,
              dy = 0,
              tmpCanvas,
              tmpCtx,
              vertSquashRatio,
              dw,
              dh,
              sx,
              dx;
          if (subsampled) {
            iw /= 2;
            ih /= 2;
          }
          ctx.save();
          tmpCanvas = document.createElement('canvas');
          tmpCanvas.width = tmpCanvas.height = d;
          tmpCtx = tmpCanvas.getContext('2d');
          vertSquashRatio = doSquash ? detectVerticalSquash(img, iw, ih) : 1;
          dw = Math.ceil(d * width / iw);
          dh = Math.ceil(d * height / ih / vertSquashRatio);
          while (sy < ih) {
            sx = 0;
            dx = 0;
            while (sx < iw) {
              tmpCtx.clearRect(0, 0, d, d);
              tmpCtx.drawImage(img, -sx, -sy);
              ctx.drawImage(tmpCanvas, 0, 0, d, d, x + dx, y + dy, dw, dh);
              sx += d;
              dx += dw;
            }
            sy += d;
            dy += dh;
          }
          ctx.restore();
          tmpCanvas = tmpCtx = null;
        };
      })()
    });
  });
  define('runtime/html5/transport', ['base', 'runtime/html5/runtime'], function(Base, Html5Runtime) {
    var noop = Base.noop,
        $ = Base.$;
    return Html5Runtime.register('Transport', {
      init: function() {
        this._status = 0;
        this._response = null;
      },
      send: function() {
        var owner = this.owner,
            opts = this.options,
            xhr = this._initAjax(),
            blob = owner._blob,
            server = opts.server,
            formData,
            binary,
            fr;
        if (opts.sendAsBinary) {
          server += (/\?/.test(server) ? '&' : '?') + $.param(owner._formData);
          binary = blob.getSource();
        } else {
          formData = new FormData();
          $.each(owner._formData, function(k, v) {
            formData.append(k, v);
          });
          formData.append(opts.fileVal, blob.getSource(), opts.filename || owner._formData.name || '');
        }
        if (opts.withCredentials && 'withCredentials' in xhr) {
          xhr.open(opts.method, server, true);
          xhr.withCredentials = true;
        } else {
          xhr.open(opts.method, server);
        }
        this._setRequestHeader(xhr, opts.headers);
        if (binary) {
          xhr.overrideMimeType && xhr.overrideMimeType('application/octet-stream');
          if (Base.os.android) {
            fr = new FileReader();
            fr.onload = function() {
              xhr.send(this.result);
              fr = fr.onload = null;
            };
            fr.readAsArrayBuffer(binary);
          } else {
            xhr.send(binary);
          }
        } else {
          xhr.send(formData);
        }
      },
      getResponse: function() {
        return this._response;
      },
      getResponseAsJson: function() {
        return this._parseJson(this._response);
      },
      getStatus: function() {
        return this._status;
      },
      abort: function() {
        var xhr = this._xhr;
        if (xhr) {
          xhr.upload.onprogress = noop;
          xhr.onreadystatechange = noop;
          xhr.abort();
          this._xhr = xhr = null;
        }
      },
      destroy: function() {
        this.abort();
      },
      _initAjax: function() {
        var me = this,
            xhr = new XMLHttpRequest(),
            opts = this.options;
        if (opts.withCredentials && !('withCredentials' in xhr) && typeof XDomainRequest !== 'undefined') {
          xhr = new XDomainRequest();
        }
        xhr.upload.onprogress = function(e) {
          var percentage = 0;
          if (e.lengthComputable) {
            percentage = e.loaded / e.total;
          }
          return me.trigger('progress', percentage);
        };
        xhr.onreadystatechange = function() {
          if (xhr.readyState !== 4) {
            return;
          }
          xhr.upload.onprogress = noop;
          xhr.onreadystatechange = noop;
          me._xhr = null;
          me._status = xhr.status;
          if (xhr.status >= 200 && xhr.status < 300) {
            me._response = xhr.responseText;
            return me.trigger('load');
          } else if (xhr.status >= 500 && xhr.status < 600) {
            me._response = xhr.responseText;
            return me.trigger('error', 'server');
          }
          return me.trigger('error', me._status ? 'http' : 'abort');
        };
        me._xhr = xhr;
        return xhr;
      },
      _setRequestHeader: function(xhr, headers) {
        $.each(headers, function(key, val) {
          xhr.setRequestHeader(key, val);
        });
      },
      _parseJson: function(str) {
        var json;
        try {
          json = JSON.parse(str);
        } catch (ex) {
          json = {};
        }
        return json;
      }
    });
  });
  define('preset/html5only', ['base', 'widgets/filednd', 'widgets/filepaste', 'widgets/filepicker', 'widgets/image', 'widgets/queue', 'widgets/runtime', 'widgets/upload', 'widgets/validator', 'runtime/html5/blob', 'runtime/html5/dnd', 'runtime/html5/filepaste', 'runtime/html5/filepicker', 'runtime/html5/imagemeta/exif', 'runtime/html5/image', 'runtime/html5/transport'], function(Base) {
    return Base;
  });
  define('webuploader', ['preset/html5only'], function(preset) {
    return preset;
  });
  return require('./webuploader.fis');
});
