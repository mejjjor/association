(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = function Association(args) {
	args = args || {};
	this.name = args.name || "";
	this.dept = args.dept || "";
	this.phone = args.phone || "";
	this.mail = args.mail || "";
	this.lastCall = args.lastCall || "";
	this.lastCallTs = args.lastCallTs || "";
	this.nbCall = args.nbCall || 0;
	this.adresse = args.adresse || "";
	this.obs = args.obs || "";
	this.status = args.status || "";
	if (args.objectId) this.objectId = args.objectId;
};

},{}],2:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('addasso', '<form class="pure-form pure-form-aligned" onsubmit="{addAsso}"> <fieldset> <div class="pure-control-group"> <label for="name">Nom: </label> <input type="text" name="name" value="{name}" onkeyup="{edit}" placeholder="Utopia" required> </div"> <div class="pure-control-group"> <label for="dept">Département: </label> <input type="text" name="dept" value="{dept}" onkeyup="{edit}" placeholder="75"> </div> <div class="pure-control-group"> <label for="phone">Téléphone: </label> <input type="tel" name="phone" value="{phone}" onkeyup="{edit}" required> </div> <div class="pure-control-group"> <label for="mail">Mail: </label> <input name="mail" value="{mail}" onkeyup="{edit}" type="{\'email\'}"> </div> <div class="pure-control-group"> <label for="adresse">adresse: </label> <input type="text" name="adresse" value="{adresse}" onkeyup="{edit}"> </div> <div class="pure-control-group"> <label for="lastCall">Dernier Appel: </label> <input name="lastCall" value="{lastCall}" onchange="{edit}" type="{\'date\'}"> </div> <div class="pure-control-group"> <label for="status">Statut: </label> <select name="status" value="{status}" onchange="{edit}"> <option value="ok">Ok</option> <option value="recall">To recall</option> </select> </div> <div class="pure-control-group"> <label for="obs">Observations: </label> <textarea name="obs" onkeyup="{edit}">{obs}</textarea> </div> <div class="pure-controls"> <button type="submit" class="pure-button pure-button-primary">Ajouter</button> </div> </fieldset> </form>', '', '', function(opts) {
  	var Association = require('./Association.js')
  	var moment = require('moment')
  	var self = this

  	opts.eventBus.on('editAsso', function(item){
  		self.name = item.name
	  	self.dept = item.dept
	  	self.phone = item.phone
	  	self.mail = item.mail
	  	self.status = item.status
	  	self.adresse = item.adresse
	  	self.obs = item.obs
	  	self.lastCall = item.lastCall
	  	self.lastCallTs = item.lastCallTs
		self.nbCall = item.nbCall
		self.objectId = item.objectId

		self.update()

  	})

  	this.name = ''
  	this.dept = ''
  	this.phone = ''
  	this.mail = ''
  	this.status = ''
  	this.adresse = ''
  	this.obs = ''
  	this.lastCall = ''
  	this.lastCallTs = ''
	this.nbCall = 0

	this.edit = function(e) {
      this[e.target.name] = e.target.value
    }.bind(this)

	this.addAsso = function(e) {
	console.log(this.lastCall)
		if (this.lastCall == '' || this.lastCall == 'Invalid date'){
			this.lastCallTs = new Date(0)
		}
		else{
			this.lastCallTs = new Date(this.lastCall).getTime()
			if (this.objectId == '')
				this.nbCall = 1
		}
        var associationObject = new Association({
	    name: this.name,
	    phone: this.phone,
	    mail: this.mail,
	    dept: this.dept,
	    lastCall: moment(this.lastCall).format('YYYY-MM-DD'),
	    lastCallTs: this.lastCallTs,
	    adresse: this.adresse,
	    obs: this.obs,
	    status: this.status,
	    objectId: this.objectId,
	    nbCall: this.nbCall
	});
	    var savedData = opts.Backendless.Persistence.of(Association).save(associationObject).then(assoRegistered);
	}.bind(this)

	function assoRegistered() {
	self.name = ''
  	self.phone = ''
  	self.mail = ''
  	self.adresse = ''
  	self.obs = ''
  	self.status = ''
  	this.lastCallTs = ''
  	this.objectId = ''
  	self.update()
    console.log("asso has registered")
    opts.eventBus.trigger('showAll')
}
});
},{"./Association.js":1,"moment":11,"riot":16}],3:[function(require,module,exports){
'use strict';

var riot = require('riot');
var Backendless = require('backendless');
var addAsso = require('./addAsso.tag');
var addAsso = require('./showAssos.tag');
var addAsso = require('./login.tag');
var APP_ID = "FFDC7C5B-9461-2230-FF25-390A64FE4400";
var SECRET_KEY = "0DBD0BF2-7A45-1048-FFA7-B88507C8BF00";
var VERSION = "v1";
var eventBus;
var domReady = function domReady(callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};
domReady(function () {
    Backendless.initApp(APP_ID, SECRET_KEY, VERSION);
    Backendless.enablePromises();
    eventBus = riot.observable();
    var currentUser = Backendless.UserService.loggedInUser();
    riot.mount('*', {
        eventBus: eventBus,
        Backendless: Backendless,
        currentUser: currentUser
    });
});

},{"./addAsso.tag":2,"./login.tag":4,"./showAssos.tag":5,"backendless":6,"riot":16}],4:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('login', '<form> <div if="{opts.currentUser == undefined}"> <input type="login" name="login" value="{login}" onchange="{edit}" placeholder="login"> <input type="password" name="password" value="{password}" onchange="{edit}" placeholder="password"> <button type="submit" onclick="{connect}">Login</button> </div> <div if="{opts.currentUser != undefined}"> <button type="submit" onclick="{unConnect}">Logout</button> </div> </form>', '', '', function(opts) {
this.login= ''
this.password = ''
var self = this

this.edit = function(e){
	this[e.target.name] = e.target.value
}.bind(this)

this.connect = function(e){
	opts.Backendless.UserService.login(this.login, this.password, true, new Backendless.Async(userLoggedIn, gotError))
	self.update()
}.bind(this)

this.unConnect = function(e){
	Backendless.UserService.logout( asyncCallback )
    function asyncCallback(){    }
    opts.currentUser = undefined
    self.update()
}.bind(this)

function userLoggedIn(user) {
	opts.currentUser = user.objectId
    console.log("user has logged in")
    self.update()
    }

    function gotError(err)
    {
        console.log("error message - " + err.message);
        console.log("error code - " + err.statusCode);
    }

});
},{"riot":16}],5:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('showassos', '<div> <p>{count}</p> <button onclick="{showAll}">All</button> <button onclick="{showMustCall}">To recall</button> <button onclick="{showDoneCall}">Done</button> <table class="pure-table pure-table-horizontal"> <thead> <tr> <th>Dept</th> <th>Nom</th> <th>Téléphone</th> <th>Dernier appel</th> <th>Statut</th> <th>Action</th> <th>Nb appel</th> <th>Mail</th> <th>Adresse</th> <th>Observations</th> <th>Edit</th> </tr> </thead> <tr each="{item in results}"> <td>{item.dept}</td> <td>{item.name}</td> <td>{item.phone}</td> <td>{item.lastCall}</td> <td>{item.status}</td> <td> <form lass="pure-form"> <div class="pure-control-group"> <button class="button-small pure-button" name="ok" objectid="{item.objectId}" onclick="{updateStatus}"><i class="fa fa-check-circle" aria-hidden="true" name="ok" objectid="{item.objectId}"></i> Done !</button> <button class="button-small pure-button" name="recall" objectid="{item.objectId}" onclick="{updateStatus}"><i class="fa fa-times-circle" aria-hidden="true" name="recall" objectid="{item.objectId}"></i> Recall</button> </div> </form> </td> <td>{item.nbCall}</td> <td>{item.mail}</td> <td>{item.adresse}</td> <td>{item.obs}</td> <td> <button class="button-small pure-button" name="edit" objectid="{item.objectId}" onclick="{editItem}"><i class="fa fa-pencil" aria-hidden="true" objectid="{item.objectId}"></i></button> <button class="button-small pure-button" name="remove" objectid="{item.objectId}" onclick="{removeItem}"><i class="fa fa-trash" aria-hidden="true" name="remove" objectid="{item.objectId}"></i></button> </td> </tr> </table> </div>', '', '', function(opts) {

  var Association = require('./Association.js')
  var moment = require('moment')

  var self = this

  var dateFilter = new Date();
  dateFilter.setDate(dateFilter.getDate() - 2)
  var dataQuery = new Backendless.DataQuery();
  dataQuery.options = {}
  dataQuery.options.pageSize = 100;

  opts.eventBus.on('showAll', function(){
    self.showAll('')
  })

  this.showAll = function(e) {
    dataQuery.condition = ""
    Backendless.Persistence.of(Association).find(dataQuery).then(getAssociations);
  }.bind(this)

  this.showMustCall = function(e){
    dataQuery.condition = "lastCallTs <= "+dateFilter.getTime()+" and status = 'recall'";
    Backendless.Persistence.of(Association).find(dataQuery).then(getAssociations)
  }.bind(this)

  this.showDoneCall = function(e){
    dataQuery.condition = "status = 'ok'";
    Backendless.Persistence.of(Association).find(dataQuery).then(getAssociations)
  }.bind(this)

  this.updateStatus = function(e){
  var item = findByObjectId(self.results, e.target.attributes.objectId.value)
  if ( item != -1){
      item.status = e.target.name
      item.lastCallTs = Date.now()
      item.lastCall = moment(Date.now()).format('YYYY-MM-DD')
      item.nbCall++

      opts.Backendless.Persistence.of(Association).save(item).then(assoUpdated);
    }
  }.bind(this)

  this.editItem = function(e){
    var item = findByObjectId(self.results, e.target.attributes.objectId.value)
    if(item != -1)
      opts.eventBus.trigger('editAsso',item)
  }.bind(this)

  this.removeItem = function(e){
    if (window.confirm('Etes vous sûr de supprimer cette association ?')){
      var item = findByObjectId(self.results, e.target.attributes.objectId.value)
      if(item != -1)
        opts.Backendless.Persistence.of(Association).remove(item).then(assoDeleted);
    }
  }.bind(this)

  function assoUpdated(){
    console.log("asso updated")
  }

  function assoDeleted(){
    console.log("asso deleted")
    opts.eventBus.trigger('showAll')
  }

  function getAssociations(data){
    self.results = data.data
    console.log(self.results)
    self.update()
  }

  function findByObjectId(data,id){
    var i = 0
    for (;id != data[i].objectId;i++){}
    if(i!=data.length)
      return data[i]
    return -1
  }

});
},{"./Association.js":1,"moment":11,"riot":16}],6:[function(require,module,exports){
(function (global,Buffer){
// Backendless.js 3.1.15

(function(factory) {
    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    if (typeof define === "function" && define.amd) {
        define([], function() {
            return root.Backendless = factory(root);
        });

    } else if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = root.Backendless = factory(root);
    } else {
        root.Backendless = factory(root);
    }

})(function(root) {
    'use strict';

    var NodeDevice = {
        name    : 'NODEJS',
        platform: 'NODEJS',
        uuid    : 'someId',
        version : '1'
    };

    var isBrowser = (new Function("try {return this===window;}catch(e){ return false;}"))();

    var WebSocket = null; // isBrowser ? window.WebSocket || window.MozWebSocket : {};
    var UIState = null;

    var localStorageName = 'localStorage';

    var previousBackendless = root.Backendless;

    var Backendless = {},
        emptyFn     = (function() {
        });

    Backendless.VERSION = '3.1.15';
    Backendless.serverURL = 'https://api.backendless.com';

    Backendless.noConflict = function() {
        root.Backendless = previousBackendless;
        return this;
    };

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(searchElement, fromIndex) {
            var k;
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = +fromIndex || 0;
            if (Math.abs(n) === Infinity) {
                n = 0;
            }
            if (n >= len) {
                return -1;
            }
            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len) {
                if (k in O && O[k] === searchElement) {
                    return k;
                }
                k++;
            }
            return -1;
        };
    }

    initXHR();

    var browser = (function() {
        var ua = 'NodeJS';

        if (isBrowser) {
            ua = navigator.userAgent ? navigator.userAgent.toLowerCase() : 'hybrid-app';
        }

        var match   = (/(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || []),
            matched = {
                browser: match[1] || '',
                version: match[2] || '0'
            },
            browser = {};
        if (matched.browser) {
            browser[matched.browser] = true;
            browser.version = matched.version;
        }

        return browser;
    })();

    var getNow = function() {
        return new Date().getTime();
    };

    var promisesEnabled = false;

    Backendless.browser = browser;
    Backendless.enablePromises = enablePromises;
    Backendless.promisesEnabled = function() {
        return promisesEnabled;
    };

    var Utils = Backendless.Utils = {
        isObject  : function(obj) {
            return obj === Object(obj);
        },
        isString  : function(obj) {
            return Object.prototype.toString.call(obj).slice(8, -1) === 'String';
        },
        isNumber  : function(obj) {
            return Object.prototype.toString.call(obj).slice(8, -1) === 'Number';
        },
        isFunction: function(obj) {
            return Object.prototype.toString.call(obj).slice(8, -1) === 'Function';
        },
        isBoolean : function(obj) {
            return Object.prototype.toString.call(obj).slice(8, -1) === 'Boolean';
        },
        isDate    : function(obj) {
            return Object.prototype.toString.call(obj).slice(8, -1) === 'Date';
        }
    };

    Utils.isArray = (Array.isArray || function(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1) === 'Array';
    });

    Utils.addEvent = function(evnt, elem, func) {
        if (elem.addEventListener) {
            elem.addEventListener(evnt, func, false);
        }
        else if (elem.attachEvent) {
            elem.attachEvent("on" + evnt, func);
        }
        else {
            elem[evnt] = func;
        }
    };

    Utils.isEmpty = function(obj) {
        if (obj == null)  {
            return true;
        }
        if (Utils.isArray(obj) || Utils.isString(obj)) {
            return obj.length === 0;
        }
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null) {
                return false;
            }
        }

        return true;
    };

    Utils.removeEvent = function(evnt, elem) {
        if (elem.removeEventListener) {
            elem.removeEventListener(evnt, null, false);
        } else if (elem.detachEvent) {
            elem.detachEvent("on" + evnt, null);
        } else {
            elem[evnt] = null;
        }
    };

    function initXHR() {
        try {
            if (typeof XMLHttpRequest.prototype.sendAsBinary == 'undefined') {
                XMLHttpRequest.prototype.sendAsBinary = function(text) {
                    var data = new ArrayBuffer(text.length);
                    var ui8a = new Uint8Array(data, 0);
                    for (var i = 0; i < text.length; i++) {
                        ui8a[i] = (text.charCodeAt(i) & 0xff);
                    }
                    this.send(ui8a);
                };
            }
        }
        catch (e) {
        }
    }

    function tryParseJSON(s) {
        try {
            return typeof s === 'string' ? JSON.parse(s) : s;
        } catch (e) {
            return s;
        }
    }

    Backendless.setUIState = function(stateName) {
        if (stateName === undefined) {
            throw new Error('UI state name must be defined or explicitly set to null');
        } else {
            UIState = stateName === null ? null : stateName;
        }
    };

    Backendless._ajax_for_browser = function(config) {
        var cashingAllowedArr = [
                'cacheOnly', 'remoteDataOnly', 'fromCacheOrRemote', 'fromRemoteOrCache', 'fromCacheAndRemote'],
            cacheMethods      = {
                ignoreCache       : function(config) {
                    return sendRequest(config);
                },
                cacheOnly         : function(config) {
                    var cachedResult = Backendless.LocalCache.get(config.url.replace(/([^A-Za-z0-9])/g, '')),
                        cacheError   = {
                            message   : 'error: cannot find data in Backendless.LocalCache',
                            statusCode: 404
                        };
                    if (cachedResult) {
                        config.isAsync && config.asyncHandler.success(cachedResult);
                        return cachedResult;
                    } else {
                        if (config.isAsync) {
                            config.asyncHandler.fault(cacheError);
                        } else {
                            throw cacheError;
                        }
                    }
                },
                remoteDataOnly    : function(config) {
                    return sendRequest(config);
                },
                fromCacheOrRemote : function(config) {
                    var cachedResult = Backendless.LocalCache.get(config.url.replace(/([^A-Za-z0-9])/g, ''));

                    if (cachedResult) {
                        config.isAsync && config.asyncHandler.success(cachedResult);
                        return cachedResult;
                    } else {
                        return sendRequest(config);
                    }
                },
                fromRemoteOrCache : function(config) {
                    return sendRequest(config);
                },
                fromCacheAndRemote: function(config) {
                    var result       = {},
                        cachedResult = Backendless.LocalCache.get(config.url.replace(/([^A-Za-z0-9])/g, '')),
                        cacheError   = {
                            message   : 'error: cannot find data in Backendless.LocalCache',
                            statusCode: 404
                        };

                    result.remote = sendRequest(config);

                    if (cachedResult) {
                        config.isAsync && config.asyncHandler.success(cachedResult);
                        result.local = cachedResult;
                    } else {
                        if (config.isAsync) {
                            config.asyncHandler.fault(cacheError);
                        } else {
                            throw cacheError;
                        }
                    }

                    return result;
                }
            },
            sendRequest       = function(config) {
                var xhr         = new XMLHttpRequest(),
                    contentType = config.data ? 'application/json' : 'application/x-www-form-urlencoded',
                    response;

                var parseResponse = function(xhr) {
                    var result = true;

                    if (xhr.responseText) {
                        result = tryParseJSON(xhr.responseText);
                    }

                    return result;
                };

                var badResponse = function(xhr) {
                    var result = {};

                    try {
                        result = JSON.parse(xhr.responseText);
                    } catch (e) {
                        result.message = xhr.responseText;
                    }

                    result.statusCode = xhr.status;
                    result.message = result.message || 'unknown error occurred';

                    return result;
                };

                var cacheHandler = function(response) {
                    response = cloneObject(response);
                    if (config.method == 'GET' && config.cacheActive) {
                        response.cachePolicy = config.cachePolicy;
                        Backendless.LocalCache.set(config.urlBlueprint, response);
                    } else if (Backendless.LocalCache.exists(config.urlBlueprint)) {
                        if (response === true || config.method == 'DELETE') {
                            response = undefined;
                        } else {
                            response.cachePolicy = Backendless.LocalCache.getCachePolicy(config.urlBlueprint);
                        }
                        '___class' in response && delete response['___class'];  // this issue must be fixed on server side

                        Backendless.LocalCache.set(config.urlBlueprint, response);
                    }
                };

                var checkInCache = function() {
                    return config.cacheActive && config.cachePolicy.policy == 'fromRemoteOrCache' && Backendless.LocalCache.exists(config.urlBlueprint);
                };

                xhr.open(config.method, config.url, config.isAsync);
                xhr.setRequestHeader('Content-Type', contentType);
                xhr.setRequestHeader('application-id', Backendless.applicationId);
                xhr.setRequestHeader('secret-key', Backendless.secretKey);
                xhr.setRequestHeader('application-type', 'JS');

                if ((currentUser != null && currentUser["user-token"])) {
                    xhr.setRequestHeader("user-token", currentUser["user-token"]);
                } else if (Backendless.LocalCache.exists("user-token")) {
                    xhr.setRequestHeader("user-token", Backendless.LocalCache.get("user-token"));
                }

                if (UIState !== null) {
                    xhr.setRequestHeader("uiState", UIState);
                }

                if (config.isAsync) {
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4) {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                response = parseResponse(xhr);
                                cacheHandler(response);
                                config.asyncHandler.success && config.asyncHandler.success(response);
                            } else if (checkInCache()) {
                                config.asyncHandler.success && config.asyncHandler.success(Backendless.LocalCache.get(config.urlBlueprint));
                            } else {
                                config.asyncHandler.fault && config.asyncHandler.fault(badResponse(xhr));
                            }
                        }
                    };
                }

                xhr.send(config.data);

                if (config.isAsync) {
                    return xhr;
                } else if (xhr.status >= 200 && xhr.status < 300) {
                    response = parseResponse(xhr);
                    cacheHandler(response);
                    return response;
                } else if (checkInCache()) {
                    return Backendless.LocalCache.get(config.urlBlueprint);
                } else {
                    throw badResponse(xhr);
                }
            };

        config.method = config.method || 'GET';
        config.cachePolicy = config.cachePolicy || {policy: 'ignoreCache'};
        config.isAsync = (typeof config.isAsync == 'boolean') ? config.isAsync : false;
        config.cacheActive = (config.method == 'GET') && (cashingAllowedArr.indexOf(config.cachePolicy.policy) != -1);
        config.urlBlueprint = config.url.replace(/([^A-Za-z0-9])/g, '');

        try {
            return cacheMethods[config.cachePolicy.policy].call(this, config);
        } catch (error) {
            throw error;
        }
    };

    Backendless._ajax_for_nodejs = function(config) {
        config.data = config.data || "";
        config.asyncHandler = config.asyncHandler || {};
        config.isAsync = (typeof config.isAsync == 'boolean') ? config.isAsync : false;

        if (!config.isAsync) {
            throw new Error('Use Async type of request using Backendless with NodeJS. Add Backendless.Async(successCallback, errorCallback) as last argument');
        }

        if (typeof config.data !== "string") {
            config.data = JSON.stringify(config.data);
        }

        var u = require('url').parse(config.url);
        var https = u.protocol === 'https:';

        var options = {
            host   : u.hostname,
            port   : u.port || (https ? 443 : 80),
            method : config.method || "GET",
            path   : u.path,
            headers: {
                "Content-Length"  : config.data ? Buffer.byteLength(config.data) : 0,
                "Content-Type"    : config.data ? 'application/json' : 'application/x-www-form-urlencoded',
                "application-id"  : Backendless.applicationId,
                "secret-key"      : Backendless.secretKey,
                "application-type": "JS"
            }
        };

        if (currentUser != null && !!currentUser["user-token"]) {
            options.headers["user-token"] = currentUser["user-token"];
        } else if (Backendless.LocalCache.exists("user-token")) {
            options.headers["user-token"] = Backendless.LocalCache.get("user-token");
        }

        var buffer;
        var httpx = require(https ? 'https' : 'http');
        var req = httpx.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                buffer = buffer ? buffer + chunk : chunk;
            });
            res.on('end', function() {
                var callback = config.asyncHandler[res.statusCode >= 200 && res.statusCode < 300 ? "success" : "fault"];

                if (Utils.isFunction(callback)) {
                    var contentType = res.headers['content-type'];

                    if (buffer !== undefined && contentType && contentType.indexOf('application/json') !== -1) {
                        buffer = tryParseJSON(buffer);
                    }

                    callback(buffer);
                }
            });
        });

        req.on('error', function(e) {
            config.asyncHandler.fault && config.asyncHandler.fault(e);
        });

        req.write(config.data);

        return req.end();
    };

    Backendless._ajax = isBrowser ? Backendless._ajax_for_browser : Backendless._ajax_for_nodejs;

    var getClassName = function() {
        if (this.prototype && this.prototype.___class) {
            return this.prototype.___class;
        }

        if (Utils.isFunction(this) && this.name) {
            return this.name;
        }

        var instStringified = (Utils.isFunction(this) ? this.toString() : this.constructor.toString()),
            results         = instStringified.match(/function\s+(\w+)/);

        return (results && results.length > 1) ? results[1] : '';
    };

    var encodeArrayToUriComponent = function(arr) {
        var props = [], i, len;
        for (i = 0, len = arr.length; i < len; ++i) {
            props.push(encodeURIComponent(arr[i]));
        }

        return props.join(',');
    };

    var classWrapper = function(obj) {
        var wrapper = function(obj) {
            var wrapperName = null,
                Wrapper = null;

            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (property === "___class") {
                        wrapperName = obj[property];
                        break;
                    }
                }
            }

            if (wrapperName) {
                try {
                    Wrapper = eval(wrapperName);
                    obj = deepExtend(new Wrapper(), obj);
                } catch (e) {
                }
            }

            return obj;
        };

        if (Utils.isObject(obj) && obj != null) {
            if (Utils.isArray(obj)) {
                for (var i = obj.length; i--;) {
                    obj[i] = wrapper(obj[i]);
                }
            } else {
                obj = wrapper(obj);
            }
        }

        return obj;
    };

    var deepExtend = function(destination, source) {
        for (var property in source) {
            if (source[property] !== undefined && source.hasOwnProperty(property)) {
                destination[property] = destination[property] || {};
                destination[property] = classWrapper(source[property]);
                if (destination[property] && destination[property].hasOwnProperty(property) && destination[property][property] && destination[property][property].hasOwnProperty("__originSubID")) {
                    destination[property][property] = classWrapper(destination[property]);
                }
            }
        }

        return destination;
    };

    var cloneObject = function(obj) {
        return Utils.isArray(obj) ? obj.slice() : deepExtend({}, obj);
    };

    var extractResponder = function(args) {
        var i, len;
        for (i = 0, len = args.length; i < len; ++i) {
            if (args[i] instanceof Async) {
                return args[i];
            }
        }

        return null;
    };

    var wrapAsync = function(async, parser, context) {
        var success = function(data) {
            if (parser) {
                data = parser.call(context, data);
            }

            async.success(data);
        };

        var error = function(data) {
            async.fault(data);
        };

        return new Async(success, error);
    };

    function extendCollection(collection, dataMapper) {
        if (collection.nextPage != null) {
            if (collection.nextPage && collection.nextPage.split("/")[1] == Backendless.appVersion) {
                collection.nextPage = Backendless.serverURL + collection.nextPage;
            }

            collection._nextPage = collection.nextPage;

            collection.nextPage = function(async) {
                return dataMapper._load(this._nextPage, async);
            };

            if (promisesEnabled) {
                collection.nextPage = promisify(collection.nextPage);
            }

            collection.getPage = function(offset, pageSize, async) {
                var nextPage = this._nextPage.replace(/offset=\d+/ig, 'offset=' + offset);

                if (!(pageSize instanceof Async)) {
                    nextPage = nextPage.replace(/pagesize=\d+/ig, 'pageSize=' + pageSize);
                }
                async = extractResponder(arguments);

                return dataMapper._load(nextPage, async);
            };

            collection.dataMapper = dataMapper;
        }
    }

    function Async(successCallback, faultCallback, context) {
        if (!(faultCallback instanceof Function)) {
            context = faultCallback;
            faultCallback = emptyFn;
        }

        this.success = function(data) {
            successCallback && successCallback.call(context, data);
        };
        this.fault = function(data) {
            faultCallback && faultCallback.call(context, data);
        };
    }

    function setCache() {
        var store   = {},
            storage = {};

        store.enabled = false;

        store.exists = function(key) {
            return store.get(key) !== undefined;
        };

        store.set = function(key, value) {
            return storage[key] = store.serialize(value);
        };

        store.get = function(key) {
            var result = storage[key];

            return result && store.deserialize(result);
        };

        store.remove = function(key) {
            return delete storage[key];
        };

        store.clear = function() {
            storage = {};
        };

        store.flushExpired = function() {
        };

        store.getCachePolicy = function(key) {
        };

        store.getAll = function () {
            var result = {};

            for (var prop in storage) {
                if (storage.hasOwnProperty(prop)) {
                    result[prop] = storage[prop];
                }
            }

            return result;
        };

        store.serialize = function(value) {
            return JSON.stringify(value);
        };

        store.deserialize = function(value) {
            if (typeof value != 'string') {
                return undefined;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value || undefined;
            }
        };

        function isLocalStorageSupported() {
            try {
                if (isBrowser && (localStorageName in window && window[localStorageName])) {
                    localStorage.setItem('localStorageTest', true);
                    localStorage.removeItem('localStorageTest');
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        }

        if (isLocalStorageSupported()) {
            return extendToLocalStorageCache(store);
        }

        return store;
    }

    function extendToLocalStorageCache(store) {
        var storage = window[localStorageName];

        var createBndlsStorage = function() {
            if (!(storage.getItem('Backendless'))) {
                storage.setItem('Backendless', store.serialize({}));
            }
        };

        var expired = function(obj) {
            var result = false;
            if (obj && Object.prototype.toString.call(obj).slice(8, -1) == "Object") {
                if ('cachePolicy' in obj && 'timeToLive' in obj['cachePolicy'] && obj['cachePolicy']['timeToLive'] != -1 && 'created' in obj['cachePolicy']) {
                    result = (new Date().getTime() - obj['cachePolicy']['created']) > obj['cachePolicy']['timeToLive'];
                }
            }

            return result;
        };

        var addTimestamp = function(obj) {
            if (obj && Object.prototype.toString.call(obj).slice(8, -1) == "Object") {
                if ('cachePolicy' in obj && 'timeToLive' in obj['cachePolicy']) {
                    obj['cachePolicy']['created'] = new Date().getTime();
                }
            }
        };

        createBndlsStorage();

        store.enabled = true;

        store.exists = function(key) {
            return store.get(key) !== undefined;
        };

        store.set = function(key, val) {
            if (val === undefined) {
                return store.remove(key);
            }

            createBndlsStorage();

            var backendlessObj = store.deserialize(storage.getItem('Backendless'));

            addTimestamp(val);

            backendlessObj[key] = val;

            try {
                storage.setItem('Backendless', store.serialize(backendlessObj));
            } catch (e) {
                backendlessObj = {};
                backendlessObj[key] = val;
                storage.setItem('Backendless', store.serialize(backendlessObj));
            }

            return val;
        };

        store.get = function(key) {
            createBndlsStorage();

            var backendlessObj = store.deserialize(storage.getItem('Backendless')),
                obj            = backendlessObj[key],
                result         = obj;

            if (expired(obj)) {
                delete backendlessObj[key];
                storage.setItem('Backendless', store.serialize(backendlessObj));
                result = undefined;
            }

            if (result && result['cachePolicy']) {
                delete result['cachePolicy'];
            }

            return result;
        };

        store.remove = function(key) {
            var result;

            createBndlsStorage();

            key = key.replace(/([^A-Za-z0-9-])/g, '');

            var backendlessObj = store.deserialize(storage.getItem('Backendless'));

            if (backendlessObj.hasOwnProperty(key)) {
                result = delete backendlessObj[key];
            }

            storage.setItem('Backendless', store.serialize(backendlessObj));

            return result;
        };

        store.clear = function() {
            storage.setItem('Backendless', store.serialize({}));
        };

        store.getAll = function() {
            createBndlsStorage();

            var backendlessObj = store.deserialize(storage.getItem('Backendless'));
            var ret = {};

            for (var prop in backendlessObj) {
                if (backendlessObj.hasOwnProperty(prop)) {
                    ret[prop] = backendlessObj[prop];
                    if (ret[prop] !== null && ret[prop].hasOwnProperty('cachePolicy')) {
                        delete ret[prop]['cachePolicy'];
                    }
                }
            }

            return ret;
        };

        store.flushExpired = function() {
            createBndlsStorage();

            var backendlessObj = store.deserialize(storage.getItem('Backendless')),
                obj;

            for (var prop in backendlessObj) {
                if (backendlessObj.hasOwnProperty(prop)) {
                    obj = backendlessObj[prop];
                    if (expired(obj)) {
                        delete backendlessObj[prop];
                        storage.setItem('Backendless', store.serialize(backendlessObj));
                    }
                }
            }
        };

        store.getCachePolicy = function(key) {
            createBndlsStorage();

            var backendlessObj = store.deserialize(storage.getItem('Backendless'));
            var obj = backendlessObj[key];

            return obj ? obj['cachePolicy'] : undefined;
        };

        return store;
    }

    Backendless.LocalCache = setCache();

    if (Backendless.LocalCache.enabled) {
        Backendless.LocalCache.flushExpired();
    }

    Backendless.Async = Async;

    function DataStore(model) {
        this.model = Utils.isString(model) ? function() {
        } : model;

        this.className = getClassName.call(model);

        if ((typeof model).toLowerCase() === "string") {
            this.className = model;
        }

        if (!this.className) {
            throw 'Class name should be specified';
        }

        this.restUrl = Backendless.appPath + '/data/' + this.className;
    }

    DataStore.prototype = {
        _extractQueryOptions: function(options) {
            var params = [];

            if (typeof options.pageSize != 'undefined') {
                if (options.pageSize < 1 || options.pageSize > 100) {
                    throw new Error('PageSize can not be less then 1 or greater than 100');
                }

                params.push('pageSize=' + encodeURIComponent(options.pageSize));
            }

            if (typeof options.offset != 'undefined') {
                if (options.offset < 0) {
                    throw new Error('Offset can not be less then 0');
                }

                params.push('offset=' + encodeURIComponent(options.offset));
            }

            if (options.sortBy) {
                if (Utils.isString(options.sortBy)) {
                    params.push('sortBy=' + encodeURIComponent(options.sortBy));
                } else if (Utils.isArray(options.sortBy)) {
                    params.push('sortBy=' + encodeArrayToUriComponent(options.sortBy));
                }
            }

            if (options.relationsDepth) {
                if (Utils.isNumber(options.relationsDepth)) {
                    params.push('relationsDepth=' + Math.floor(options.relationsDepth));
                }
            }

            if (options.relations) {
                if (Utils.isArray(options.relations)) {
                    params.push('loadRelations=' + (options.relations.length ? encodeArrayToUriComponent(options.relations) : "*"));
                }
            }

            return params.join('&');
        },
        _parseResponse: function(response) {
            var _Model = this.model, item;
            response = response.fields || response;
            item = new _Model();

            extendCollection(response, this);
            deepExtend(item, response);
            return this._formCircDeps(item);
        },

        _parseFindResponse: function(response) {
            var i, len, _Model = this.model, item;

            if (response.data) {
                var collection = response, arr = collection.data;

                for (i = 0, len = arr.length; i < len; ++i) {
                    arr[i] = arr[i].fields || arr[i];
                    item = new _Model();
                    deepExtend(item, arr[i]);
                    arr[i] = item;
                }

                extendCollection(collection, this);

                return this._formCircDeps(collection);
            }
            else {
                response = response.fields || response;
                item = Utils.isString(_Model) ? {} : new _Model();
                deepExtend(item, response);

                return this._formCircDeps(item);
            }
        },

        _load: function(url, async) {
            if (url) {
                var responder = extractResponder(arguments), isAsync = false;

                if (responder != null) {
                    isAsync = true;
                    responder = wrapAsync(responder, this._parseResponse, this);
                }

                var result = Backendless._ajax({
                    method      : 'GET',
                    url         : url,
                    isAsync     : isAsync,
                    asyncHandler: responder
                });

                return isAsync ? result : this._parseResponse(result);
            }
        },

        _replCircDeps       : function(obj) {
            var objMap = [obj];
            var pos;

            var genID = function() {
                for (var b = '', a = b; a++ < 36; b += a * 51 && 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-') {
                }
                return b;
            };

            var _replCircDepsHelper = function(obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop) && typeof obj[prop] == "object" && obj[prop] != null) {
                        if ((pos = objMap.indexOf(obj[prop])) != -1) {
                            objMap[pos]["__subID"] = objMap[pos]["__subID"] || genID();
                            obj[prop] = {"__originSubID": objMap[pos]["__subID"]};
                        } else if (Utils.isDate(obj[prop])) {
                            obj[prop] = obj[prop].getTime();
                        } else {
                            objMap.push(obj[prop]);
                            _replCircDepsHelper(obj[prop]);
                        }
                    }
                }
            };

            _replCircDepsHelper(obj);
        },

        _formCircDeps: function(obj) {
            var circDepsIDs         = {},
                result              = new obj.constructor(),
                _formCircDepsHelper = function(obj, result) {
                    if (obj.hasOwnProperty("__subID")) {
                        circDepsIDs[obj["__subID"]] = result;
                        delete obj["__subID"];
                    }

                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            if (typeof obj[prop] == "object" && obj[prop] != null) {
                                if (obj[prop].hasOwnProperty("__originSubID")) {
                                    result[prop] = circDepsIDs[obj[prop]["__originSubID"]];
                                } else {
                                    result[prop] = new (obj[prop].constructor)();
                                    _formCircDepsHelper(obj[prop], result[prop]);
                                }
                            } else {
                                result[prop] = obj[prop];
                            }
                        }
                    }
                };

            _formCircDepsHelper(obj, result);
            return result;
        },

        save: function(obj, async) {
            this._replCircDeps(obj);
            var responder = extractResponder(arguments),
                isAsync   = false,
                method    = 'PUT',
                url       = this.restUrl,
                objRef    = obj;

            if (responder != null) {
                isAsync = true;
                responder = wrapAsync(responder, this._parseResponse, this);
            }

            var result = Backendless._ajax({
                method      : method,
                url         : url,
                data        : JSON.stringify(obj),
                isAsync     : isAsync,
                asyncHandler: responder
            });

            if (!isAsync) {
                deepExtend(objRef, this._parseResponse(result));
            }

            return isAsync ? result : objRef;
        },

        remove: function(objId, async) {
            if (!Utils.isObject(objId) && !Utils.isString(objId)) {
                throw new Error('Invalid value for the "value" argument. The argument must contain only string or object values');
            }

            var responder = extractResponder(arguments), isAsync = false;

            if (responder != null) {
                isAsync = true;
                responder = wrapAsync(responder, this._parseResponse, this);
            }

            var result;

            if (Utils.isString(objId) || objId.objectId) {
                objId = objId.objectId || objId;
                result = Backendless._ajax({
                    method      : 'DELETE',
                    url         : this.restUrl + '/' + objId,
                    isAsync     : isAsync,
                    asyncHandler: responder
                });
            } else {
                result = Backendless._ajax({
                    method      : 'DELETE',
                    url         : this.restUrl,
                    data        : JSON.stringify(objId),
                    isAsync     : isAsync,
                    asyncHandler: responder
                });
            }

            return isAsync ? result : this._parseResponse(result);
        },

        find: function(dataQuery) {
            dataQuery = dataQuery || {};
            var props,
                whereClause,
                options,
                query     = [],
                url       = this.restUrl,
                responder = extractResponder(arguments),
                isAsync   = responder != null,
                result;

            if (dataQuery.properties && dataQuery.properties.length) {
                props = 'props=' + encodeArrayToUriComponent(dataQuery.properties);
            }

            if (dataQuery.condition) {
                whereClause = 'where=' + encodeURIComponent(dataQuery.condition);
            }

            if (dataQuery.options) {
                options = this._extractQueryOptions(dataQuery.options);
            }
            responder != null && (responder = wrapAsync(responder, this._parseFindResponse, this));
            options && query.push(options);
            whereClause && query.push(whereClause);
            props && query.push(props);
            query = query.join('&');

            if (dataQuery.url) {
                url += '/' + dataQuery.url;
            }

            if (query) {
                url += '?' + query;
            }

            result = Backendless._ajax({
                method      : 'GET',
                url         : url,
                isAsync     : isAsync,
                asyncHandler: responder,
                cachePolicy : dataQuery.cachePolicy
            });

            return isAsync ? result : this._parseFindResponse(result);
        },

        _buildArgsObject: function() {
            var args = {},
                i    = arguments.length,
                type = "";
            for (; i--;) {
                type = Object.prototype.toString.call(arguments[i]).toLowerCase().match(/[a-z]+/g)[1];
                switch (type) {
                    case "number":
                        args.options = args.options || {};
                        args.options.relationsDepth = arguments[i];
                        break;
                    case "string":
                        args.url = arguments[i];
                        break;
                    case "array":
                        args.options = args.options || {};
                        args.options.relations = arguments[i];
                        break;
                    case "object":
                        if (arguments[i].hasOwnProperty('cachePolicy')) {
                            args.cachePolicy = arguments[i]['cachePolicy'];
                        }
                        break;
                    default:
                        break;
                }
            }

            return args;
        },

        findById: function() {
            var argsObj;

            if (Utils.isString(arguments[0])) {
                argsObj = this._buildArgsObject.apply(this, arguments);
                if (!(argsObj.url)) {
                    throw new Error('missing argument "object ID" for method findById()');
                }

                return this.find.apply(this, [argsObj].concat(Array.prototype.slice.call(arguments)));
            } else if (Utils.isObject(arguments[0])) {
                argsObj = arguments[0];
                var responder = extractResponder(arguments),
                    url       = this.restUrl,
                    isAsync   = responder != null,
                    send      = "/pk?";

                for (var key in argsObj) {
                    send += key + '=' + argsObj[key] + '&';
                }

                responder != null && (responder = wrapAsync(responder, this._parseResponse, this));

                var result;

                if (getClassName.call(arguments[0]) == 'Object') {
                    result = Backendless._ajax({
                        method      : 'GET',
                        url         : url + send.replace(/&$/, ""),
                        isAsync     : isAsync,
                        asyncHandler: responder
                    });
                } else {
                    result = Backendless._ajax({
                        method      : 'PUT',
                        url         : url,
                        data        : JSON.stringify(argsObj),
                        isAsync     : isAsync,
                        asyncHandler: responder
                    });
                }

                return isAsync ? result : this._parseResponse(result);
            } else {
                throw new Error('Invalid value for the "value" argument. The argument must contain only string or object values');
            }
        },

        loadRelations: function(obj) {
            if (!obj) {
                throw new Error('missing object argument for method loadRelations()');
            }

            if (!Utils.isObject(obj)) {
                throw new Error('Invalid value for the "value" argument. The argument must contain only object values');
            }

            var argsObj = arguments[0];
            var url = this.restUrl + '/relations';

            if (arguments[1]) {
                if (Utils.isArray(arguments[1])) {
                    if (arguments[1][0] == '*') {
                        url += '?relationsDepth=' + arguments[1].length;
                    } else {
                        url += '?loadRelations=' + arguments[1][0] + '&relationsDepth=' + arguments[1].length;
                    }
                } else {
                    throw new Error('Invalid value for the "options" argument. The argument must contain only array values');
                }
            }

            var result = Backendless._ajax({
                method: 'PUT',
                url   : url,
                data  : JSON.stringify(argsObj)
            });

            deepExtend(obj, result);
        },

        findFirst: function() {
            var argsObj = this._buildArgsObject.apply(this, arguments);
            argsObj.url = 'first';

            return this.find.apply(this, [argsObj].concat(Array.prototype.slice.call(arguments)));
        },

        findLast: function() {
            var argsObj = this._buildArgsObject.apply(this, arguments);
            argsObj.url = 'last';

            return this.find.apply(this, [argsObj].concat(Array.prototype.slice.call(arguments)));
        }
    };

    var dataStoreCache = {};

    var persistence = {
        save: function(className, obj, async) {
            var responder = extractResponder(arguments), isAsync = false;

            if (Utils.isString(className)) {
                var url = Backendless.appPath + '/data/' + className;
                return Backendless._ajax({
                    method      : 'POST',
                    url         : url,
                    data        : JSON.stringify(obj),
                    isAsync     : isAsync,
                    asyncHandler: responder
                });
            }

            if (Utils.isObject(className)) {
                return new DataStore(className).save(className, obj, async);
            }
        },
        getView: function(viewName, whereClause, pageSize, offset, async) {
            var responder = extractResponder(arguments),
                isAsync   = responder != null;

            if (Utils.isString(viewName)) {
                var url = Backendless.appPath + '/data/' + viewName;

                if ((arguments.length > 1) && !(arguments[1] instanceof Backendless.Async)) {
                    url += '?';
                }
                if (Utils.isString(whereClause)) {
                    url += 'where=' + whereClause;
                } else {
                    pageSize = whereClause;
                    offset = pageSize;
                }
                if (Utils.isNumber(pageSize)) {
                    url += '&' + new DataStore()._extractQueryOptions({
                            pageSize: pageSize
                        });
                }
                if (Utils.isNumber(offset)) {
                    url += '&' + new DataStore()._extractQueryOptions({
                            offset: offset
                        });
                }

                return Backendless._ajax({
                    method      : 'GET',
                    url         : url,
                    isAsync     : isAsync,
                    asyncHandler: responder
                });
            } else {
                throw new Error('View name is required string parameter');
            }
        },
        callStoredProcedure: function(spName, argumentValues, async) {
            var responder = extractResponder(arguments),
                isAsync   = responder != null;

            if (Utils.isString(spName)) {
                var url  = Backendless.appPath + '/data/' + spName,
                    data = {};

                if (Utils.isObject(argumentValues)) {
                    data = JSON.stringify(argumentValues);
                }

                return Backendless._ajax({
                    method      : 'POST',
                    url         : url,
                    data        : data,
                    isAsync     : isAsync,
                    asyncHandler: responder
                });
            } else {
                throw new Error('Stored Procedure name is required string parameter');
            }
        },
        of: function(model) {
            var tableName;
            if (Utils.isString(model)) {
                if (model.toLowerCase() === 'users') {
                    throw new Error("Table 'Users' is not accessible through this signature. Use Backendless.Data.of( BackendlessUser.class ) instead");
                }
                tableName = model;
            } else {
                tableName = getClassName.call(model);
            }
            var store = dataStoreCache[tableName];
            if (!store) {
                store = new DataStore(model);
                dataStoreCache[tableName] = store;
            }

            return store;
        },
        describe: function(className, async) {
            className = Utils.isString(className) ? className : getClassName.call(className);
            var responder = extractResponder(arguments), isAsync = (responder != null);

            return Backendless._ajax({
                method      : 'GET',
                url         : Backendless.appPath + '/data/' + className + '/properties',
                isAsync     : isAsync,
                asyncHandler: responder
            });
        }
    };

    function DataPermissions() {
        this.restUrl = Backendless.appPath + '/data';

        this.getRestUrl = function(dataObject, permissionType) {
            return this.restUrl + '/' + encodeURIComponent(dataObject.___class) + '/permissions/' + encodeURIComponent(permissionType) + '/' + encodeURIComponent(dataObject.objectId);
        };

        this.sendRequest = function(userid, rolename, dataObject, permission, permissionType, async) {
            var responder = extractResponder(arguments),
                isAsync   = responder != null,
                data      = {
                    "permission": permission
                };

            if (!dataObject.___class || !dataObject.objectId) {
                throw new Error('"dataObject.___class" and "dataObject.objectId" need to be specified');
            }

            if (userid) {
                data.user = userid;
            } else if (rolename) {
                data.role = rolename;
            }

            return Backendless._ajax({
                method      : 'PUT',
                url         : this.getRestUrl(dataObject, permissionType),
                data        : JSON.stringify(data),
                isAsync     : isAsync,
                asyncHandler: responder
            });
        };
    }

    DataPermissions.prototype = {
        FIND  : {
            grantUser: function(userid, dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest(userid, null, dataObject, 'FIND', 'GRANT', Async);
            },
            grantRole: function(rolename, dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest(null, rolename, dataObject, 'FIND', 'GRANT', Async);
            },
            grant    : function(dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest('*', null, dataObject, 'FIND', 'GRANT', Async);
            },
            denyUser : function(userid, dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest(userid, null, dataObject, 'FIND', 'DENY', Async);
            },
            denyRole : function(rolename, dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest(null, rolename, dataObject, 'FIND', 'DENY', Async);
            },
            deny     : function(dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest('*', null, dataObject, 'FIND', 'DENY', Async);
            }
        },
        REMOVE: {
            grantUser: function(userid, dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest(userid, null, dataObject, 'REMOVE', 'GRANT', Async);
            },
            grantRole: function(rolename, dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest(null, rolename, dataObject, 'REMOVE', 'GRANT', Async);
            },
            grant    : function(dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest('*', null, dataObject, 'REMOVE', 'GRANT', Async);
            },
            denyUser : function(userid, dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest(userid, null, dataObject, 'REMOVE', 'DENY', Async);
            },
            denyRole : function(rolename, dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest(null, rolename, dataObject, 'REMOVE', 'DENY', Async);
            },
            deny     : function(dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest('*', null, dataObject, 'REMOVE', 'DENY', Async);
            }
        },
        UPDATE: {
            grantUser: function(userid, dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest(userid, null, dataObject, 'UPDATE', 'GRANT', Async);
            },
            grantRole: function(rolename, dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest(null, rolename, dataObject, 'UPDATE', 'GRANT', Async);
            },
            grant    : function(dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest('*', null, dataObject, 'UPDATE', 'GRANT', Async);
            },
            denyUser : function(userid, dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest(userid, null, dataObject, 'UPDATE', 'DENY', Async);
            },
            denyRole : function(rolename, dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest(null, rolename, dataObject, 'UPDATE', 'DENY', Async);
            },
            deny     : function(dataObject, Async) {
                return Backendless.Data.Permissions.sendRequest('*', null, dataObject, 'UPDATE', 'DENY', Async);
            }
        }
    };

    function User() {
    }

    User.prototype.___class = "Users";

    Backendless.User = User;

    var currentUser = null;

    var UserService = function() {
        this.restUrl = Backendless.appPath + '/users';
    };

    UserService.prototype = {
        _wrapAsync: function(async, stayLoggedIn) {
            var me   = this, success = function(data) {
                currentUser = me._parseResponse(tryParseJSON(data), stayLoggedIn);
                async.success(me._getUserFromResponse(currentUser));
            }, error = function(data) {
                async.fault(data);
            };

            return new Async(success, error);
        },

        _parseResponse: function(data, stayLoggedIn) {
            var user = new Backendless.User();
            deepExtend(user, data);

            if (stayLoggedIn) {
                Backendless.LocalCache.set("stayLoggedIn", stayLoggedIn);
            }

            return user;
        },

        register: function(user, async) {
            if (!(user instanceof Backendless.User)) {
                throw new Error('Only Backendless.User accepted');
            }

            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            if (responder) {
                responder = this._wrapAsync(responder);
            }

            var result = Backendless._ajax({
                method      : 'POST',
                url         : this.restUrl + '/register',
                isAsync     : isAsync,
                asyncHandler: responder,
                data        : JSON.stringify(user)
            });

            return isAsync ? result : this._parseResponse(result);
        },

        getUserRoles: function(async) {
            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            if (responder) {
                responder = this._wrapAsync(responder);
            }

            var result = Backendless._ajax({
                method      : 'GET',
                url         : this.restUrl + '/userroles',
                isAsync     : isAsync,
                asyncHandler: responder
            });

            return isAsync ? result : this._parseResponse(result);
        },

        roleHelper: function(identity, rolename, async, operation) {
            if (!identity) {
                throw new Error('User identity can not be empty');
            }

            if (!rolename) {
                throw new Error('Rolename can not be empty');
            }

            var responder = extractResponder(arguments);

            return Backendless._ajax({
                method      : 'POST',
                url         : this.restUrl + '/' + operation,
                isAsync     : !!responder,
                asyncHandler: responder,
                data        : JSON.stringify({user : identity, roleName: rolename})
            });
        },

        assignRole: function(identity, rolename, async) {
            return this.roleHelper(identity, rolename, async, 'assignRole');
        },

        unassignRole: function(identity, rolename, async) {
            return this.roleHelper(identity, rolename, async, 'unassignRole');
        },

        login: function(username, password, stayLoggedIn, async) {
            if (!username) {
                throw new Error('Username can not be empty');
            }

            if (!password) {
                throw new Error('Password can not be empty');
            }

            stayLoggedIn = stayLoggedIn === true;

            Backendless.LocalCache.remove("user-token");
            Backendless.LocalCache.remove("current-user-id");
            Backendless.LocalCache.set("stayLoggedIn", false);

            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            if (responder) {
                responder = this._wrapAsync(responder, stayLoggedIn);
            }

            var data = {
                login   : username,
                password: password
            };

            var result = Backendless._ajax({
                method      : 'POST',
                url         : this.restUrl + '/login',
                isAsync     : isAsync,
                asyncHandler: responder,
                data        : JSON.stringify(data)
            });

            if (!isAsync && result) {
                currentUser = this._parseResponse(result, stayLoggedIn);
                result = this._getUserFromResponse(currentUser);
            }

            return result;
        },

        _getUserFromResponse: function(user) {
            Backendless.LocalCache.set("current-user-id", user.objectId);

            var newUser = new Backendless.User();

            for (var i in user) {
                if (user.hasOwnProperty(i)) {
                    if (i == 'user-token') {
                        if (Backendless.LocalCache.get("stayLoggedIn")) {
                            Backendless.LocalCache.set("user-token", user[i]);
                        }
                        continue;
                    }
                    newUser[i] = user[i];
                }
            }

            return newUser;
        },

        loggedInUser: function() {
            return Backendless.LocalCache.get("current-user-id");
        },

        describeUserClass: function(async) {
            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            return Backendless._ajax({
                method      : 'GET',
                url         : this.restUrl + '/userclassprops',
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        restorePassword: function(emailAddress, async) {
            if (!emailAddress) {
                throw 'Username can not be empty';
            }
            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            return Backendless._ajax({
                method      : 'GET',
                url         : this.restUrl + '/restorepassword/' + encodeURIComponent(emailAddress),
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        logout: function(async) {
            var responder       = extractResponder(arguments),
                isAsync         = responder != null,
                errorCallback   = isAsync ? responder.fault : null,
                successCallback = isAsync ? responder.success : null,
                result = {},

                logoutUser      = function() {
                    Backendless.LocalCache.remove("user-token");
                    Backendless.LocalCache.remove("current-user-id");
                    Backendless.LocalCache.remove("stayLoggedIn");
                    currentUser = null;
                },

                onLogoutSuccess = function() {
                    logoutUser();
                    if (Utils.isFunction(successCallback)) {
                        successCallback();
                    }
                },

                onLogoutError   = function(e) {
                    if (Utils.isObject(e) && [3064, 3091, 3090, 3023].indexOf(e.code) != -1) {
                        logoutUser();
                    }
                    if (Utils.isFunction(errorCallback)) {
                        errorCallback(e);
                    }
                };

            if (responder) {
                responder.fault = onLogoutError;
                responder.success = onLogoutSuccess;
            }

            try {
                result = Backendless._ajax({
                    method      : 'GET',
                    url         : this.restUrl + '/logout',
                    isAsync     : isAsync,
                    asyncHandler: responder
                });
            } catch (e) {
                onLogoutError(e);
            }

            if (isAsync) {
                return result;
            } else {
                logoutUser();
            }
        },

        getCurrentUser: function() {
            if (currentUser) {
                return this._getUserFromResponse(currentUser);
            }

            var stayLoggedIn = Backendless.LocalCache.get("stayLoggedIn");
            var currentUserId = stayLoggedIn && Backendless.LocalCache.get("current-user-id");

            return currentUserId && persistence.of(User).findById(currentUserId) || null;
        },

        update: function(user, async) {
            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            if (responder) {
                responder = this._wrapAsync(responder);
            }

            var result = Backendless._ajax({
                method      : 'PUT',
                url         : this.restUrl + '/' + user.objectId,
                isAsync     : isAsync,
                asyncHandler: responder,
                data        : JSON.stringify(user)
            });

            return isAsync ? result : this._parseResponse(result);
        },

        loginWithFacebook      : function(facebookFieldsMapping, permissions, async, stayLoggedIn) {
            async = extractResponder(arguments);
            this._loginSocial('Facebook', facebookFieldsMapping, permissions, async, null, stayLoggedIn);
        },

        loginWithGooglePlus    : function(googlePlusFieldsMapping, permissions, async, container, stayLoggedIn) {
            async = extractResponder(arguments);
            this._loginSocial('GooglePlus', googlePlusFieldsMapping, permissions, async, container, stayLoggedIn);
        },

        loginWithTwitter       : function(twitterFieldsMapping, async, stayLoggedIn) {
            async = extractResponder(arguments);
            this._loginSocial('Twitter', twitterFieldsMapping, null, async, null, stayLoggedIn);
        },

        _socialContainer       : function(socialType, container) {
            var loadingMsg;

            if (container) {
                var client;

                container = container[0];
                loadingMsg = document.createElement('div');
                loadingMsg.innerHTML = "Loading...";
                container.appendChild(loadingMsg);
                container.style.cursor = 'wait';

                this.closeContainer = function() {
                    container.style.cursor = 'default';
                    container.removeChild(client);
                };

                this.removeLoading = function() {
                    container.removeChild(loadingMsg);
                };

                this.doAuthorizationActivity = function(url) {
                    this.removeLoading();
                    client = document.createElement('iframe');
                    client.frameBorder = 0;
                    client.width = container.style.width;
                    client.height = container.style.height;
                    client.id = "SocialAuthFrame";
                    client.setAttribute("src", url + "&amp;output=embed");
                    container.appendChild(client);
                    client.onload = function() {
                        container.style.cursor = 'default';
                    };
                };
            } else {
                container = window.open('', socialType + ' authorization',
                    "resizable=yes, scrollbars=yes, titlebar=yes, top=10, left=10");
                loadingMsg = container.document.getElementsByTagName('body')[0].innerHTML;
                loadingMsg = "Loading...";
                container.document.getElementsByTagName('html')[0].style.cursor = 'wait';

                this.closeContainer = function() {
                    container.close();
                };

                this.removeLoading = function() {
                    loadingMsg = null;
                };

                this.doAuthorizationActivity = function(url) {
                    container.location.href = url;
                    container.onload = function() {
                        container.document.getElementsByTagName("html")[0].style.cursor = 'default';
                    };
                };
            }
        },

        _loginSocial: function(socialType, fieldsMapping, permissions, async, container, stayLoggedIn) {
            var socialContainer = new this._socialContainer(socialType, container);
            async = async && this._wrapAsync(async);

            Utils.addEvent('message', window, function(e) {
                if (e.origin == Backendless.serverURL) {
                    var result = JSON.parse(e.data);

                    if (result.fault) {
                        async.fault(result.fault);
                    } else {
                        Backendless.LocalCache.set("stayLoggedIn", !!stayLoggedIn);
                        currentUser = this.Backendless.UserService._parseResponse(result);
                        async.success(this.Backendless.UserService._getUserFromResponse(currentUser));
                    }

                    Utils.removeEvent('message', window);
                    socialContainer.closeContainer();
                }
            });

            var interimCallback = new Backendless.Async(function(r) {
                socialContainer.doAuthorizationActivity(r);
            }, function(e) {
                socialContainer.closeContainer();
                async.fault(e);
            });

            var request = {};
            request.fieldsMapping = fieldsMapping || {};
            request.permissions = permissions || [];

            Backendless._ajax({
                method      : 'POST',
                url         : this.restUrl + "/social/oauth/" + socialType.toLowerCase() + "/request_url",
                isAsync     : true,
                asyncHandler: interimCallback,
                data        : JSON.stringify(request)
            });
        },

        loginWithFacebookSdk: function(fieldsMapping, stayLoggedIn, options, async) {
            if (!FB) {
                throw new Error("Facebook SDK not found");
            }

            if (stayLoggedIn instanceof Async) {
                async = stayLoggedIn;
                stayLoggedIn = false;
            } else if (options instanceof Async) {
                async = options;
                options = undefined;
            }

            var me = this;
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    me._sendSocialLoginRequest(me, response, "facebook", fieldsMapping, stayLoggedIn, async);
                } else {
                    FB.login(function(response) {
                        me._sendSocialLoginRequest(me, response, "facebook", fieldsMapping, stayLoggedIn, async);
                    }, options);
                }
            });
        },

        loginWithGooglePlusSdk: function(fieldsMapping, stayLoggedIn, async) {
            if (!gapi) {
                throw new Error("Google Plus SDK not found");
            }

            if (stayLoggedIn instanceof Async) {
                async = stayLoggedIn;
                stayLoggedIn = false;
            }

            var me = this;

            gapi.auth.authorize({
                client_id: fieldsMapping.client_id,
                scope    : "https://www.googleapis.com/auth/plus.login"
            }, function(response) {
                delete response['g-oauth-window'];
                me._sendSocialLoginRequest(me, response, "googleplus", fieldsMapping, stayLoggedIn, async);
            });
        },

        _sendSocialLoginRequest: function(context, response, socialType, fieldsMapping, stayLoggedIn, async) {
            if (fieldsMapping) {
                response["fieldsMapping"] = fieldsMapping;
            }

            var interimCallback = new Backendless.Async(function(r) {
                currentUser = context._parseResponse(r);
                Backendless.LocalCache.set("stayLoggedIn", !!stayLoggedIn);
                async.success(context._getUserFromResponse(currentUser));
            }, function(e) {
                async.fault(e);
            });

            Backendless._ajax({
                method      : 'POST',
                url         : context.restUrl + "/social/" + socialType + "/login/" + Backendless.applicationId,
                isAsync     : true,
                asyncHandler: interimCallback,
                data        : JSON.stringify(response)
            });
        },

        isValidLogin: function(async) {
            var userToken = Backendless.LocalCache.get("user-token");
            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            if (userToken) {
                if (!async) {
                    try {
                        var result = Backendless._ajax({
                            method: 'GET',
                            url   : Backendless.serverURL + '/' + Backendless.appVersion + '/users/isvalidusertoken/' + userToken
                        });
                        return !!result;
                    } catch (e) {
                        return false;
                    }
                } else {
                    Backendless._ajax({
                        method      : 'GET',
                        url         : Backendless.serverURL + '/' + Backendless.appVersion + '/users/isvalidusertoken/' + userToken,
                        isAsync     : isAsync,
                        asyncHandler: responder && this._wrapAsync(responder)
                    });
                }
            } else {
                var user = Backendless.UserService.getCurrentUser();

                if (isAsync) {
                    //if async need to put it to the end of the stack
                    setTimeout(function() {
                        responder[user ? 'success' : 'fault']();
                    }, 0);
                } else {
                    return !!user;
                }
            }
        },

        resendEmailConfirmation: function(emailAddress, async) {
            if(!emailAddress || emailAddress instanceof Async) {
                throw "Email cannot be empty";
            }
            var responder = extractResponder(arguments);
            var isAsync = !!responder;

            return Backendless._ajax({
                method      : 'POST',
                url         : this.restUrl + "/resendconfirmation/" + emailAddress,
                isAsync     : isAsync,
                asyncHandler: responder
            });
        }
    };

    function Geo() {
        this.restUrl = Backendless.appPath + '/geo';
        this.monitoringId = null;
    }

    Geo.prototype = {
        UNITS           : {
            METERS    : 'METERS',
            KILOMETERS: 'KILOMETERS',
            MILES     : 'MILES',
            YARDS     : 'YARDS',
            FEET      : 'FEET'
        },

        _parseResponse  : function(data) {
            var collection = data.collection;
            extendCollection(collection, this);

            return collection;
        },

        _load           : function(url, async) {
            var responder = extractResponder(arguments),
                isAsync   = responder != null;

            var result = Backendless._ajax({
                method      : 'GET',
                url         : url,
                isAsync     : isAsync,
                asyncHandler: responder
            });

            return isAsync ? result : this._parseResponse(result);
        },

        _findHelpers    : {
            'searchRectangle': function(arg) {
                var rect = [
                    'nwlat=' + arg[0], 'nwlon=' + arg[1], 'selat=' + arg[2], 'selon=' + arg[3]
                ];
                return rect.join('&');
            },
            'latitude'  : function(arg) {
                return 'lat=' + arg;
            },
            'longitude' : function(arg) {
                return 'lon=' + arg;
            },
            'metadata'  : function(arg) {
                return 'metadata=' + JSON.stringify(arg);
            },
            'units'     : function(arg) {
                return 'units=' + arg;
            },
            'radius'    : function(arg) {
                return 'r=' + arg;
            },
            'categories': function(arg) {
                arg = Utils.isString(arg) ? [arg] : arg;
                return 'categories=' + encodeArrayToUriComponent(arg);
            },
            'includeMetadata': function(arg) {
                return 'includemetadata=' + arg;
            },
            'pageSize': function(arg) {
                if (arg < 1 || arg > 100) {
                    throw new Error('PageSize can not be less then 1 or greater than 100');
                } else {
                    return 'pagesize=' + arg;
                }
            },
            'offset'  : function(arg) {
                if (arg < 0) {
                    throw new Error('Offset can not be less then 0');
                } else {
                    return 'offset=' + arg;
                }
            },
            'relativeFindPercentThreshold': function(arg) {
                if (arg <= 0) {
                    throw new Error('Threshold can not be less then or equal 0');
                } else {
                    return 'relativeFindPercentThreshold=' + arg;
                }
            },
            'relativeFindMetadata': function(arg) {
                return 'relativeFindMetadata=' + encodeURIComponent(JSON.stringify(arg));
            },
            'condition'           : function(arg) {
                return 'whereClause=' + encodeURIComponent(arg);
            },
            'degreePerPixel'      : function(arg) {
                return 'dpp=' + arg;
            },
            'clusterGridSize'     : function(arg) {
                return 'clustergridsize=' + arg;
            },
            'geoFence'            : function(arg) {
                return 'geoFence=' + arg;
            }
        },

        savePoint        : function(geopoint, async) {
            if (geopoint.latitude === undefined || geopoint.longitude === undefined) {
                throw 'Latitude or longitude not a number';
            }
            geopoint.categories = geopoint.categories || ['Default'];
            geopoint.categories = Utils.isArray(geopoint.categories) ? geopoint.categories : [geopoint.categories];

            var objectId = geopoint.objectId;
            var method = objectId ? 'PATCH' : 'PUT',
                url = this.restUrl + '/points';

            if (objectId) {
                url += '/' + objectId;
            }

            var responder = extractResponder(arguments);
            var isAsync = responder != null;
            var responderOverride = function(async) {
                var success = function(data) {
                    var geoObject = data.geopoint;
                    var geoPoint = new GeoPoint();
                    geoPoint.categories = geoObject.categories;
                    geoPoint.latitude = geoObject.latitude;
                    geoPoint.longitude = geoObject.longitude;
                    geoPoint.metadata = geoObject.metadata;
                    geoPoint.objectId = geoObject.objectId;
                    data.geopoint = geoPoint;

                    async.success(data);
                };
                var error = function(data) {
                    async.fault(data);
                };

                return new Async(success, error);
            };

            responder = responderOverride(responder);

            return Backendless._ajax({
                method      : method,
                url         : url,
                data        : JSON.stringify(geopoint),
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },
      
        /** @deprecated */
        addPoint: function(geopoint, async) {
          return this.savePoint.apply(this, arguments);
        },

        findUtil        : function(query, async) {
            var url       = query["url"],
                responder = extractResponder(arguments),
                isAsync   = false;

            if (query.searchRectangle && query.radius) {
                throw new Error("Inconsistent geo query. Query should not contain both rectangle and radius search parameters.");
            } else if (query.radius && (query.latitude === undefined || query.longitude === undefined)) {
                throw new Error("Latitude and longitude should be provided to search in radius");
            } else if ((query.relativeFindMetadata || query.relativeFindPercentThreshold) && !(query.relativeFindMetadata && query.relativeFindPercentThreshold)) {
                throw new Error("Inconsistent geo query. Query should contain both relativeFindPercentThreshold and relativeFindMetadata or none of them");
            } else {
                url += query.searchRectangle ? '/rect?' : '/points?';
                url += query.units ? 'units=' + query.units : '';
                for (var prop in query) {
                    if (query.hasOwnProperty(prop) && this._findHelpers.hasOwnProperty(prop) && query[prop] != null) {
                        url += '&' + this._findHelpers[prop](query[prop]);
                    }
                }
            }

            url = url.replace(/\?&/g, '?');
            var self = this;

            var responderOverride = function(async) {
                var success = function(data) {
                    var geoCollection = data.collection.data;

                    for (var i = 0; i < geoCollection.length; i++) {
                        var geoObject = null;
                        if (geoCollection[i].hasOwnProperty('totalPoints')) {
                            geoObject = new GeoCluster();
                            geoObject.totalPoints = geoCollection[i].totalPoints;
                            geoObject.geoQuery = query;
                        } else {
                            geoObject = new GeoPoint();
                        }
                        geoObject.categories = geoCollection[i].categories;
                        geoObject.latitude = geoCollection[i].latitude;
                        geoObject.longitude = geoCollection[i].longitude;
                        geoObject.metadata = geoCollection[i].metadata;
                        geoObject.objectId = geoCollection[i].objectId;
                        geoObject.distance = geoCollection[i].distance;
                        data.collection.data[i] = geoObject;
                    }

                    data = self._parseResponse(data);
                    async.success(data);
                };

                var error = function(data) {
                    async.fault(data);
                };

                return new Async(success, error);
            };

            if (responder != null) {
                isAsync = true;
            }

            responder = responderOverride(responder);

            var result = Backendless._ajax({
                method      : 'GET',
                url         : url,
                isAsync     : isAsync,
                asyncHandler: responder
            });

            return isAsync ? result : this._parseResponse(result);
        },

        find            : function(query, async) {
            query["url"] = this.restUrl;

            return this.findUtil(query, async);
        },

        loadMetadata    : function(geoObject, async) {
            var url       = this.restUrl + '/points/',
                responder = extractResponder(arguments),
                isAsync   = false;
            if (geoObject.objectId) {
                if (geoObject instanceof GeoCluster) {
                    if (geoObject.geoQuery instanceof GeoQuery) {
                        url += geoObject.objectId + '/metadata?';

                        for (var prop in geoObject.geoQuery) {
                            if (geoObject.geoQuery.hasOwnProperty(prop) && this._findHelpers.hasOwnProperty(prop) && geoObject.geoQuery[prop] != null) {
                                url += '&' + this._findHelpers[prop](geoObject.geoQuery[prop]);
                            }
                        }
                    } else {
                        throw new Error("Invalid GeoCluster object. Make sure to obtain an instance of GeoCluster using the Backendless.Geo.find API");
                    }
                } else if (geoObject instanceof GeoPoint) {
                    url += geoObject.objectId + '/metadata';
                } else {
                    throw new Error("Method argument must be a valid instance of GeoPoint or GeoCluster persisted on the server");
                }
            } else {
                throw new Error("Method argument must be a valid instance of GeoPoint or GeoCluster persisted on the server");
            }

            if (responder != null) {
                isAsync = true;
            }

            return Backendless._ajax({
                method      : 'GET',
                url         : url,
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        getClusterPoints: function(geoObject, async) {
            var url       = this.restUrl + '/clusters/',
                responder = extractResponder(arguments),
                isAsync   = false;

            if (geoObject.objectId) {
                if (geoObject instanceof GeoCluster) {
                    if (geoObject.geoQuery instanceof GeoQuery) {
                        url += geoObject.objectId + '/points?';
                        for (var prop in geoObject.geoQuery) {
                            if (geoObject.geoQuery.hasOwnProperty(prop) && this._findHelpers.hasOwnProperty(prop) && geoObject.geoQuery[prop] != null) {
                                url += '&' + this._findHelpers[prop](geoObject.geoQuery[prop]);
                            }
                        }
                    } else {
                        throw new Error("Invalid GeoCluster object. Make sure to obtain an instance of GeoCluster using the Backendless.Geo.find API");
                    }
                } else {
                    throw new Error("Method argument must be a valid instance of GeoCluster persisted on the server");
                }
            } else {
                throw new Error("Method argument must be a valid instance of GeoCluster persisted on the server");
            }

            var self = this;

            var responderOverride = function(async) {
                var success = function(data) {
                    var geoCollection = data.collection.data;
                    for (var i = 0; i < geoCollection.length; i++) {
                        var geoObject = null;
                        geoObject = new GeoPoint();
                        geoObject.categories = geoCollection[i].categories;
                        geoObject.latitude = geoCollection[i].latitude;
                        geoObject.longitude = geoCollection[i].longitude;
                        geoObject.metadata = geoCollection[i].metadata;
                        geoObject.objectId = geoCollection[i].objectId;
                        data.collection.data[i] = geoObject;
                    }
                    data = self._parseResponse(data);
                    async.success(data);
                };

                var error = function(data) {
                    async.fault(data);
                };

                return new Async(success, error);
            };

            if (responder != null) {
                isAsync = true;
            }

            responder = responderOverride(responder);

            var result = Backendless._ajax({
                method      : 'GET',
                url         : url,
                isAsync     : isAsync,
                asyncHandler: responder
            });

            return isAsync ? result : this._parseResponse(result);
        },

        relativeFind: function(query, async) {
            if (!(query.relativeFindMetadata && query.relativeFindPercentThreshold)) {
                throw new Error("Inconsistent geo query. Query should contain both relativeFindPercentThreshold and relativeFindMetadata");
            } else {
                query["url"] = this.restUrl + "/relative";

                return this.findUtil(query, async);
            }
        },

        addCategory: function(name, async) {
            if (!name) {
                throw new Error('Category name is required.');
            }

            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            var result = Backendless._ajax({
                method      : 'PUT',
                url         : this.restUrl + '/categories/' + name,
                isAsync     : isAsync,
                asyncHandler: responder
            });

            return (typeof result.result === 'undefined') ? result : result.result;
        },

        getCategories: function(async) {
            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            return Backendless._ajax({
                method      : 'GET',
                url         : this.restUrl + '/categories',
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        deleteCategory: function(name, async) {
            if (!name) {
                throw new Error('Category name is required.');
            }

            var responder = extractResponder(arguments);
            var isAsync = responder != null;
            var result = {};

            try {
                result = Backendless._ajax({
                    method      : 'DELETE',
                    url         : this.restUrl + '/categories/' + name,
                    isAsync     : isAsync,
                    asyncHandler: responder
                });
            } catch (e) {
                if (e.statusCode == 404) {
                    result = false;
                } else {
                    throw e;
                }
            }

            return (typeof result.result === 'undefined') ? result : result.result;
        },

        deletePoint: function(point, async) {
            if (!point || Utils.isFunction(point)) {
                throw new Error('Point argument name is required, must be string (object Id), or point object');
            }

            var pointId   = Utils.isString(point) ? point : point.objectId,
                responder = extractResponder(arguments),
                isAsync   = responder != null,
                result = {};

            try {
                result = Backendless._ajax({
                    method      : 'DELETE',
                    url         : this.restUrl + '/points/' + pointId,
                    isAsync     : isAsync,
                    asyncHandler: responder
                });
            } catch (e) {
                if (e.statusCode == 404) {
                    result = false;
                } else {
                    throw e;
                }
            }

            return (typeof result.result === 'undefined') ? result : result.result;
        },

        getFencePoints: function(geoFenceName, query, async) {
            query = query || new GeoQuery();
            if (!Utils.isString(geoFenceName)) {
                throw new Error("Invalid value for parameter 'geoFenceName'. Geo Fence Name must be a String");
            }
            if (!(query instanceof GeoQuery)) {
                throw new Error("Invalid geo query. Query should be instance of Backendless.GeoQuery");
            }

            query["geoFence"] = geoFenceName;
            query["url"] = this.restUrl;

            return this.findUtil(query, async);
        },

        _runFenceAction: function(action, geoFenceName, geoPoint, async) {
            if (!Utils.isString(geoFenceName)) {
                throw new Error("Invalid value for parameter 'geoFenceName'. Geo Fence Name must be a String");
            }

            if (geoPoint && !(geoPoint instanceof Backendless.Async) && !(geoPoint instanceof GeoPoint) && !geoPoint.objectId) {
                throw new Error("Method argument must be a valid instance of GeoPoint persisted on the server");
            }

            var responder = extractResponder(arguments),
                isAsync   = responder != null,
                data      = {
                    method      : 'POST',
                    url         : this.restUrl + '/fence/' + action + '?geoFence=' + geoFenceName,
                    isAsync     : isAsync,
                    asyncHandler: responder
                };

            if (geoPoint) {
                data.data = JSON.stringify(geoPoint);
            }

            return Backendless._ajax(data);
        },

        runOnStayAction: function(geoFenceName, geoPoint, async) {
            return this._runFenceAction('onstay', geoFenceName, geoPoint, async);
        },

        runOnExitAction: function(geoFenceName, geoPoint, async) {
            return this._runFenceAction('onexit', geoFenceName, geoPoint, async);
        },

        runOnEnterAction: function(geoFenceName, geoPoint, async) {
            return this._runFenceAction('onenter', geoFenceName, geoPoint, async);
        },

        _getFences: function(geoFence) {
            return Backendless._ajax({
                method: 'GET',
                url   : this.restUrl + '/fences' + ((geoFence) ? '?geoFence=' + geoFence : '')
            });
        },

        EARTH_RADIUS: 6378100.0,

        _distance: function(lat1, lon1, lat2, lon2) {
            var deltaLon = lon1 - lon2;
            deltaLon = (deltaLon * Math.PI) / 180;
            lat1 = (lat1 * Math.PI) / 180;
            lat2 = (lat2 * Math.PI) / 180;

            return this.EARTH_RADIUS * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(deltaLon));
        },

        _updateDegree: function(degree) {
            degree += 180;
            while (degree < 0) {
                degree += 360;
            }

            return degree === 0 ? 180 : degree % 360 - 180;
        },

        _countLittleRadius: function(latitude) {
            var h = Math.abs(latitude) / 180 * this.EARTH_RADIUS;
            var diametre = 2 * this.EARTH_RADIUS;
            var l_2 = (Math.pow(diametre, 2) - diametre * Math.sqrt(Math.pow(diametre, 2) - 4 * Math.pow(h, 2))) / 2;
            return diametre / 2 - Math.sqrt(l_2 - Math.pow(h, 2));
        },

        _isDefiniteRect: function(nwPoint, sePoint) {
            return nwPoint != null && sePoint != null;
        },

        _getOutRectangle: function() {
            return (arguments.length == 1) ? this._getOutRectangleNodes(arguments[1]) : this._getOutRectangleCircle(arguments[0],
                arguments[1]);
        },

        _getOutRectangleCircle: function(center, bounded) {
            var radius = this._distance(center.latitude, center.longitude, bounded.latitude, bounded.longitude);
            var boundLat = center.latitude + (180 * radius) / (Math.PI * this.EARTH_RADIUS) * (center.latitude > 0 ? 1 : -1);
            var littleRadius = this._countLittleRadius(boundLat);
            var westLong, eastLong, northLat, southLat;

            if (littleRadius > radius) {
                westLong = center.longitude - (180 * radius) / littleRadius;
                eastLong = 2 * center.longitude - westLong;
                westLong = this._updateDegree(westLong);
                eastLong = eastLong % 360 == 180 ? 180 : this._updateDegree(eastLong);
            } else {
                westLong = -180;
                eastLong = 180;
            }

            if (center.latitude > 0) {
                northLat = boundLat;
                southLat = 2 * center.latitude - boundLat;
            } else {
                southLat = boundLat;
                northLat = 2 * center.latitude - boundLat;
            }

            return [Math.min(northLat, 90), westLong, Math.max(southLat, -90), eastLong];
        },

        _getOutRectangleNodes: function(geoPoints) {
            var nwLat = geoPoints[0].latitude;
            var nwLon = geoPoints[0].longitude;
            var seLat = geoPoints[0].latitude;
            var seLon = geoPoints[0].longitude;
            var minLon = 0, maxLon = 0, lon = 0;

            for (var i = 1; i < geoPoints.length; i++) {
                if (geoPoints[i].latitude > nwLat) {
                    nwLat = geoPoints[i].latitude;
                }

                if (geoPoints[i].latitude < seLat) {
                    seLat = geoPoints[i].latitude;
                }

                var deltaLon = geoPoints[i].latitude - geoPoints[i - 1].latitude;

                if (deltaLon < 0 && deltaLon > -180 || deltaLon > 270) {
                    if (deltaLon > 270) {
                        deltaLon -= 360;
                    }

                    lon += deltaLon;

                    if (lon < minLon) {
                        minLon = lon;
                    }
                } else if (deltaLon > 0 && deltaLon <= 180 || deltaLon <= -270) {
                    if (deltaLon <= -270) {
                        deltaLon += 360;
                    }

                    lon += deltaLon;

                    if (lon > maxLon) {
                        maxLon = lon;
                    }
                }
            }

            nwLon += minLon;
            seLon += maxLon;

            if (seLon - nwLon >= 360) {
                seLon = 180;
                nwLon = -180;
            } else {
                seLon = this._updateDegree(seLon);
                nwLon = this._updateDegree(nwLon);
            }

            return [nwLat, nwLon, seLat, seLon];
        },

        _getPointPosition: function(point, first, second) {
            var delta = second.longitude - first.longitude;

            if (delta < 0 && delta > -180 || delta > 180) {
                var tmp = first;
                first = second;
                second = tmp;
            }

            if (point.latitude < first.latitude == point.latitude < second.latitude) {
                return 'NO_INTERSECT';
            }

            var x = point.longitude - first.longitude;

            if (x < 0 && x > -180 || x > 180) {
                x = (x - 360) % 360;
            }

            var x2 = (second.longitude - first.longitude + 360) % 360;
            var result = x2 * (point.latitude - first.latitude) / (second.latitude - first.latitude) - x;

            if (result > 0) {
                return 'INTERSECT';
            }

            return 'NO_INTERSECT';
        },

        _isPointInRectangular: function(currentPosition, nwPoint, sePoint) {
            if (currentPosition.latitude > nwPoint.latitude || currentPosition.latitude < sePoint.latitude) {
                return false;
            }

            if (nwPoint.longitude > sePoint.longitude) {
                return currentPosition.longitude >= nwPoint.longitude || currentPosition.longitude <= sePoint.longitude;
            } else {
                return currentPosition.longitude >= nwPoint.longitude && currentPosition.longitude <= sePoint.longitude;
            }
        },

        _isPointInCircle: function(currentPosition, center, radius) {
            return this._distance(currentPosition.latitude, currentPosition.longitude, center.latitude,
                    center.longitude) <= radius;
        },

        _isPointInShape: function(point, shape) {
            var count = 0;

            function getIndex(i, shape) {
                return (i + 1) % shape.length;
            }

            for (var i = 0; i < shape.length; i++) {
                var position = this._getPointPosition(point, shape[i], shape[getIndex(i, shape)]);
                switch (position) {
                    case 'INTERSECT':
                    {
                        count++;
                        break;
                    }
                    case 'ON_LINE':
                    case 'NO_INTERSECT':
                    default:
                        break;
                }
            }

            return count % 2 == 1;
        },

        _isPointInFence: function(geoPoint, geoFence) {
            return this._isPointInRectangular(geoPoint, geoFence.nwPoint, geoFence.sePoint) ||
                geoFence.type == 'CIRCLE' && this._isPointInCircle(geoPoint, geoFence.nodes[0],
                    this._distance(geoFence.nodes[0].latitude, geoFence.nodes[0].longitude, geoFence.nodes[1].latitude,
                        geoFence.nodes[1].longitude)) ||
                geoFence.type == 'SHAPE' && this._isPointInShape(geoPoint, geoFence.nodes);
        },

        _typesMapper: {
            'RECT'  : function(fence) {
                fence.nwPoint = fence.nodes[0];
                fence.sePoint = fence.nodes[1];
            },
            'CIRCLE': function(fence, self) {
                var outRect = self._getOutRectangle(fence.nodes[0], fence.nodes[1]);
                fence.nwPoint = {
                    latitude : outRect[0],
                    longitude: outRect[1]
                };
                fence.sePoint = {
                    latitude : outRect[2],
                    longitude: outRect[3]
                };
            },
            'SHAPE' : function(fence, self) {
                var outRect = self._getOutRectangle(fence.nodes[0], fence.nodes[1]);
                fence.nwPoint = {
                    latitude : outRect[0],
                    longitude: outRect[1]
                };
                fence.sePoint = {
                    latitude : outRect[2],
                    longitude: outRect[3]
                };
            }
        },

        _maxDuration  : 5000,
        _timers       : {},

        _checkPosition: function(geofenceName, coords, fences, geoPoint, GeoFenceCallback, lastResults, async) {
            var self = this;

            for (var k = 0; k < self._trackedFences.length; k++) {
                var isInFence = self._isDefiniteRect(self._trackedFences[k].nwPoint,
                        self._trackedFences[k].sePoint) && self._isPointInFence(coords, self._trackedFences[k]);
                var rule = null;

                if (isInFence != lastResults[self._trackedFences[k].geofenceName]) {
                    if (lastResults[self._trackedFences[k].geofenceName]) {
                        rule = 'onexit';
                    } else {
                        rule = 'onenter';
                    }

                    lastResults[self._trackedFences[k].geofenceName] = isInFence;
                }

                if (rule) {
                    var duration          = self._trackedFences[k].onStayDuration * 1000,
                        timeoutFuncInApp  = function(savedK, savedCoords, duration) {
                            var callBack = function() {
                                GeoFenceCallback['onstay'](self._trackedFences[savedK].geofenceName,
                                    self._trackedFences[savedK].objectId, savedCoords.latitude, savedCoords.longitude);
                            };

                            self._timers[self._trackedFences[savedK].geofenceName] = setTimeout(callBack, duration);
                        },

                        timeoutFuncRemote = function(savedK, savedCoords, duration, geoPoint) {
                            var callBack = function() {
                                self._runFenceAction('onstay', self._trackedFences[savedK].geofenceName, geoPoint,
                                    async);
                            };

                            self._timers[self._trackedFences[savedK].geofenceName] = setTimeout(callBack, duration);
                        };

                    if (GeoFenceCallback) {
                        if (rule == 'onenter') {
                            GeoFenceCallback[rule](self._trackedFences[k].geofenceName, self._trackedFences[k].objectId,
                                coords.latitude, coords.longitude);

                            if (duration > -1) {
                                (function(k, coords, duration) {
                                    return timeoutFuncInApp(k, coords, duration);
                                })(k, coords, duration);
                            } else {
                                GeoFenceCallback['onstay'](self._trackedFences[k].geofenceName,
                                    self._trackedFences[k].objectId, coords.latitude, coords.longitude);
                            }
                        } else {
                            clearTimeout(self._timers[self._trackedFences[k].geofenceName]);
                            GeoFenceCallback[rule](self._trackedFences[k].geofenceName, self._trackedFences[k].objectId,
                                coords.latitude, coords.longitude);
                        }
                    } else if (geoPoint) {
                        geoPoint.latitude = coords.latitude;
                        geoPoint.longitude = coords.longitude;

                        if (rule == 'onenter') {
                            self._runFenceAction(rule, self._trackedFences[k].geofenceName, geoPoint, async);

                            if (duration > -1) {
                                (function(k, coords, duration, geoPoint) {
                                    return timeoutFuncRemote(k, coords, duration, geoPoint);
                                })(k, coords, duration, geoPoint);
                            } else {
                                self._runFenceAction('onstay', self._trackedFences[k].geofenceName, geoPoint, async);
                            }
                        } else {
                            clearTimeout(self._timers[self._trackedFences[k].geofenceName]);
                            self._runFenceAction(rule, self._trackedFences[k].geofenceName, geoPoint, async);
                        }
                    }
                }
            }
        },

        _mobilecheck: function() {
            var check = false;
            (function(a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,
                        4))) {
                    check = true;
                }
            })(navigator.userAgent || navigator.vendor || window.opera);

            return check;
        },

        _trackedFences  : [],
        _lastResults    : {},

        _startMonitoring: function(geofenceName, secondParam, async) {
            var self = this;
            var isGeoPoint = false;

            if (secondParam instanceof GeoPoint) {
                isGeoPoint = true;
            }

            var fences = this._getFences(geofenceName);

            for (var ii = 0; ii < fences.length; ii++) {
                if (!_containsByPropName(self._trackedFences, fences[ii], "geofenceName")) {
                    self._typesMapper[fences[ii].type](fences[ii], self);
                    self._lastResults[fences[ii].geofenceName] = false;
                    self._trackedFences.push(fences[ii]);
                } else {
                    //console.warn(fences[ii].geofenceName + ' cannot be tracked again. This fence is already tracked');
                }
            }

            function _containsByPropName(collection, object, name) {
                var length = collection.length,
                    result = false;
                for (var i = 0; i < length; i++) {
                    if (result = collection[i][name] === object[name]) {
                        break;
                    }
                }

                return result;
            }

            function getPosition(position) {
                self._checkPosition(geofenceName, position.coords, fences, (isGeoPoint) ? secondParam : null,
                    (!isGeoPoint) ? secondParam : null, self._lastResults, async);
            }

            function errorCallback(error) {
                throw new Error('Error during current position calculation. Error ' + error.message);
            }

            function getCurPos() {
                navigator.geolocation.getCurrentPosition(getPosition, errorCallback, {
                    timeout           : 5000,
                    enableHighAccuracy: true
                });
            }

            if (!this.monitoringId) {
                if (fences.length) {
                    this.monitoringId = (!this._mobilecheck()) ? setInterval(getCurPos,
                        self._maxDuration) : navigator.geolocation.watchPosition(getPosition, errorCallback, {
                        timeout           : self._maxDuration,
                        enableHighAccuracy: true
                    });
                } else {
                    throw new Error("Please, add some fences to start monitoring");
                }
            }
        },

        startGeofenceMonitoringWithInAppCallback : function(geofenceName, inAppCallback, async) {
            this._startMonitoring(geofenceName, inAppCallback, async);
        },

        startGeofenceMonitoringWithRemoteCallback: function(geofenceName, geoPoint, async) {
            this._startMonitoring(geofenceName, geoPoint, async);
        },

        stopGeofenceMonitoring: function(geofenceName) {
            var self = this;
            //removed = [];
            if (geofenceName) {
                for (var i = 0; i < self._trackedFences.length; i++) {
                    if (self._trackedFences[i].geofenceName == geofenceName) {
                        self._trackedFences.splice(i, 1);
                        delete self._lastResults[geofenceName];
                        //removed.push(geofenceName);
                    }
                }
            } else {
                //for (var ii = 0; ii < self._trackedFences.length; ii++) {
                //    removed.push(self._trackedFences[ii].geofenceName)
                //}
                this._lastResuls = {};
                this._trackedFences = [];
            }
            if (!self._trackedFences.length) {
                self.monitoringId = null;
                (!self._mobilecheck()) ? clearInterval(self.monitoringId) : navigator.geolocation.clearWatch(self.monitoringId);
            }
            //removed.length ? console.info('Removed fences: ' + removed.join(", ")) : console.info('No fences are tracked');
        }
    };

    function Proxy() {
    }

    Proxy.prototype = {
        on       : function(eventName, handler) {
            if (!eventName) {
                throw new Error('Event name not specified');
            }

            if (!handler) {
                throw new Error('Handler not specified');
            }

            this.eventHandlers[eventName] = this.eventHandlers[eventName] || [];
            this.eventHandlers[eventName].push(handler);
        },
        fireEvent: function(eventName, data) {
            var handlers = this.eventHandlers[eventName] || [], len, i;
            for (i = 0, len = handlers.length; i < len; ++i) {
                handlers[i](data);
            }
        }
    };

    function PollingProxy(url) {
        this.eventHandlers = {};
        this.restUrl = url;
        this.timer = 0;
        this.timeout = 0;
        this.interval = 1000;
        this.xhr = null;
        this.needReconnect = true;
        this.responder = new Async(this.onMessage, this.onError, this);
        this.poll();
    }

    PollingProxy.prototype = new Proxy();

    deepExtend(PollingProxy.prototype, {
        onMessage: function(data) {
            clearTimeout(this.timeout);
            var self = this;

            this.timer = setTimeout(function() {
                self.poll();
            }, this.interval);

            this.fireEvent('messageReceived', data);
        },

        poll     : function() {
            var self = this;

            this.timeout = setTimeout(function() {
                self.onTimeout();
            }, 30 * 1000);

            this.xhr = Backendless._ajax({
                method      : 'GET',
                url         : this.restUrl,
                isAsync     : true,
                asyncHandler: this.responder
            });
        },

        close    : function() {
            clearTimeout(this.timer);
            clearTimeout(this.timeout);
            this.needReconnect = false;
            this.xhr && this.xhr.abort();
        },

        onTimeout: function() {
            this.xhr && this.xhr.abort();
        },

        onError  : function() {
            clearTimeout(this.timer);
            clearTimeout(this.timeout);

            if (this.needReconnect) {
                var self = this;
                this.xhr = null;

                this.timer = setTimeout(function() {
                    self.poll();
                }, this.interval);
            }
        }
    });

    function SocketProxy(url) {
        var self = this;
        this.reconnectWithPolling = true;

        try {
            var socket = this.socket = new WebSocket(url);
            socket.onopen = function() {
                return self.sockOpen();
            };
            socket.onerror = function(error) {
                return self.sockError(error);
            };
            socket.onclose = function() {
                self.onSocketClose();
            };

            socket.onmessage = function(event) {
                return self.onMessage(event);
            };
        } catch (e) {
            setTimeout(function() {
                self.onSocketClose();
            }, 100);
        }
    }

    SocketProxy.prototype = new Proxy();

    deepExtend(SocketProxy.prototype, {
        onMessage    : function() {
            this.fireEvent('messageReceived', data);
        },

        onSocketClose: function(data) {
            if (this.reconnectWithPolling) {
                this.fireEvent('socketClose', data);
            }
        },

        close        : function() {
            this.reconnectWithPolling = false;
            this.socket.close();
        }
    });

    function Subscription(config) {
        this.channelName = config.channelName;
        this.options = config.options;
        this.channelProperties = config.channelProperties;
        this.subscriptionId = null;
        this.restUrl = config.restUrl + '/' + config.channelName;
        this.responder = config.responder || emptyFn;
        this._subscribe(config.onSubscribe);
    }

    Subscription.prototype = {
        _subscribe        : function(async) {
            var responder = extractResponder(arguments);
            var isAsync = responder != null;
            var self = this;

            var _async = new Async(function(data) {
                self.subscriptionId = data.subscriptionId;
                self._startSubscription();
            }, function(e) {
                responder.fault(e);
            });

            var subscription = Backendless._ajax({
                method      : 'POST',
                url         : this.restUrl + '/subscribe',
                isAsync     : isAsync,
                data        : JSON.stringify(this.options),
                asyncHandler: _async
            });

            if (!isAsync) {
                this.subscriptionId = subscription.subscriptionId;
                this._startSubscription();
            }
        },

        _startSubscription: function() {
            var self = this;

            if (WebSocket) {
                var url = this.channelProperties['websocket'] + '/' + this.subscriptionId;
                this.proxy = new SocketProxy(url);

                this.proxy.on('socketClose', function() {
                    self._switchToPolling();
                });

                this.proxy.on('messageReceived', function() {
                    self.responder();
                });
            } else {
                this._switchToPolling();
            }

            this._startSubscription = emptyFn;
        },

        cancelSubscription: function() {
            this.proxy && this.proxy.close();
            this._startSubscription = emptyFn;
        },

        _switchToPolling  : function() {
            var url = this.restUrl + '/' + this.subscriptionId;
            this.proxy = new PollingProxy(url);
            var self = this;

            this.proxy.on('messageReceived', function(data) {
                if (data.messages.length) {
                    self.responder(data);
                }
            });
        }
    };

    function Messaging() {
        this.restUrl = Backendless.appPath + '/messaging';
        this.channelProperties = {};
    }

    Messaging.prototype = {
        _getProperties  : function(channelName, async) {
            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            var props = this.channelProperties[channelName];

            if (props) {
                if (isAsync) {
                    async.success(props);
                }

                return props;
            }

            var result = Backendless._ajax({
                method      : 'GET',
                url         : this.restUrl + '/' + channelName + '/properties',
                isAsync     : isAsync,
                asyncHandler: responder
            });

            this.channelProperties[channelName] = result;

            return result;
        },
        subscribe       : function(channelName, subscriptionCallback, subscriptionOptions, async) {
            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            if (isAsync) {
                var that = this;

                var callback = new Async(function(props) {
                    async.success(new Subscription({
                        channelName      : channelName,
                        options          : subscriptionOptions,
                        channelProperties: props,
                        responder        : subscriptionCallback,
                        restUrl          : that.restUrl,
                        onSubscribe      : responder
                    }));
                }, function(data) {
                    responder.fault(data);
                });

                this._getProperties(channelName, callback);
            } else {
                var props = this._getProperties(channelName);

                return new Subscription({
                    channelName      : channelName,
                    options          : subscriptionOptions,
                    channelProperties: props,
                    responder        : subscriptionCallback,
                    restUrl          : this.restUrl
                });
            }
        },
        publish         : function(channelName, message, publishOptions, deliveryTarget, async) {
            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            var data = {
                message: message
            };

            if (publishOptions) {
                if (!(publishOptions instanceof PublishOptions)) {
                    throw "Use PublishOption as publishOptions argument";
                }

                deepExtend(data, publishOptions);
            }

            if (deliveryTarget) {
                if (!(deliveryTarget instanceof DeliveryOptions)) {
                    throw "Use DeliveryOptions as deliveryTarget argument";
                }

                deepExtend(data, deliveryTarget);
            }

            return Backendless._ajax({
                method      : 'POST',
                url         : this.restUrl + '/' + channelName,
                isAsync     : isAsync,
                asyncHandler: responder,
                data        : JSON.stringify(data)
            });
        },
        sendEmail       : function(subject, bodyParts, recipients, attachments, async) {
            var responder = extractResponder(arguments);
            var isAsync = responder != null;
            var data = {};

            if (subject && !Utils.isEmpty(subject) && Utils.isString(subject)) {
                data.subject = subject;
            } else {
                throw "Subject is required parameter and must be a nonempty string";
            }

            if ((bodyParts instanceof Bodyparts) && !Utils.isEmpty(bodyParts)) {
                data.bodyparts = bodyParts;
            } else {
                throw "Use Bodyparts as bodyParts argument, must contain at least one property";
            }

            if (recipients && Utils.isArray(recipients) && !Utils.isEmpty(recipients)) {
                data.to = recipients;
            } else {
                throw "Recipients is required parameter, must be a nonempty array";
            }

            if (attachments) {
                if (Utils.isArray(attachments)) {
                    if (!Utils.isEmpty(attachments)) {
                        data.attachment = attachments;
                    }
                } else {
                    throw "Attachments must be an array of file IDs from File Service";
                }
            }

            return Backendless._ajax({
                method      : 'POST',
                url         : this.restUrl + '/email',
                isAsync     : isAsync,
                asyncHandler: responder,
                data        : JSON.stringify(data)
            });
        },

        cancel          : function(messageId, async) {
            var isAsync = async != null;

            return Backendless._ajax({
                method      : 'DELETE',
                url         : this.restUrl + '/' + messageId,
                isAsync     : isAsync,
                asyncHandler: new Async(emptyFn)
            });
        },

        registerDevice  : function(channels, expiration, async) {
            var responder = extractResponder(arguments);
            var isAsync = responder != null;
            var device = isBrowser ? window.device : NodeDevice;

            var data = {
                deviceToken: null, //This value will set in callback
                deviceId   : device.uuid,
                os         : device.platform,
                osVersion  : device.version
            };

            if (Utils.isArray(channels)) {
                data.channels = channels;
            }

            for (var i = 0, len = arguments.length; i < len; ++i) {
                var val = arguments[i];
                if (Utils.isNumber(val) || val instanceof Date) {
                    data.expiration = (val instanceof Date) ? val.getTime() / 1000 : val;
                }
            }

            var url = this.restUrl + '/registrations';

            var success = function(deviceToken) {
                data.deviceToken = deviceToken;

                Backendless._ajax({
                    method      : 'POST',
                    url         : url,
                    data        : JSON.stringify(data),
                    isAsync     : isAsync,
                    asyncHandler: responder
                });
            };

            var fail = function(status) {
                console.warn(JSON.stringify(['failed to register ', status]));
            };

            var config = {
                projectid: "http://backendless.com",
                appid    : Backendless.applicationId
            };

            cordova.exec(success, fail, "PushNotification", "registerDevice", [config]);
        },

        getRegistrations: function(async) {
            var deviceId = isBrowser ? window.device.uuid : NodeDevice.uuid;
            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            return Backendless._ajax({
                method      : 'GET',
                url         : this.restUrl + '/registrations/' + deviceId,
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        unregisterDevice: function(async) {
            var deviceId = isBrowser ? window.device.uuid : NodeDevice.uuid;
            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            var result = Backendless._ajax({
                method      : 'DELETE',
                url         : this.restUrl + '/registrations/' + deviceId,
                isAsync     : isAsync,
                asyncHandler: responder
            });

            try {
                cordova.exec(emptyFn, emptyFn, "PushNotification", "unregisterDevice", []);
            } catch (e) {
                console.log(e.message);
            }

            return result;
        }
    };
    function getBuilder(filename, filedata, boundary) {
        var dashdash = '--',
            crlf     = '\r\n',
            builder  = '';

        builder += dashdash;
        builder += boundary;
        builder += crlf;
        builder += 'Content-Disposition: form-data; name="file"';
        builder += '; filename="' + filename + '"';
        builder += crlf;

        builder += 'Content-Type: application/octet-stream';
        builder += crlf;
        builder += crlf;

        builder += filedata;
        builder += crlf;

        builder += dashdash;
        builder += boundary;
        builder += dashdash;
        builder += crlf;

        return builder;
    }

    function send(e) {
        var xhr         = new XMLHttpRequest(),
            boundary    = '-backendless-multipart-form-boundary-' + getNow(),
            builder     = getBuilder(this.fileName, e.target.result, boundary),
            badResponse = function(xhr) {
                var result = {};
                try {
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    result.message = xhr.responseText;
                }
                result.statusCode = xhr.status;
                return result;
            };

        xhr.open("POST", this.uploadPath, true);
        xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);
        xhr.setRequestHeader('application-id', Backendless.applicationId);
        xhr.setRequestHeader("secret-key", Backendless.secretKey);
        xhr.setRequestHeader("application-type", "JS");

        if ((currentUser != null && currentUser["user-token"])) {
            xhr.setRequestHeader("user-token", currentUser["user-token"]);
        } else if (Backendless.LocalCache.exists("user-token")) {
            xhr.setRequestHeader("user-token", Backendless.LocalCache.get("user-token"));
        }

        if (UIState !== null) {
            xhr.setRequestHeader("uiState", UIState);
        }

        var asyncHandler = this.asyncHandler;

        if (asyncHandler) {
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        asyncHandler.success(JSON.parse(xhr.responseText));
                    } else {
                        asyncHandler.fault(JSON.parse(xhr.responseText));
                    }
                }
            };
        }

        xhr.sendAsBinary(builder);

        if (asyncHandler) {
            return xhr;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
            return xhr.responseText ? JSON.parse(xhr.responseText) : true;
        } else {
            throw badResponse(xhr);
        }
    }

    function sendEncoded(e) {
        var xhr         = new XMLHttpRequest(),
            boundary    = '-backendless-multipart-form-boundary-' + getNow(),
            badResponse = function(xhr) {
                var result = {};
                try {
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    result.message = xhr.responseText;
                }
                result.statusCode = xhr.status;
                return result;
            };

        xhr.open("PUT", this.uploadPath, true);
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.setRequestHeader('application-id', Backendless.applicationId);
        xhr.setRequestHeader("secret-key", Backendless.secretKey);
        xhr.setRequestHeader("application-type", "JS");

        if (UIState !== null) {
            xhr.setRequestHeader("uiState", UIState);
        }

        var asyncHandler = this.asyncHandler;

        if (asyncHandler) {
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        asyncHandler.success(JSON.parse(xhr.responseText));
                    } else {
                        asyncHandler.fault(JSON.parse(xhr.responseText));
                    }
                }
            };
        }

        xhr.send(e.target.result.split(',')[1]);

        if (asyncHandler) {
            return xhr;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
            return xhr.responseText ? JSON.parse(xhr.responseText) : true;
        } else {
            throw badResponse(xhr);
        }
    }

    function FilePermissions() {
        this.restUrl = Backendless.appPath + '/files/permissions';
    }

    FilePermissions.prototype = {
        grantUser  : function(userid, url, permissionType, async) {
            this.varType = 'user';
            this.id = userid;

            return this.grant(url, permissionType, async);
        },

        grantRole  : function(rolename, url, permissionType, async) {
            this.varType = 'role';
            this.id = rolename;

            return this.grant(url, permissionType, async);
        },

        grant      : function(url, permissionType, async) {
            return this.sendRequest('GRANT', url, permissionType, async);
        },

        denyUser   : function(rolename, url, permissionType, async) {
            this.varType = 'role';
            this.id = rolename;

            return this.deny(url, permissionType, async);
        },

        denyRole   : function(rolename, url, permissionType, async) {
            this.varType = 'role';
            this.id = rolename;

            return this.deny(url, permissionType, async);
        },

        deny       : function(url, permissionType, async) {
            return this.sendRequest('DENY', url, permissionType, async);
        },

        sendRequest: function(type, url, permissionType, async) {
            var responder = extractResponder(arguments),
                isAsync   = responder != null,
                data      = {
                    "permission": permissionType
                };

            data[this.varType] = this.id || "*";

            return Backendless._ajax({
                method      : 'PUT',
                url         : this.restUrl + '/' + type + '/' + encodeURIComponent(url),
                data        : JSON.stringify(data),
                isAsync     : isAsync,
                asyncHandler: responder
            });
        }
    };

    function Files() {
        this.restUrl = Backendless.appPath + '/files';
    }

    Files.prototype = {
        saveFile  : function(path, fileName, fileContent, overwrite, async) {
            if (!path || !Utils.isString(path)) {
                throw new Error('Missing value for the "path" argument. The argument must contain a string value');
            }

            if (!fileName || !Utils.isString(path)) {
                throw new Error('Missing value for the "fileName" argument. The argument must contain a string value');
            }

            if (overwrite instanceof Backendless.Async) {
                async = overwrite;
                overwrite = null;
            }

            if (!(fileContent instanceof File)) {
                fileContent = new Blob([fileContent]);
            }

            if (fileContent.size > 2800000) {
                throw new Error('File Content size must be less than 2,800,000 bytes');
            }

            var baseUrl = this.restUrl + '/binary/' + path + ((Utils.isString(fileName)) ? '/' + fileName : '') + ((overwrite) ? '?overwrite=true' : '');

            try {
                var reader = new FileReader();
                reader.fileName = encodeURIComponent(fileName).replace(/'/g, "%27").replace(/"/g, "%22");
                reader.uploadPath = baseUrl;
                reader.onloadend = sendEncoded;

                if (async) {
                    reader.asyncHandler = async;
                }

                reader.onerror = function(evn) {
                    async.fault(evn);
                };

                reader.readAsDataURL(fileContent);

                if (!async) {
                    return true;
                }
            } catch (err) {
                console.log(err);
            }
        },

        upload    : function(files, path, overwrite, async) {
            files = files.files || files;
            var baseUrl = this.restUrl + '/' + path + '/';
            var overwriting = '';

            if (Utils.isBoolean(overwrite)) {
                overwriting = "?overwrite=" + overwrite;
            }

            if (isBrowser) {
                if (window.File && window.FileList) {
                    if (files instanceof File) {
                        files = [files];
                    }

                    var filesError = 0;

                    for (var i = 0, len = files.length; i < len; i++) {
                        try {
                            var reader = new FileReader();
                            reader.fileName = encodeURIComponent(files[i].name).replace(/'/g, "%27").replace(/"/g, "%22");
                            reader.uploadPath = baseUrl + reader.fileName + overwriting;
                            reader.onloadend = send;
                            reader.asyncHandler = async;
                            reader.onerror = function(evn) {
                                async.fault(evn);
                            };
                            reader.readAsBinaryString(files[i]);

                        } catch (err) {
                            filesError++;
                        }
                    }
                }
                else {
                    //IE iframe hack
                    var ifrm = document.createElement('iframe');
                    ifrm.id = ifrm.name = 'ifr' + getNow();
                    ifrm.width = ifrm.height = '0';

                    document.body.appendChild(ifrm);
                    var form = document.createElement('form');
                    form.target = ifrm.name;
                    form.enctype = 'multipart/form-data';
                    form.method = 'POST';
                    document.body.appendChild(form);
                    form.appendChild(files);
                    var fileName      = encodeURIComponent(files.value).replace(/'/g, "%27").replace(/"/g, "%22"),
                        index         = fileName.lastIndexOf('\\');

                    if (index) {
                        fileName = fileName.substring(index + 1);
                    }
                    form.action = baseUrl + fileName + overwriting;
                    form.submit();
                }
            } else {
                throw "Upload File not supported with NodeJS";
            }
        },

        listing   : function(path, pattern, recursively, pagesize, offset, async) {
            var responder = extractResponder(arguments),
                isAsync   = responder != null,
                url       = this.restUrl + '/' + path;

            if ((arguments.length > 1) && !(arguments[1] instanceof Backendless.Async)) {
                url += "?";
            }

            if (Utils.isString(pattern)) {
                url += ("pattern=" + pattern);
            }

            if (Utils.isBoolean(recursively)) {
                url += ("&sub=" + recursively);
            }

            if (Utils.isNumber(pagesize)) {
                url += "&pagesize=" + pagesize;
            }

            if (Utils.isNumber(offset)) {
                url += "&offset=" + offset;
            }

            return Backendless._ajax({
                method      : 'GET',
                url         : url,
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        renameFile: function(oldPathName, newName, async) {
            this._checkPath(oldPathName);

            var parameters = {
                oldPathName: oldPathName,
                newName    : newName
            };

            return this._doAction("rename", parameters, async);
        },

        moveFile  : function(sourcePath, targetPath, async) {
            this._checkPath(sourcePath);
            this._checkPath(targetPath);

            var parameters = {
                sourcePath: sourcePath,
                targetPath: targetPath
            };

            return this._doAction("move", parameters, async);
        },

        copyFile  : function(sourcePath, targetPath, async) {
            this._checkPath(sourcePath);
            this._checkPath(targetPath);

            var parameters = {
                sourcePath: sourcePath,
                targetPath: targetPath
            };

            return this._doAction("copy", parameters, async);
        },

        _checkPath: function(path) {
            if (!(/^\//).test(path)) {
                path = "/" + path;
            }

            return path;
        },

        _doAction : function(actionType, parameters, async) {
            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            return Backendless._ajax({
                method      : 'PUT',
                url         : this.restUrl + '/' + actionType,
                data        : JSON.stringify(parameters),
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        remove    : function(fileURL, async) {
            var responder = extractResponder(arguments);
            var isAsync = responder != null;
            var url = fileURL.indexOf("http://") === 0 || fileURL.indexOf("https://") === 0 ? fileURL : this.restUrl + '/' + fileURL;

            Backendless._ajax({
                method      : 'DELETE',
                url         : url,
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        exists    : function(path, async) {
            if (!path || !Utils.isString(path)) {
                throw new Error('Missing value for the "path" argument. The argument must contain a string value');
            }

            var responder = extractResponder(arguments),
                isAsync   = responder != null,
                url       = this.restUrl + '/exists/' + path;

            return Backendless._ajax({
                method      : 'GET',
                url         : url,
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        removeDirectory: function(path, async) {
            var responder = extractResponder(arguments);
            var isAsync = responder != null;

            return Backendless._ajax({
                method      : 'DELETE',
                url         : this.restUrl + '/' + path,
                isAsync     : isAsync,
                asyncHandler: responder
            });
        }
    };

    function Commerce() {
        this.restUrl = Backendless.appPath + '/commerce/googleplay';
    }

    Commerce.prototype.validatePlayPurchase = function(packageName, productId, token, async) {
        if (arguments.length < 3) {
            throw new Error('Package Name, Product Id, Token must be provided and must be not an empty STRING!');
        }

        for (var i = arguments.length - 2; i >= 0; i--) {
            if (!arguments[i] || !Utils.isString(arguments[i])) {
                throw new Error('Package Name, Product Id, Token must be provided and must be not an empty STRING!');
            }
        }

        var responder = extractResponder(arguments),
            isAsync   = responder != null;

        if (responder) {
            responder = wrapAsync(responder);
        }

        return Backendless._ajax({
            method      : 'GET',
            url         : this.restUrl + '/validate/' + packageName + '/inapp/' + productId + '/purchases/' + token,
            isAsync     : isAsync,
            asyncHandler: responder
        });
    };

    Commerce.prototype.cancelPlaySubscription = function(packageName, subscriptionId, token, Async) {
        if (arguments.length < 3) {
            throw new Error('Package Name, Subscription Id, Token must be provided and must be not an empty STRING!');
        }

        for (var i = arguments.length - 2; i >= 0; i--) {
            if (!arguments[i] || !Utils.isString(arguments[i])) {
                throw new Error('Package Name, Subscription Id, Token must be provided and must be not an empty STRING!');
            }
        }

        var responder = extractResponder(arguments),
            isAsync   = responder != null;

        if (responder) {
            responder = wrapAsync(responder);
        }

        return Backendless._ajax({
            method      : 'POST',
            url         : this.restUrl + '/' + packageName + '/subscription/' + subscriptionId + '/purchases/' + token + '/cancel',
            isAsync     : isAsync,
            asyncHandler: responder
        });
    };

    Commerce.prototype.getPlaySubscriptionStatus = function(packageName, subscriptionId, token, Async) {
        if (arguments.length < 3) {
            throw new Error('Package Name, Subscription Id, Token must be provided and must be not an empty STRING!');
        }

        for (var i = arguments.length - 2; i >= 0; i--) {
            if (!arguments[i] || !Utils.isString(arguments[i])) {
                throw new Error('Package Name, Subscription Id, Token must be provided and must be not an empty STRING!');
            }
        }

        var responder = extractResponder(arguments),
            isAsync   = responder != null;

        if (responder) {
            responder = wrapAsync(responder);
        }

        return Backendless._ajax({
            method      : 'GET',
            url         : this.restUrl + '/' + packageName + '/subscription/' + subscriptionId + '/purchases/' + token,
            isAsync     : isAsync,
            asyncHandler: responder
        });
    };

    function Events() {
        this.restUrl = Backendless.appPath + '/servercode/events';
    }

    Events.prototype.dispatch = function(eventname, eventArgs, Async) {
        if (!eventname || !Utils.isString(eventname)) {
            throw new Error('Event Name must be provided and must be not an empty STRING!');
        }

        eventArgs = Utils.isObject(eventArgs) ? eventArgs : {};

        var responder = extractResponder(arguments),
            isAsync   = responder != null;

        if (responder) {
            responder = wrapAsync(responder);
        }

        eventArgs = eventArgs instanceof Backendless.Async ? {} : eventArgs;

        return Backendless._ajax({
            method      : 'POST',
            url         : this.restUrl + '/' + eventname,
            data        : JSON.stringify(eventArgs),
            isAsync     : isAsync,
            asyncHandler: responder
        });
    };

    var Cache = function() {
    };

    var FactoryMethods = {};

    Cache.prototype = {
        put             : function(key, value, timeToLive, async) {
            if (!Utils.isString(key)) {
                throw new Error('You can use only String as key to put into Cache');
            }

            if (!(timeToLive instanceof Backendless.Async)) {
                if (typeof timeToLive == 'object' && !arguments[3]) {
                    async = timeToLive;
                    timeToLive = null;
                } else if (typeof timeToLive != ('number' || 'string') && timeToLive != null) {
                    throw new Error('You can use only String as timeToLive attribute to put into Cache');
                }
            } else {
                async = timeToLive;
                timeToLive = null;
            }

            if (Utils.isObject(value) && value.constructor !== Object) {
                value.___class = value.___class || getClassName.call(value);
            }

            var responder = extractResponder([async]), isAsync = false;

            if (responder != null) {
                isAsync = true;
                responder = wrapAsync(responder);
            }

            return Backendless._ajax({
                method      : 'PUT',
                url         : Backendless.serverURL + '/' + Backendless.appVersion + '/cache/' + key + ((timeToLive) ? '?timeout=' + timeToLive : ''),
                data        : JSON.stringify(value),
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        expireIn        : function(key, seconds, async) {
            if (Utils.isString(key) && (Utils.isNumber(seconds) || Utils.isDate(seconds)) && seconds) {
                seconds = (Utils.isDate(seconds)) ? seconds.getTime() : seconds;
                var responder = extractResponder(arguments), isAsync = false;
                if (responder != null) {
                    isAsync = true;
                    responder = wrapAsync(responder);
                }

                return Backendless._ajax({
                    method      : 'PUT',
                    url         : Backendless.serverURL + '/' + Backendless.appVersion + '/cache/' + key + '/expireIn?timeout=' + seconds,
                    data        : JSON.stringify({}),
                    isAsync     : isAsync,
                    asyncHandler: responder
                });
            } else {
                throw new Error('The "key" argument must be String. The "seconds" argument can be either Number or Date');
            }
        },

        expireAt        : function(key, timestamp, async) {
            if (Utils.isString(key) && (Utils.isNumber(timestamp) || Utils.isDate(timestamp)) && timestamp) {
                timestamp = (Utils.isDate(timestamp)) ? timestamp.getTime() : timestamp;
                var responder = extractResponder(arguments), isAsync = false;
                if (responder != null) {
                    isAsync = true;
                    responder = wrapAsync(responder);
                }

                return Backendless._ajax({
                    method      : 'PUT',
                    url         : Backendless.serverURL + '/' + Backendless.appVersion + '/cache/' + key + '/expireAt?timestamp=' + timestamp,
                    data        : JSON.stringify({}),
                    isAsync     : isAsync,
                    asyncHandler: responder
                });
            } else {
                throw new Error('You can use only String as key while expire in Cache. Second attribute must be declared and must be a Number or Date type');
            }
        },

        cacheMethod     : function(method, key, contain, async) {
            if (!Utils.isString(key)) {
                throw new Error('The "key" argument must be String');
            }

            var responder = extractResponder(arguments), isAsync = false;

            if (responder != null) {
                isAsync = true;
                responder = wrapAsync(responder);
            }

            return Backendless._ajax({
                method      : method,
                url         : Backendless.serverURL + '/' + Backendless.appVersion + '/cache/' + key + (contain ? '/check' : ''),
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        contains        : function(key, async) {
            return this.cacheMethod('GET', key, true, async);
        },

        get             : function(key, async) {
            if (!Utils.isString(key)) {
                throw new Error('The "key" argument must be String');
            }

            function parseResult(result) {
                var className = result && result.___class;

                if (className) {
                    var clazz = FactoryMethods[className] || root[className];

                    if (clazz) {
                        result = new clazz(result);
                    }
                }

                return result;
            }

            var responder = extractResponder(arguments), isAsync = false;

            if (responder != null) {
                isAsync = true;
                responder = wrapAsync(responder, parseResult, this);
            }

            var result = Backendless._ajax({
                method      : 'GET',
                url         : Backendless.serverURL + '/' + Backendless.appVersion + '/cache/' + key,
                isAsync     : isAsync,
                asyncHandler: responder
            });

            return isAsync ? result : parseResult(result);
        },

        remove          : function(key, async) {
            return this.cacheMethod('DELETE', key, false, async);
        },

        setObjectFactory: function(objectName, factoryMethod) {
            FactoryMethods[objectName] = factoryMethod;
        }
    };

    var Counters = function() {
    };

    var AtomicInstance = function(counterName) {
        this.name = counterName;
    };

    Counters.prototype = {
        of                      : function(counterName) {
            return new AtomicInstance(counterName);
        },

        getConstructor          : function() {
            return this;
        },

        counterNameValidation   : function(counterName) {
            if (!counterName) {
                throw new Error('Missing value for the "counterName" argument. The argument must contain a string value.');
            }

            if (!Utils.isString(counterName)) {
                throw new Error('Invalid value for the "value" argument. The argument must contain only string values');
            }

            this.name = counterName;
        },

        implementMethod         : function(method, urlPart, async) {
            var responder = extractResponder(arguments), isAsync = false;

            if (responder != null) {
                isAsync = true;
                responder = wrapAsync(responder);
            }

            return Backendless._ajax({
                method      : method,
                url         : Backendless.serverURL + '/' + Backendless.appVersion + '/counters/' + this.name + urlPart,
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        incrementAndGet         : function(counterName, async) {
            this.counterNameValidation(counterName, async);

            return this.implementMethod('PUT', '/increment/get', async);
        },

        getAndIncrement         : function(counterName, async) {
            this.counterNameValidation(counterName, async);

            return this.implementMethod('PUT', '/get/increment', async);
        },

        decrementAndGet         : function(counterName, async) {
            this.counterNameValidation(counterName, async);

            return this.implementMethod('PUT', '/decrement/get', async);
        },

        getAndDecrement         : function(counterName, async) {
            this.counterNameValidation(counterName, async);

            return this.implementMethod('PUT', '/get/decrement', async);
        },

        reset                   : function(counterName, async) {
            this.counterNameValidation(counterName, async);

            return this.implementMethod('PUT', '/reset', async);
        },

        get                     : function(counterName, async) {
            this.counterNameValidation(counterName, async);

            var responder = extractResponder(arguments), isAsync = false;

            if (responder != null) {
                isAsync = true;
                responder = wrapAsync(responder);
            }

            return Backendless._ajax({
                method      : 'GET',
                url         : Backendless.serverURL + '/' + Backendless.appVersion + '/counters/' + this.name,
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        implementMethodWithValue: function(urlPart, value, async) {
            if (!value) {
                throw new Error('Missing value for the "value" argument. The argument must contain a numeric value.');
            }

            if (!Utils.isNumber(value)) {
                throw new Error('Invalid value for the "value" argument. The argument must contain only numeric values');
            }

            var responder = extractResponder(arguments), isAsync = false;

            if (responder != null) {
                isAsync = true;
                responder = wrapAsync(responder);
            }

            return Backendless._ajax({
                method      : 'PUT',
                url         : Backendless.serverURL + '/' + Backendless.appVersion + '/counters/' + this.name + urlPart + ((value) ? value : ''),
                isAsync     : isAsync,
                asyncHandler: responder
            });
        },

        addAndGet               : function(counterName, value, async) {
            this.counterNameValidation(counterName, async);

            return this.implementMethodWithValue('/get/incrementby?value=', value, async);
        },

        getAndAdd               : function(counterName, value, async) {
            this.counterNameValidation(counterName, async);

            return this.implementMethodWithValue('/incrementby/get?value=', value, async);
        },

        compareAndSet           : function(counterName, expected, updated, async) {
            this.counterNameValidation(counterName, async);

            if (!expected || !updated) {
                throw new Error('Missing values for the "expected" and/or "updated" arguments. The arguments must contain numeric values');
            }

            if (!Utils.isNumber(expected) || !Utils.isNumber(updated)) {
                throw new Error('Missing value for the "expected" and/or "updated" arguments. The arguments must contain a numeric value');
            }

            var responder = extractResponder(arguments), isAsync = false;

            if (responder != null) {
                isAsync = true;
                responder = wrapAsync(responder);
            }

            return Backendless._ajax({
                method      : 'PUT',
                url         : Backendless.serverURL + '/' + Backendless.appVersion + '/counters/' + this.name + '/get/compareandset?expected=' + ((expected && updated) ? expected + '&updatedvalue=' + updated : ''),
                isAsync     : isAsync,
                asyncHandler: responder
            });
        }
    };

    AtomicInstance.prototype = {
        incrementAndGet: function(async) {
            return Counters.prototype.getConstructor().incrementAndGet(this.name, async);
        },
        getAndIncrement: function(async) {
            return Counters.prototype.getConstructor().getAndIncrement(this.name, async);
        },
        decrementAndGet: function(async) {
            return Counters.prototype.getConstructor().decrementAndGet(this.name, async);
        },
        getAndDecrement: function(async) {
            return Counters.prototype.getConstructor().getAndDecrement(this.name, async);
        },
        reset          : function(async) {
            return Counters.prototype.getConstructor().reset(this.name, async);
        },
        get            : function(async) {
            return Counters.prototype.getConstructor().get(this.name, async);
        },
        addAndGet      : function(value, async) {
            return Counters.prototype.getConstructor().addAndGet(this.name, value, async);
        },
        getAndAdd      : function(value, async) {
            return Counters.prototype.getConstructor().getAndAdd(this.name, value, async);
        },
        compareAndSet  : function(expected, updated, async) {
            return Counters.prototype.getConstructor().getAndAdd(this.name, expected, updated, async);
        }
    };

    var lastFlushListeners;

    Backendless.Logging = {
        restUrl              : root.url,
        loggers              : {},
        logInfo              : [],
        messagesCount        : 0,
        numOfMessages        : 10,
        timeFrequency        : 1,
        getLogger            : function(loggerName) {
            if (!Utils.isString(loggerName)) {
                throw new Error("Invalid 'loggerName' value. LoggerName must be a string value");
            }

            if (!this.loggers[loggerName]) {
                this.loggers[loggerName] = new Logging(loggerName);
            }

            return this.loggers[loggerName];
        },

        flush: function() {
            var async = extractResponder(arguments);

            if (this.logInfo.length) {
                this.flushInterval && clearTimeout(this.flushInterval);

                var listeners;
                var cb = function(method) {
                    return function() {
                        for (var i = 0; i < listeners.length; i++) {
                            listeners[i][method].apply(null, arguments);
                        }

                        if (listeners === lastFlushListeners) {
                            lastFlushListeners = null;
                        }
                    }
                };

                if (async) {
                    listeners = lastFlushListeners = lastFlushListeners ? lastFlushListeners.splice(0) : [];
                    listeners.push(async);
                }

                Backendless._ajax({
                    method      : 'PUT',
                    isAsync     : !!async,
                    asyncHandler: async && new Async(cb('success'), cb('failure')),
                    url         : Backendless.serverURL + '/' + Backendless.appVersion + '/log',
                    data        : JSON.stringify(this.logInfo)
                });

                this.logInfo = [];
                this.messagesCount = 0;
            } else if (async) {
                if (lastFlushListeners) {
                    lastFlushListeners.push(async);
                } else {
                    setTimeout(async.success, 0);
                }
            }
        },

        sendRequest          : function() {
            var logging = this;

            this.flushInterval = setTimeout(function() {
                logging.flush(new Backendless.Async());
            }, this.timeFrequency * 1000);
        },

        checkMessagesLen     : function() {
            if (this.messagesCount > (this.numOfMessages - 1)) {
                this.sendRequest();
            }
        },

        setLogReportingPolicy: function(numOfMessages, timeFrequency) {
            this.numOfMessages = numOfMessages;
            this.timeFrequency = timeFrequency;
            this.checkMessagesLen();
        }
    };

    function Logging(name) {
        this.name = name;
    }

    function setLogMessage(logger, logLevel, message, exception) {
        var messageObj = {};
        messageObj['message'] = message;
        messageObj['timestamp'] = Date.now();
        messageObj['exception'] = (exception) ? exception : null;
        messageObj['logger'] = logger;
        messageObj['log-level'] = logLevel;
        Backendless.Logging.logInfo.push(messageObj);
        Backendless.Logging.messagesCount++;
        Backendless.Logging.checkMessagesLen();
    }

    Logging.prototype = {
        debug: function(message) {
            return setLogMessage(this.name, "DEBUG", message);
        },
        info : function(message) {
            return setLogMessage(this.name, "INFO", message);
        },
        warn : function(message, exception) {
            return setLogMessage(this.name, "WARN", message, exception);
        },
        error: function(message, exception) {
            return setLogMessage(this.name, "ERROR", message, exception);
        },
        fatal: function(message, exception) {
            return setLogMessage(this.name, "FATAL", message, exception);
        },
        trace: function(message) {
            return setLogMessage(this.name, "TRACE", message);
        }
    };

    function CustomServices() {
    }

    CustomServices.prototype = {
        invoke: function(serviceName, serviceVersion, method, parameters, async) {
            var responder = extractResponder(arguments),
                isAsync   = responder != null;

            return Backendless._ajax({
                method      : "POST",
                url         : Backendless.serverURL + '/' + Backendless.appVersion + '/services/' + serviceName + '/' + serviceVersion + '/' + method,
                data        : JSON.stringify(parameters),
                isAsync     : isAsync,
                asyncHandler: responder
            });
        }
    };

    function promisify(fn) {
        return function() {
            var context = this;
            var args = [].slice.call(arguments);

            return new Promise(function(resolve, reject)  {
                args.push(new Async(resolve, reject, context));
                fn.apply(context, args);
            });
        }
    }

    function promisifyPack(data) {
        var obj = data[0];
        var methods = data[1];

        methods.forEach(function(name) {
            obj[name] = promisify(obj[name]);
        });
    }

    function enablePromises() {
        if (promisesEnabled) {
            return;
        }

        if (typeof Promise === 'undefined') {
            throw new Error('Promises are not supported by your browser. ' +
                'Please use "Backendless.Async" to make async requests, ' +
                'or upgrade to a modern browser.\nSee ' + 'http://caniuse.com/#feat=promises');
        }

        promisesEnabled = true;

        [
            [DataPermissions.prototype.FIND, Object.keys(DataPermissions.prototype.FIND)],
            [DataPermissions.prototype.REMOVE, Object.keys(DataPermissions.prototype.REMOVE)],
            [DataPermissions.prototype.UPDATE, Object.keys(DataPermissions.prototype.UPDATE)],
            [Files.prototype, ['saveFile', 'upload', 'listing', '_doAction', 'remove', 'exists', 'removeDirectory']],
            [Commerce.prototype, ['validatePlayPurchase', 'cancelPlaySubscription', 'getPlaySubscriptionStatus']],
            [Counters.prototype, ['implementMethod', 'get', 'implementMethodWithValue', 'compareAndSet']],
            [DataStore.prototype, ['save', 'remove', 'find', 'findById', 'loadRelations']],
            [Cache.prototype, ['put', 'expireIn', 'expireAt', 'cacheMethod', 'get']],
            [persistence, ['describe', 'getView', 'callStoredProcedure']],
            [FilePermissions.prototype, ['sendRequest']],
            [CustomServices.prototype, ['invoke']],
            [Events.prototype, ['dispatch']],
            [PollingProxy.prototype, ['poll']],
            [Backendless.Logging, ['flush']],
            [Messaging.prototype, ['publish', 'sendEmail', 'cancel', 'subscribe', 'registerDevice',
                                   'getRegistrations', 'unregisterDevice']],
            [Geo.prototype, ['addPoint', 'savePoint', 'findUtil', 'loadMetadata', 'getClusterPoints', 'addCategory',
                             'getCategories', 'deleteCategory', 'deletePoint']],
            [UserService.prototype, ['register', 'getUserRoles', 'roleHelper', 'login', 'describeUserClass',
                                     'restorePassword', 'logout', 'update', 'isValidLogin', 'loginWithFacebookSdk',
                                     'loginWithGooglePlusSdk', 'loginWithGooglePlus', 'loginWithTwitter', 'loginWithFacebook',
                                     'resendEmailConfirmation']]
        ].forEach(promisifyPack);

        UserService.prototype.getCurrentUser = function() {
            if (currentUser) {
                return Promise.resolve(this._getUserFromResponse(currentUser));
            }

            var stayLoggedIn = Backendless.LocalCache.get("stayLoggedIn");
            var currentUserId = stayLoggedIn && Backendless.LocalCache.get("current-user-id");

            return currentUserId && persistence.of(User).findById(currentUserId) || Promise.resolve(null);
        };

        UserService.prototype.isValidLogin = function() {
            var userToken = Backendless.LocalCache.get("user-token");

            if (userToken) {
                return new Promise(function(resolve, reject) {
                    return Backendless._ajax({
                        method: 'GET',
                        url: Backendless.serverURL + '/' + Backendless.appVersion + '/users/isvalidusertoken/' + userToken,
                        isAsync: true,
                        asyncHandler: new Async(resolve, reject)
                    });
                });
            }

            return Backendless.UserService.getCurrentUser()
                .then(function(user) {
                    return Promise.resolve(!!user);
                }, function() {
                    return Promise.resolve(false);
                });
        };
    }

    Backendless.initApp = function(appId, secretKey, appVersion) {
        Backendless.applicationId = appId;
        Backendless.secretKey = secretKey;
        Backendless.appVersion = appVersion;
        Backendless.appPath = [Backendless.serverURL, Backendless.appVersion].join('/');
        Backendless.UserService = new UserService();
        Backendless.Users = Backendless.UserService;
        Backendless.Geo = new Geo();
        Backendless.Persistence = persistence;
        Backendless.Data = persistence;
        Backendless.Data.Permissions = new DataPermissions();
        Backendless.Messaging = new Messaging();
        Backendless.Files = new Files();
        Backendless.Files.Permissions = new FilePermissions();
        Backendless.Commerce = new Commerce();
        Backendless.Events = new Events();
        Backendless.Cache = new Cache();
        Backendless.Counters = new Counters();
        Backendless.CustomServices = new CustomServices();
        dataStoreCache = {};
        currentUser = null;
    };

    var DataQuery = function () {
        this.properties = [];
        this.condition = null;
        this.options = null;
        this.url = null;
    };

    DataQuery.prototype = {
        addProperty: function(prop) {
            this.properties = this.properties || [];
            this.properties.push(prop);
        }
    };

    var GeoQuery = function() {
        this.searchRectangle = undefined;
        this.categories = [];
        this.includeMetadata = true;
        this.metadata = undefined;
        this.condition = undefined;
        this.relativeFindMetadata = undefined;
        this.relativeFindPercentThreshold = undefined;
        this.pageSize = undefined;
        this.latitude = undefined;
        this.longitude = undefined;
        this.radius = undefined;
        this.units = undefined;
        this.degreePerPixel = undefined;
        this.clusterGridSize = undefined;
    };

    GeoQuery.prototype = {
        addCategory        : function() {
            this.categories = this.categories || [];
            this.categories.push();
        },

        setClusteringParams: function(westLongitude, eastLongitude, mapWidth, clusterGridSize) {
            clusterGridSize = clusterGridSize || 0;
            var parsedWestLongitude   = parseFloat(westLongitude),
                parsedEastLongitude   = parseFloat(eastLongitude),
                parsedMapWidth        = parseInt(mapWidth),
                parsedClusterGridSize = parseInt(clusterGridSize);

            if (!isFinite(parsedWestLongitude) || parsedWestLongitude < -180 || parsedWestLongitude > 180) {
                throw new Error("The westLongitude value must be a number in the range between -180 and 180");
            }

            if (!isFinite(parsedEastLongitude) || parsedEastLongitude < -180 || parsedEastLongitude > 180) {
                throw new Error("The eastLongitude value must be a number in the range between -180 and 180");
            }

            if (!isFinite(parsedMapWidth) || parsedMapWidth < 1) {
                throw new Error("The mapWidth value must be a number greater or equal to 1");
            }

            if (!isFinite(parsedClusterGridSize) || parsedClusterGridSize < 0) {
                throw new Error("The clusterGridSize value must be a number greater or equal to 0");
            }

            var longDiff = parsedEastLongitude - parsedWestLongitude;

            (longDiff < 0) && (longDiff += 360);

            this.degreePerPixel = longDiff / parsedMapWidth;
            this.clusterGridSize = parsedClusterGridSize || null;
        }
    };

    var GeoPoint = function(args) {
        args = args || {};
        this.___class = "GeoPoint";
        this.categories = args.categories;
        this.latitude = args.latitude;
        this.longitude = args.longitude;
        this.metadata = args.metadata;
        this.objectId = args.objectId;
    };

    var GeoCluster = function(args) {
        args = args || {};
        this.categories = args.categories;
        this.latitude = args.latitude;
        this.longitude = args.longitude;
        this.metadata = args.metadata;
        this.objectId = args.objectId;
        this.totalPoints = args.totalPoints;
        this.geoQuery = args.geoQuery;
    };

    var PublishOptionsHeaders = { //PublishOptions headers namespace helper
        'MESSAGE_TAG'                  : 'message',
        'IOS_ALERT_TAG'                : 'ios-alert',
        'IOS_BADGE_TAG'                : 'ios-badge',
        'IOS_SOUND_TAG'                : 'ios-sound',
        'ANDROID_TICKER_TEXT_TAG'      : 'android-ticker-text',
        'ANDROID_CONTENT_TITLE_TAG'    : 'android-content-title',
        'ANDROID_CONTENT_TEXT_TAG'     : 'android-content-text',
        'ANDROID_ACTION_TAG'           : 'android-action',
        'WP_TYPE_TAG'                  : 'wp-type',
        'WP_TITLE_TAG'                 : 'wp-title',
        'WP_TOAST_SUBTITLE_TAG'        : 'wp-subtitle',
        'WP_TOAST_PARAMETER_TAG'       : 'wp-parameter',
        'WP_TILE_BACKGROUND_IMAGE'     : 'wp-backgroundImage',
        'WP_TILE_COUNT'                : 'wp-count',
        'WP_TILE_BACK_TITLE'           : 'wp-backTitle',
        'WP_TILE_BACK_BACKGROUND_IMAGE': 'wp-backImage',
        'WP_TILE_BACK_CONTENT'         : 'wp-backContent',
        'WP_RAW_DATA'                  : 'wp-raw'
    };

    var PublishOptions = function(args) {
        args = args || {};
        this.publisherId = args.publisherId || undefined;
        this.headers = args.headers || undefined;
        this.subtopic = args.subtopic || undefined;
    };

    var DeliveryOptions = function(args) {
        args = args || {};
        this.pushPolicy = args.pushPolicy || undefined;
        this.pushBroadcast = args.pushBroadcast || undefined;
        this.pushSinglecast = args.pushSinglecast || undefined;
        this.publishAt = args.publishAt || undefined;
        this.repeatEvery = args.repeatEvery || undefined;
        this.repeatExpiresAt = args.repeatExpiresAt || undefined;
    };

    var Bodyparts = function(args) {
        args = args || {};
        this.textmessage = args.textmessage || undefined;
        this.htmlmessage = args.htmlmessage || undefined;
    };

    var SubscriptionOptions = function(args) {
        args = args || {};
        this.subscriberId = args.subscriberId || undefined;
        this.subtopic = args.subtopic || undefined;
        this.selector = args.selector || undefined;
    };

    Backendless.DataQuery = DataQuery;
    Backendless.GeoQuery = GeoQuery;
    Backendless.GeoPoint = GeoPoint;
    Backendless.GeoCluster = GeoCluster;
    Backendless.Bodyparts = Bodyparts;
    Backendless.PublishOptions = PublishOptions;
    Backendless.DeliveryOptions = DeliveryOptions;
    Backendless.SubscriptionOptions = SubscriptionOptions;
    Backendless.PublishOptionsHeaders = PublishOptionsHeaders;

    try {
        /** @deprecated */
        root.GeoPoint = Backendless.GeoPoint;

        /** @deprecated */
        root.GeoCluster = Backendless.GeoCluster;

        /** @deprecated */
        root.BackendlessGeoQuery = Backendless.GeoQuery;

        /** @deprecated */
        root.Bodyparts = Backendless.Bodyparts;

        /** @deprecated */
        root.PublishOptions = Backendless.PublishOptions;

        /** @deprecated */
        root.DeliveryOptions = Backendless.DeliveryOptions;

        /** @deprecated */
        root.SubscriptionOptions = Backendless.SubscriptionOptions;

        /** @deprecated */
        root.PublishOptionsHeaders = Backendless.PublishOptionsHeaders;
    } catch (error) {
        console && console.warn(error);
    }

    return Backendless;
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"buffer":8,"url":17}],7:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],8:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":7,"ieee754":9,"isarray":10}],9:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],10:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],11:[function(require,module,exports){
//! moment.js
//! version : 2.15.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        var k;
        for (k in obj) {
            // even if its not own property I'd still call it non-empty
            return false;
        }
        return true;
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            }
            else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    function isUndefined(input) {
        return input === void 0;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (utils_hooks__hooks.deprecationHandler != null) {
                utils_hooks__hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (utils_hooks__hooks.deprecationHandler != null) {
            utils_hooks__hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;
    utils_hooks__hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({unit: u, priority: priorities[u]});
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function get_set__set (mom, unit, value) {
        if (mom.isValid()) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    // MOMENTS

    function stringGet (units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet (units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        if (!m) {
            return this._months;
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        if (!m) {
            return this._monthsShort;
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function units_month__handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = create_utc__createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return units_month__handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (typeof value !== 'number') {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        //the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        if (!m) {
            return this._weekdays;
        }
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function day_of_week__handleStrictParse(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = create_utc__createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return day_of_week__handleStrictParse.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = create_utc__createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        ordinalParse: defaultOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            var parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    // treat as if there is no base config
                    deprecateSimple('parentLocaleUndefined',
                            'specified parentLocale is not defined yet. See http://momentjs.com/guides/#/warnings/parent-locale/');
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, parentConfig = baseConfig;
            // MERGE
            if (locales[name] != null) {
                parentConfig = locales[name]._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function locale_locales__listLocales() {
        return keys(locales);
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(utils_hooks__hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (isDate(input)) {
            config._d = input;
        } else if (format) {
            configFromStringAndFormat(config);
        }  else {
            configFromInput(config);
        }

        if (!valid__isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date(utils_hooks__hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = local__createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return valid__createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = local__createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return valid__createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = ((string || '').match(matcher) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : local__createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
            } else if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);

            if (tZone === 0) {
                this.utcOffset(0, true);
            } else {
                this.utcOffset(offsetFromString(matchOffset, this._i));
            }
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])                         * sign,
                h  : toInt(match[HOUR])                         * sign,
                m  : toInt(match[MINUTE])                       * sign,
                s  : toInt(match[SECOND])                       * sign,
                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = utils_hooks__hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            delta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    utils_hooks__hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if (isFunction(Date.prototype.toISOString)) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? utils_hooks__hooks.defaultFormatUtc : utils_hooks__hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
            case 'date':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }

        // 'date' is an alias for 'day', so it should be considered as such.
        if (units === 'date') {
            units = 'day';
        }

        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return new Date(this.valueOf());
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIOROITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add               = add_subtract__add;
    momentPrototype__proto.calendar          = moment_calendar__calendar;
    momentPrototype__proto.clone             = clone;
    momentPrototype__proto.diff              = diff;
    momentPrototype__proto.endOf             = endOf;
    momentPrototype__proto.format            = format;
    momentPrototype__proto.from              = from;
    momentPrototype__proto.fromNow           = fromNow;
    momentPrototype__proto.to                = to;
    momentPrototype__proto.toNow             = toNow;
    momentPrototype__proto.get               = stringGet;
    momentPrototype__proto.invalidAt         = invalidAt;
    momentPrototype__proto.isAfter           = isAfter;
    momentPrototype__proto.isBefore          = isBefore;
    momentPrototype__proto.isBetween         = isBetween;
    momentPrototype__proto.isSame            = isSame;
    momentPrototype__proto.isSameOrAfter     = isSameOrAfter;
    momentPrototype__proto.isSameOrBefore    = isSameOrBefore;
    momentPrototype__proto.isValid           = moment_valid__isValid;
    momentPrototype__proto.lang              = lang;
    momentPrototype__proto.locale            = locale;
    momentPrototype__proto.localeData        = localeData;
    momentPrototype__proto.max               = prototypeMax;
    momentPrototype__proto.min               = prototypeMin;
    momentPrototype__proto.parsingFlags      = parsingFlags;
    momentPrototype__proto.set               = stringSet;
    momentPrototype__proto.startOf           = startOf;
    momentPrototype__proto.subtract          = add_subtract__subtract;
    momentPrototype__proto.toArray           = toArray;
    momentPrototype__proto.toObject          = toObject;
    momentPrototype__proto.toDate            = toDate;
    momentPrototype__proto.toISOString       = moment_format__toISOString;
    momentPrototype__proto.toJSON            = toJSON;
    momentPrototype__proto.toString          = toString;
    momentPrototype__proto.unix              = unix;
    momentPrototype__proto.valueOf           = to_type__valueOf;
    momentPrototype__proto.creationData      = creationData;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    momentPrototype__proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat (string) {
        return string;
    }

    var prototype__proto = Locale.prototype;

    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto.ordinal         = ordinal;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months            =        localeMonths;
    prototype__proto.monthsShort       =        localeMonthsShort;
    prototype__proto.monthsParse       =        localeMonthsParse;
    prototype__proto.monthsRegex       = monthsRegex;
    prototype__proto.monthsShortRegex  = monthsShortRegex;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    prototype__proto.weekdaysRegex       =        weekdaysRegex;
    prototype__proto.weekdaysShortRegex  =        weekdaysShortRegex;
    prototype__proto.weekdaysMinRegex    =        weekdaysMinRegex;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = lists__get(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = locale_locales__getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return lists__get(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = lists__get(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function lists__listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function lists__listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function lists__listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function lists__listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes <= 1           && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   <= 1           && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    <= 1           && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  <= 1           && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   <= 1           && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function duration_humanize__getSetRelativeTimeRounding (roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.15.1';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.now                   = now;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.updateLocale          = updateLocale;
    utils_hooks__hooks.locales               = locale_locales__listLocales;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeRounding = duration_humanize__getSetRelativeTimeRounding;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
    utils_hooks__hooks.calendarFormat        = getCalendarFormat;
    utils_hooks__hooks.prototype             = momentPrototype;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],12:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],14:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],15:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":13,"./encode":14}],16:[function(require,module,exports){
/* Riot v2.6.2, @license MIT */

;(function(window, undefined) {
  'use strict';
var riot = { version: 'v2.6.2', settings: {} },
  // be aware, internal usage
  // ATTENTION: prefix the global dynamic variables with `__`

  // counter to give a unique id to all the Tag instances
  __uid = 0,
  // tags instances cache
  __virtualDom = [],
  // tags implementation cache
  __tagImpl = {},

  /**
   * Const
   */
  GLOBAL_MIXIN = '__global_mixin',

  // riot specific prefixes
  RIOT_PREFIX = 'riot-',
  RIOT_TAG = RIOT_PREFIX + 'tag',
  RIOT_TAG_IS = 'data-is',

  // for typeof == '' comparisons
  T_STRING = 'string',
  T_OBJECT = 'object',
  T_UNDEF  = 'undefined',
  T_FUNCTION = 'function',
  XLINK_NS = 'http://www.w3.org/1999/xlink',
  XLINK_REGEX = /^xlink:(\w+)/,
  // special native tags that cannot be treated like the others
  SPECIAL_TAGS_REGEX = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/,
  RESERVED_WORDS_BLACKLIST = /^(?:_(?:item|id|parent)|update|root|(?:un)?mount|mixin|is(?:Mounted|Loop)|tags|parent|opts|trigger|o(?:n|ff|ne))$/,
  // SVG tags list https://www.w3.org/TR/SVG/attindex.html#PresentationAttributes
  SVG_TAGS_LIST = ['altGlyph', 'animate', 'animateColor', 'circle', 'clipPath', 'defs', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'filter', 'font', 'foreignObject', 'g', 'glyph', 'glyphRef', 'image', 'line', 'linearGradient', 'marker', 'mask', 'missing-glyph', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use'],

  // version# for IE 8-11, 0 for others
  IE_VERSION = (window && window.document || {}).documentMode | 0,

  // detect firefox to fix #1374
  FIREFOX = window && !!window.InstallTrigger
/* istanbul ignore next */
riot.observable = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {}

  /**
   * Private variables
   */
  var callbacks = {},
    slice = Array.prototype.slice

  /**
   * Private Methods
   */

  /**
   * Helper function needed to get and loop all the events in a string
   * @param   { String }   e - event string
   * @param   {Function}   fn - callback
   */
  function onEachEvent(e, fn) {
    var es = e.split(' '), l = es.length, i = 0
    for (; i < l; i++) {
      var name = es[i]
      if (name) fn(name, i)
    }
  }

  /**
   * Public Api
   */

  // extend the el object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given space separated list of `events` and
     * execute the `callback` each time an event is triggered.
     * @param  { String } events - events ids
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(events, fn) {
        if (typeof fn != 'function')  return el

        onEachEvent(events, function(name, pos) {
          (callbacks[name] = callbacks[name] || []).push(fn)
          fn.typed = pos > 0
        })

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Removes the given space separated list of `events` listeners
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    off: {
      value: function(events, fn) {
        if (events == '*' && !fn) callbacks = {}
        else {
          onEachEvent(events, function(name, pos) {
            if (fn) {
              var arr = callbacks[name]
              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
                if (cb == fn) arr.splice(i--, 1)
              }
            } else delete callbacks[name]
          })
        }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Listen to the given space separated list of `events` and
     * execute the `callback` at most once
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    one: {
      value: function(events, fn) {
        function on() {
          el.off(events, on)
          fn.apply(el, arguments)
        }
        return el.on(events, on)
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Execute all callback functions that listen to
     * the given space separated list of `events`
     * @param   { String } events - events ids
     * @returns { Object } el
     */
    trigger: {
      value: function(events) {

        // getting the arguments
        var arglen = arguments.length - 1,
          args = new Array(arglen),
          fns

        for (var i = 0; i < arglen; i++) {
          args[i] = arguments[i + 1] // skip first argument
        }

        onEachEvent(events, function(name, pos) {

          fns = slice.call(callbacks[name] || [], 0)

          for (var i = 0, fn; fn = fns[i]; ++i) {
            if (fn.busy) continue
            fn.busy = 1
            fn.apply(el, fn.typed ? [name].concat(args) : args)
            if (fns[i] !== fn) { i-- }
            fn.busy = 0
          }

          if (callbacks['*'] && name != '*')
            el.trigger.apply(el, ['*', name].concat(args))

        })

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    }
  })

  return el

}
/* istanbul ignore next */
;(function(riot) {

/**
 * Simple client-side router
 * @module riot-route
 */


var RE_ORIGIN = /^.+?\/\/+[^\/]+/,
  EVENT_LISTENER = 'EventListener',
  REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER,
  ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER,
  HAS_ATTRIBUTE = 'hasAttribute',
  REPLACE = 'replace',
  POPSTATE = 'popstate',
  HASHCHANGE = 'hashchange',
  TRIGGER = 'trigger',
  MAX_EMIT_STACK_LEVEL = 3,
  win = typeof window != 'undefined' && window,
  doc = typeof document != 'undefined' && document,
  hist = win && history,
  loc = win && (hist.location || win.location), // see html5-history-api
  prot = Router.prototype, // to minify more
  clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click',
  started = false,
  central = riot.observable(),
  routeFound = false,
  debouncedEmit,
  base, current, parser, secondParser, emitStack = [], emitStackLevel = 0

/**
 * Default parser. You can replace it via router.parser method.
 * @param {string} path - current path (normalized)
 * @returns {array} array
 */
function DEFAULT_PARSER(path) {
  return path.split(/[/?#]/)
}

/**
 * Default parser (second). You can replace it via router.parser method.
 * @param {string} path - current path (normalized)
 * @param {string} filter - filter string (normalized)
 * @returns {array} array
 */
function DEFAULT_SECOND_PARSER(path, filter) {
  var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'),
    args = path.match(re)

  if (args) return args.slice(1)
}

/**
 * Simple/cheap debounce implementation
 * @param   {function} fn - callback
 * @param   {number} delay - delay in seconds
 * @returns {function} debounced function
 */
function debounce(fn, delay) {
  var t
  return function () {
    clearTimeout(t)
    t = setTimeout(fn, delay)
  }
}

/**
 * Set the window listeners to trigger the routes
 * @param {boolean} autoExec - see route.start
 */
function start(autoExec) {
  debouncedEmit = debounce(emit, 1)
  win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit)
  win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
  doc[ADD_EVENT_LISTENER](clickEvent, click)
  if (autoExec) emit(true)
}

/**
 * Router class
 */
function Router() {
  this.$ = []
  riot.observable(this) // make it observable
  central.on('stop', this.s.bind(this))
  central.on('emit', this.e.bind(this))
}

function normalize(path) {
  return path[REPLACE](/^\/|\/$/, '')
}

function isString(str) {
  return typeof str == 'string'
}

/**
 * Get the part after domain name
 * @param {string} href - fullpath
 * @returns {string} path from root
 */
function getPathFromRoot(href) {
  return (href || loc.href)[REPLACE](RE_ORIGIN, '')
}

/**
 * Get the part after base
 * @param {string} href - fullpath
 * @returns {string} path from base
 */
function getPathFromBase(href) {
  return base[0] == '#'
    ? (href || loc.href || '').split(base)[1] || ''
    : (loc ? getPathFromRoot(href) : href || '')[REPLACE](base, '')
}

function emit(force) {
  // the stack is needed for redirections
  var isRoot = emitStackLevel == 0, first
  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return

  emitStackLevel++
  emitStack.push(function() {
    var path = getPathFromBase()
    if (force || path != current) {
      central[TRIGGER]('emit', path)
      current = path
    }
  })
  if (isRoot) {
    while (first = emitStack.shift()) first() // stack increses within this call
    emitStackLevel = 0
  }
}

function click(e) {
  if (
    e.which != 1 // not left click
    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
    || e.defaultPrevented // or default prevented
  ) return

  var el = e.target
  while (el && el.nodeName != 'A') el = el.parentNode

  if (
    !el || el.nodeName != 'A' // not A tag
    || el[HAS_ATTRIBUTE]('download') // has download attr
    || !el[HAS_ATTRIBUTE]('href') // has no href attr
    || el.target && el.target != '_self' // another window or frame
    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1 // cross origin
  ) return

  if (el.href != loc.href
    && (
      el.href.split('#')[0] == loc.href.split('#')[0] // internal jump
      || base[0] != '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
      || base[0] == '#' && el.href.split(base)[0] != loc.href.split(base)[0] // outside of #base
      || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
    )) return

  e.preventDefault()
}

/**
 * Go to the path
 * @param {string} path - destination path
 * @param {string} title - page title
 * @param {boolean} shouldReplace - use replaceState or pushState
 * @returns {boolean} - route not found flag
 */
function go(path, title, shouldReplace) {
  // Server-side usage: directly execute handlers for the path
  if (!hist) return central[TRIGGER]('emit', getPathFromBase(path))

  path = base + normalize(path)
  title = title || doc.title
  // browsers ignores the second parameter `title`
  shouldReplace
    ? hist.replaceState(null, title, path)
    : hist.pushState(null, title, path)
  // so we need to set it manually
  doc.title = title
  routeFound = false
  emit()
  return routeFound
}

/**
 * Go to path or set action
 * a single string:                go there
 * two strings:                    go there with setting a title
 * two strings and boolean:        replace history with setting a title
 * a single function:              set an action on the default route
 * a string/RegExp and a function: set an action on the route
 * @param {(string|function)} first - path / action / filter
 * @param {(string|RegExp|function)} second - title / action
 * @param {boolean} third - replace flag
 */
prot.m = function(first, second, third) {
  if (isString(first) && (!second || isString(second))) go(first, second, third || false)
  else if (second) this.r(first, second)
  else this.r('@', first)
}

/**
 * Stop routing
 */
prot.s = function() {
  this.off('*')
  this.$ = []
}

/**
 * Emit
 * @param {string} path - path
 */
prot.e = function(path) {
  this.$.concat('@').some(function(filter) {
    var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter))
    if (typeof args != 'undefined') {
      this[TRIGGER].apply(null, [filter].concat(args))
      return routeFound = true // exit from loop
    }
  }, this)
}

/**
 * Register route
 * @param {string} filter - filter for matching to url
 * @param {function} action - action to register
 */
prot.r = function(filter, action) {
  if (filter != '@') {
    filter = '/' + normalize(filter)
    this.$.push(filter)
  }
  this.on(filter, action)
}

var mainRouter = new Router()
var route = mainRouter.m.bind(mainRouter)

/**
 * Create a sub router
 * @returns {function} the method of a new Router object
 */
route.create = function() {
  var newSubRouter = new Router()
  // assign sub-router's main method
  var router = newSubRouter.m.bind(newSubRouter)
  // stop only this sub-router
  router.stop = newSubRouter.s.bind(newSubRouter)
  return router
}

/**
 * Set the base of url
 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
 */
route.base = function(arg) {
  base = arg || '#'
  current = getPathFromBase() // recalculate current path
}

/** Exec routing right now **/
route.exec = function() {
  emit(true)
}

/**
 * Replace the default router to yours
 * @param {function} fn - your parser function
 * @param {function} fn2 - your secondParser function
 */
route.parser = function(fn, fn2) {
  if (!fn && !fn2) {
    // reset parser for testing...
    parser = DEFAULT_PARSER
    secondParser = DEFAULT_SECOND_PARSER
  }
  if (fn) parser = fn
  if (fn2) secondParser = fn2
}

/**
 * Helper function to get url query as an object
 * @returns {object} parsed query
 */
route.query = function() {
  var q = {}
  var href = loc.href || current
  href[REPLACE](/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v })
  return q
}

/** Stop routing **/
route.stop = function () {
  if (started) {
    if (win) {
      win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit)
      win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
      doc[REMOVE_EVENT_LISTENER](clickEvent, click)
    }
    central[TRIGGER]('stop')
    started = false
  }
}

/**
 * Start routing
 * @param {boolean} autoExec - automatically exec after starting if true
 */
route.start = function (autoExec) {
  if (!started) {
    if (win) {
      if (document.readyState == 'complete') start(autoExec)
      // the timeout is needed to solve
      // a weird safari bug https://github.com/riot/route/issues/33
      else win[ADD_EVENT_LISTENER]('load', function() {
        setTimeout(function() { start(autoExec) }, 1)
      })
    }
    started = true
  }
}

/** Prepare the router **/
route.base()
route.parser()

riot.route = route
})(riot)
/* istanbul ignore next */

/**
 * The riot template engine
 * @version v2.4.1
 */
/**
 * riot.util.brackets
 *
 * - `brackets    ` - Returns a string or regex based on its parameter
 * - `brackets.set` - Change the current riot brackets
 *
 * @module
 */

var brackets = (function (UNDEF) {

  var
    REGLOB = 'g',

    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,

    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,

    S_QBLOCKS = R_STRINGS.source + '|' +
      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,

    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),

    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,

    FINDBRACES = {
      '(': RegExp('([()])|'   + S_QBLOCKS, REGLOB),
      '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
      '{': RegExp('([{}])|'   + S_QBLOCKS, REGLOB)
    },

    DEFAULT = '{ }'

  var _pairs = [
    '{', '}',
    '{', '}',
    /{[^}]*}/,
    /\\([{}])/g,
    /\\({)|{/g,
    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB),
    DEFAULT,
    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
    /(^|[^\\]){=[\S\s]*?}/
  ]

  var
    cachedBrackets = UNDEF,
    _regex,
    _cache = [],
    _settings

  function _loopback (re) { return re }

  function _rewrite (re, bp) {
    if (!bp) bp = _cache
    return new RegExp(
      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
    )
  }

  function _create (pair) {
    if (pair === DEFAULT) return _pairs

    var arr = pair.split(' ')

    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
      throw new Error('Unsupported brackets "' + pair + '"')
    }
    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '))

    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr)
    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr)
    arr[6] = _rewrite(_pairs[6], arr)
    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB)
    arr[8] = pair
    return arr
  }

  function _brackets (reOrIdx) {
    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
  }

  _brackets.split = function split (str, tmpl, _bp) {
    // istanbul ignore next: _bp is for the compiler
    if (!_bp) _bp = _cache

    var
      parts = [],
      match,
      isexpr,
      start,
      pos,
      re = _bp[6]

    isexpr = start = re.lastIndex = 0

    while ((match = re.exec(str))) {

      pos = match.index

      if (isexpr) {

        if (match[2]) {
          re.lastIndex = skipBraces(str, match[2], re.lastIndex)
          continue
        }
        if (!match[3]) {
          continue
        }
      }

      if (!match[1]) {
        unescapeStr(str.slice(start, pos))
        start = re.lastIndex
        re = _bp[6 + (isexpr ^= 1)]
        re.lastIndex = start
      }
    }

    if (str && start < str.length) {
      unescapeStr(str.slice(start))
    }

    return parts

    function unescapeStr (s) {
      if (tmpl || isexpr) {
        parts.push(s && s.replace(_bp[5], '$1'))
      } else {
        parts.push(s)
      }
    }

    function skipBraces (s, ch, ix) {
      var
        match,
        recch = FINDBRACES[ch]

      recch.lastIndex = ix
      ix = 1
      while ((match = recch.exec(s))) {
        if (match[1] &&
          !(match[1] === ch ? ++ix : --ix)) break
      }
      return ix ? s.length : recch.lastIndex
    }
  }

  _brackets.hasExpr = function hasExpr (str) {
    return _cache[4].test(str)
  }

  _brackets.loopKeys = function loopKeys (expr) {
    var m = expr.match(_cache[9])

    return m
      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
      : { val: expr.trim() }
  }

  _brackets.array = function array (pair) {
    return pair ? _create(pair) : _cache
  }

  function _reset (pair) {
    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
      _cache = _create(pair)
      _regex = pair === DEFAULT ? _loopback : _rewrite
      _cache[9] = _regex(_pairs[9])
    }
    cachedBrackets = pair
  }

  function _setSettings (o) {
    var b

    o = o || {}
    b = o.brackets
    Object.defineProperty(o, 'brackets', {
      set: _reset,
      get: function () { return cachedBrackets },
      enumerable: true
    })
    _settings = o
    _reset(b)
  }

  Object.defineProperty(_brackets, 'settings', {
    set: _setSettings,
    get: function () { return _settings }
  })

  /* istanbul ignore next: in the browser riot is always in the scope */
  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {}
  _brackets.set = _reset

  _brackets.R_STRINGS = R_STRINGS
  _brackets.R_MLCOMMS = R_MLCOMMS
  _brackets.S_QBLOCKS = S_QBLOCKS

  return _brackets

})()

/**
 * @module tmpl
 *
 * tmpl          - Root function, returns the template value, render with data
 * tmpl.hasExpr  - Test the existence of a expression inside a string
 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
 */

var tmpl = (function () {

  var _cache = {}

  function _tmpl (str, data) {
    if (!str) return str

    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
  }

  _tmpl.haveRaw = brackets.hasRaw

  _tmpl.hasExpr = brackets.hasExpr

  _tmpl.loopKeys = brackets.loopKeys

  // istanbul ignore next
  _tmpl.clearCache = function () { _cache = {} }

  _tmpl.errorHandler = null

  function _logErr (err, ctx) {

    if (_tmpl.errorHandler) {

      err.riotData = {
        tagName: ctx && ctx.root && ctx.root.tagName,
        _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
      }
      _tmpl.errorHandler(err)
    }
  }

  function _create (str) {
    var expr = _getTmpl(str)

    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr

    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
  }

  var
    CH_IDEXPR = '\u2057',
    RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,
    RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
    RE_DQUOTE = /\u2057/g,
    RE_QBMARK = /\u2057(\d+)~/g

  function _getTmpl (str) {
    var
      qstr = [],
      expr,
      parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1)

    if (parts.length > 2 || parts[0]) {
      var i, j, list = []

      for (i = j = 0; i < parts.length; ++i) {

        expr = parts[i]

        if (expr && (expr = i & 1

            ? _parseExpr(expr, 1, qstr)

            : '"' + expr
                .replace(/\\/g, '\\\\')
                .replace(/\r\n?|\n/g, '\\n')
                .replace(/"/g, '\\"') +
              '"'

          )) list[j++] = expr

      }

      expr = j < 2 ? list[0]
           : '[' + list.join(',') + '].join("")'

    } else {

      expr = _parseExpr(parts[1], 0, qstr)
    }

    if (qstr[0]) {
      expr = expr.replace(RE_QBMARK, function (_, pos) {
        return qstr[pos]
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
      })
    }
    return expr
  }

  var
    RE_BREND = {
      '(': /[()]/g,
      '[': /[[\]]/g,
      '{': /[{}]/g
    }

  function _parseExpr (expr, asText, qstr) {

    expr = expr
          .replace(RE_QBLOCK, function (s, div) {
            return s.length > 2 && !div ? CH_IDEXPR + (qstr.push(s) - 1) + '~' : s
          })
          .replace(/\s+/g, ' ').trim()
          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1')

    if (expr) {
      var
        list = [],
        cnt = 0,
        match

      while (expr &&
            (match = expr.match(RE_CSNAME)) &&
            !match.index
        ) {
        var
          key,
          jsb,
          re = /,|([[{(])|$/g

        expr = RegExp.rightContext
        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1]

        while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re)

        jsb  = expr.slice(0, match.index)
        expr = RegExp.rightContext

        list[cnt++] = _wrapExpr(jsb, 1, key)
      }

      expr = !cnt ? _wrapExpr(expr, asText)
           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0]
    }
    return expr

    function skipBraces (ch, re) {
      var
        mm,
        lv = 1,
        ir = RE_BREND[ch]

      ir.lastIndex = re.lastIndex
      while (mm = ir.exec(expr)) {
        if (mm[0] === ch) ++lv
        else if (!--lv) break
      }
      re.lastIndex = lv ? expr.length : ir.lastIndex
    }
  }

  // istanbul ignore next: not both
  var // eslint-disable-next-line max-len
    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
    JS_VARNAME = /[,{][$\w]+(?=:)|(^ *|[^$\w\.])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/

  function _wrapExpr (expr, asText, key) {
    var tb

    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
      if (mvar) {
        pos = tb ? 0 : pos + match.length

        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
          match = p + '("' + mvar + JS_CONTEXT + mvar
          if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '['
        } else if (pos) {
          tb = !JS_NOPROPS.test(s.slice(pos))
        }
      }
      return match
    })

    if (tb) {
      expr = 'try{return ' + expr + '}catch(e){E(e,this)}'
    }

    if (key) {

      expr = (tb
          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
        ) + '?"' + key + '":""'

    } else if (asText) {

      expr = 'function(v){' + (tb
          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
        ) + ';return v||v===0?v:""}.call(this)'
    }

    return expr
  }

  _tmpl.version = brackets.version = 'v2.4.1'

  return _tmpl

})()

/*
  lib/browser/tag/mkdom.js

  Includes hacks needed for the Internet Explorer version 9 and below
  See: http://kangax.github.io/compat-table/es5/#ie8
       http://codeplanet.io/dropping-ie8/
*/
var mkdom = (function _mkdom() {
  var
    reHasYield  = /<yield\b/i,
    reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig,
    reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig,
    reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig
  var
    rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' },
    tblTags = IE_VERSION && IE_VERSION < 10
      ? SPECIAL_TAGS_REGEX : /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/

  /**
   * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
   * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
   *
   * @param   {string} templ  - The template coming from the custom tag definition
   * @param   {string} [html] - HTML content that comes from the DOM element where you
   *           will mount the tag, mostly the original tag in the page
   * @returns {HTMLElement} DOM element with _templ_ merged through `YIELD` with the _html_.
   */
  function _mkdom(templ, html) {
    var
      match   = templ && templ.match(/^\s*<([-\w]+)/),
      tagName = match && match[1].toLowerCase(),
      el = mkEl('div', isSVGTag(tagName))

    // replace all the yield tags with the tag inner html
    templ = replaceYield(templ, html)

    /* istanbul ignore next */
    if (tblTags.test(tagName))
      el = specialTags(el, templ, tagName)
    else
      setInnerHTML(el, templ)

    el.stub = true

    return el
  }

  /*
    Creates the root element for table or select child elements:
    tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
  */
  function specialTags(el, templ, tagName) {
    var
      select = tagName[0] === 'o',
      parent = select ? 'select>' : 'table>'

    // trim() is important here, this ensures we don't have artifacts,
    // so we can check if we have only one element inside the parent
    el.innerHTML = '<' + parent + templ.trim() + '</' + parent
    parent = el.firstChild

    // returns the immediate parent if tr/th/td/col is the only element, if not
    // returns the whole tree, as this can include additional elements
    if (select) {
      parent.selectedIndex = -1  // for IE9, compatible w/current riot behavior
    } else {
      // avoids insertion of cointainer inside container (ex: tbody inside tbody)
      var tname = rootEls[tagName]
      if (tname && parent.childElementCount === 1) parent = $(tname, parent)
    }
    return parent
  }

  /*
    Replace the yield tag from any tag template with the innerHTML of the
    original tag in the page
  */
  function replaceYield(templ, html) {
    // do nothing if no yield
    if (!reHasYield.test(templ)) return templ

    // be careful with #1343 - string on the source having `$1`
    var src = {}

    html = html && html.replace(reYieldSrc, function (_, ref, text) {
      src[ref] = src[ref] || text   // preserve first definition
      return ''
    }).trim()

    return templ
      .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
        return src[ref] || def || ''
      })
      .replace(reYieldAll, function (_, def) {        // yield without any "from"
        return html || def || ''
      })
  }

  return _mkdom

})()

/**
 * Convert the item looped into an object used to extend the child tag properties
 * @param   { Object } expr - object containing the keys used to extend the children tags
 * @param   { * } key - value to assign to the new object returned
 * @param   { * } val - value containing the position of the item in the array
 * @returns { Object } - new object containing the values of the original item
 *
 * The variables 'key' and 'val' are arbitrary.
 * They depend on the collection type looped (Array, Object)
 * and on the expression used on the each tag
 *
 */
function mkitem(expr, key, val) {
  var item = {}
  item[expr.key] = key
  if (expr.pos) item[expr.pos] = val
  return item
}

/**
 * Unmount the redundant tags
 * @param   { Array } items - array containing the current items to loop
 * @param   { Array } tags - array containing all the children tags
 */
function unmountRedundant(items, tags) {

  var i = tags.length,
    j = items.length,
    t

  while (i > j) {
    t = tags[--i]
    tags.splice(i, 1)
    t.unmount()
  }
}

/**
 * Move the nested custom tags in non custom loop tags
 * @param   { Object } child - non custom loop tag
 * @param   { Number } i - current position of the loop tag
 */
function moveNestedTags(child, i) {
  Object.keys(child.tags).forEach(function(tagName) {
    var tag = child.tags[tagName]
    if (isArray(tag))
      each(tag, function (t) {
        moveChildTag(t, tagName, i)
      })
    else
      moveChildTag(tag, tagName, i)
  })
}

/**
 * Adds the elements for a virtual tag
 * @param { Tag } tag - the tag whose root's children will be inserted or appended
 * @param { Node } src - the node that will do the inserting or appending
 * @param { Tag } target - only if inserting, insert before this tag's first child
 */
function addVirtual(tag, src, target) {
  var el = tag._root, sib
  tag._virts = []
  while (el) {
    sib = el.nextSibling
    if (target)
      src.insertBefore(el, target._root)
    else
      src.appendChild(el)

    tag._virts.push(el) // hold for unmounting
    el = sib
  }
}

/**
 * Move virtual tag and all child nodes
 * @param { Tag } tag - first child reference used to start move
 * @param { Node } src  - the node that will do the inserting
 * @param { Tag } target - insert before this tag's first child
 * @param { Number } len - how many child nodes to move
 */
function moveVirtual(tag, src, target, len) {
  var el = tag._root, sib, i = 0
  for (; i < len; i++) {
    sib = el.nextSibling
    src.insertBefore(el, target._root)
    el = sib
  }
}


/**
 * Manage tags having the 'each'
 * @param   { Object } dom - DOM node we need to loop
 * @param   { Tag } parent - parent tag instance where the dom node is contained
 * @param   { String } expr - string contained in the 'each' attribute
 */
function _each(dom, parent, expr) {

  // remove the each property from the original tag
  remAttr(dom, 'each')

  var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'),
    tagName = getTagName(dom),
    impl = __tagImpl[tagName] || { tmpl: getOuterHTML(dom) },
    useRoot = SPECIAL_TAGS_REGEX.test(tagName),
    root = dom.parentNode,
    ref = document.createTextNode(''),
    child = getTag(dom),
    isOption = tagName.toLowerCase() === 'option', // the option tags must be treated differently
    tags = [],
    oldItems = [],
    hasKeys,
    isVirtual = dom.tagName == 'VIRTUAL'

  // parse the each expression
  expr = tmpl.loopKeys(expr)

  // insert a marked where the loop tags will be injected
  root.insertBefore(ref, dom)

  // clean template code
  parent.one('before-mount', function () {

    // remove the original DOM node
    dom.parentNode.removeChild(dom)
    if (root.stub) root = parent.root

  }).on('update', function () {
    // get the new items collection
    var items = tmpl(expr.val, parent),
      // create a fragment to hold the new DOM nodes to inject in the parent tag
      frag = document.createDocumentFragment()

    // object loop. any changes cause full redraw
    if (!isArray(items)) {
      hasKeys = items || false
      items = hasKeys ?
        Object.keys(items).map(function (key) {
          return mkitem(expr, key, items[key])
        }) : []
    }

    // loop all the new items
    var i = 0,
      itemsLength = items.length

    for (; i < itemsLength; i++) {
      // reorder only if the items are objects
      var
        item = items[i],
        _mustReorder = mustReorder && typeof item == T_OBJECT && !hasKeys,
        oldPos = oldItems.indexOf(item),
        pos = ~oldPos && _mustReorder ? oldPos : i,
        // does a tag exist in this position?
        tag = tags[pos]

      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item

      // new tag
      if (
        !_mustReorder && !tag // with no-reorder we just update the old tags
        ||
        _mustReorder && !~oldPos || !tag // by default we always try to reorder the DOM elements
      ) {

        tag = new Tag(impl, {
          parent: parent,
          isLoop: true,
          hasImpl: !!__tagImpl[tagName],
          root: useRoot ? root : dom.cloneNode(),
          item: item
        }, dom.innerHTML)

        tag.mount()

        if (isVirtual) tag._root = tag.root.firstChild // save reference for further moves or inserts
        // this tag must be appended
        if (i == tags.length || !tags[i]) { // fix 1581
          if (isVirtual)
            addVirtual(tag, frag)
          else frag.appendChild(tag.root)
        }
        // this tag must be insert
        else {
          if (isVirtual)
            addVirtual(tag, root, tags[i])
          else root.insertBefore(tag.root, tags[i].root) // #1374 some browsers reset selected here
          oldItems.splice(i, 0, item)
        }

        tags.splice(i, 0, tag)
        pos = i // handled here so no move
      } else tag.update(item, true)

      // reorder the tag if it's not located in its previous position
      if (
        pos !== i && _mustReorder &&
        tags[i] // fix 1581 unable to reproduce it in a test!
      ) {
        // update the DOM
        if (isVirtual)
          moveVirtual(tag, root, tags[i], dom.childNodes.length)
        else if (tags[i].root.parentNode) root.insertBefore(tag.root, tags[i].root)
        // update the position attribute if it exists
        if (expr.pos)
          tag[expr.pos] = i
        // move the old tag instance
        tags.splice(i, 0, tags.splice(pos, 1)[0])
        // move the old item
        oldItems.splice(i, 0, oldItems.splice(pos, 1)[0])
        // if the loop tags are not custom
        // we need to move all their custom tags into the right position
        if (!child && tag.tags) moveNestedTags(tag, i)
      }

      // cache the original item to use it in the events bound to this node
      // and its children
      tag._item = item
      // cache the real parent tag internally
      defineProperty(tag, '_parent', parent)
    }

    // remove the redundant tags
    unmountRedundant(items, tags)

    // insert the new nodes
    root.insertBefore(frag, ref)
    if (isOption) {

      // #1374 FireFox bug in <option selected={expression}>
      if (FIREFOX && !root.multiple) {
        for (var n = 0; n < root.length; n++) {
          if (root[n].__riot1374) {
            root.selectedIndex = n  // clear other options
            delete root[n].__riot1374
            break
          }
        }
      }
    }

    // set the 'tags' property of the parent tag
    // if child is 'undefined' it means that we don't need to set this property
    // for example:
    // we don't need store the `myTag.tags['div']` property if we are looping a div tag
    // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
    if (child) parent.tags[tagName] = tags

    // clone the items array
    oldItems = items.slice()

  })

}
/**
 * Object that will be used to inject and manage the css of every tag instance
 */
var styleManager = (function(_riot) {

  if (!window) return { // skip injection on the server
    add: function () {},
    inject: function () {}
  }

  var styleNode = (function () {
    // create a new style element with the correct type
    var newNode = mkEl('style')
    setAttr(newNode, 'type', 'text/css')

    // replace any user node or insert the new one into the head
    var userNode = $('style[type=riot]')
    if (userNode) {
      if (userNode.id) newNode.id = userNode.id
      userNode.parentNode.replaceChild(newNode, userNode)
    }
    else document.getElementsByTagName('head')[0].appendChild(newNode)

    return newNode
  })()

  // Create cache and shortcut to the correct property
  var cssTextProp = styleNode.styleSheet,
    stylesToInject = ''

  // Expose the style node in a non-modificable property
  Object.defineProperty(_riot, 'styleNode', {
    value: styleNode,
    writable: true
  })

  /**
   * Public api
   */
  return {
    /**
     * Save a tag style to be later injected into DOM
     * @param   { String } css [description]
     */
    add: function(css) {
      stylesToInject += css
    },
    /**
     * Inject all previously saved tag styles into DOM
     * innerHTML seems slow: http://jsperf.com/riot-insert-style
     */
    inject: function() {
      if (stylesToInject) {
        if (cssTextProp) cssTextProp.cssText += stylesToInject
        else styleNode.innerHTML += stylesToInject
        stylesToInject = ''
      }
    }
  }

})(riot)


function parseNamedElements(root, tag, childTags, forceParsingNamed) {

  walk(root, function(dom) {
    if (dom.nodeType == 1) {
      dom.isLoop = dom.isLoop ||
                  (dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each'))
                    ? 1 : 0

      // custom child tag
      if (childTags) {
        var child = getTag(dom)

        if (child && !dom.isLoop)
          childTags.push(initChildTag(child, {root: dom, parent: tag}, dom.innerHTML, tag))
      }

      if (!dom.isLoop || forceParsingNamed)
        setNamed(dom, tag, [])
    }

  })

}

function parseExpressions(root, tag, expressions) {

  function addExpr(dom, val, extra) {
    if (tmpl.hasExpr(val)) {
      expressions.push(extend({ dom: dom, expr: val }, extra))
    }
  }

  walk(root, function(dom) {
    var type = dom.nodeType,
      attr

    // text node
    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
    if (type != 1) return

    /* element */

    // loop
    attr = getAttr(dom, 'each')

    if (attr) { _each(dom, tag, attr); return false }

    // attribute expressions
    each(dom.attributes, function(attr) {
      var name = attr.name,
        bool = name.split('__')[1]

      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
      if (bool) { remAttr(dom, name); return false }

    })

    // skip custom tags
    if (getTag(dom)) return false

  })

}
function Tag(impl, conf, innerHTML) {

  var self = riot.observable(this),
    opts = inherit(conf.opts) || {},
    parent = conf.parent,
    isLoop = conf.isLoop,
    hasImpl = conf.hasImpl,
    item = cleanUpData(conf.item),
    expressions = [],
    childTags = [],
    root = conf.root,
    tagName = root.tagName.toLowerCase(),
    attr = {},
    propsInSyncWithParent = [],
    dom

  // only call unmount if we have a valid __tagImpl (has name property)
  if (impl.name && root._tag) root._tag.unmount(true)

  // not yet mounted
  this.isMounted = false
  root.isLoop = isLoop

  // keep a reference to the tag just created
  // so we will be able to mount this tag multiple times
  root._tag = this

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  defineProperty(this, '_riot_id', ++__uid) // base 1 allows test !t._riot_id

  extend(this, { parent: parent, root: root, opts: opts}, item)
  // protect the "tags" property from being overridden
  defineProperty(this, 'tags', {})

  // grab attributes
  each(root.attributes, function(el) {
    var val = el.value
    // remember attributes with expressions only
    if (tmpl.hasExpr(val)) attr[el.name] = val
  })

  dom = mkdom(impl.tmpl, innerHTML)

  // options
  function updateOpts() {
    var ctx = hasImpl && isLoop ? self : parent || self

    // update opts from current DOM attributes
    each(root.attributes, function(el) {
      var val = el.value
      opts[toCamel(el.name)] = tmpl.hasExpr(val) ? tmpl(val, ctx) : val
    })
    // recover those with expressions
    each(Object.keys(attr), function(name) {
      opts[toCamel(name)] = tmpl(attr[name], ctx)
    })
  }

  function normalizeData(data) {
    for (var key in item) {
      if (typeof self[key] !== T_UNDEF && isWritable(self, key))
        self[key] = data[key]
    }
  }

  function inheritFrom(target) {
    each(Object.keys(target), function(k) {
      // some properties must be always in sync with the parent tag
      var mustSync = !RESERVED_WORDS_BLACKLIST.test(k) && contains(propsInSyncWithParent, k)

      if (typeof self[k] === T_UNDEF || mustSync) {
        // track the property to keep in sync
        // so we can keep it updated
        if (!mustSync) propsInSyncWithParent.push(k)
        self[k] = target[k]
      }
    })
  }

  /**
   * Update the tag expressions and options
   * @param   { * }  data - data we want to use to extend the tag properties
   * @param   { Boolean } isInherited - is this update coming from a parent tag?
   * @returns { self }
   */
  defineProperty(this, 'update', function(data, isInherited) {

    // make sure the data passed will not override
    // the component core methods
    data = cleanUpData(data)
    // inherit properties from the parent in loop
    if (isLoop) {
      inheritFrom(self.parent)
    }
    // normalize the tag properties in case an item object was initially passed
    if (data && isObject(item)) {
      normalizeData(data)
      item = data
    }
    extend(self, data)
    updateOpts()
    self.trigger('update', data)
    update(expressions, self)

    // the updated event will be triggered
    // once the DOM will be ready and all the re-flows are completed
    // this is useful if you want to get the "real" root properties
    // 4 ex: root.offsetWidth ...
    if (isInherited && self.parent)
      // closes #1599
      self.parent.one('updated', function() { self.trigger('updated') })
    else rAF(function() { self.trigger('updated') })

    return this
  })

  defineProperty(this, 'mixin', function() {
    each(arguments, function(mix) {
      var instance,
        props = [],
        obj

      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix

      // check if the mixin is a function
      if (isFunction(mix)) {
        // create the new mixin instance
        instance = new mix()
      } else instance = mix

      var proto = Object.getPrototypeOf(instance)

      // build multilevel prototype inheritance chain property list
      do props = props.concat(Object.getOwnPropertyNames(obj || instance))
      while (obj = Object.getPrototypeOf(obj || instance))

      // loop the keys in the function prototype or the all object keys
      each(props, function(key) {
        // bind methods to self
        // allow mixins to override other properties/parent mixins
        if (key != 'init') {
          // check for getters/setters
          var descriptor = Object.getOwnPropertyDescriptor(instance, key) || Object.getOwnPropertyDescriptor(proto, key)
          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set)

          // apply method only if it does not already exist on the instance
          if (!self.hasOwnProperty(key) && hasGetterSetter) {
            Object.defineProperty(self, key, descriptor)
          } else {
            self[key] = isFunction(instance[key]) ?
              instance[key].bind(self) :
              instance[key]
          }
        }
      })

      // init method will be called automatically
      if (instance.init) instance.init.bind(self)()
    })
    return this
  })

  defineProperty(this, 'mount', function() {

    updateOpts()

    // add global mixins
    var globalMixin = riot.mixin(GLOBAL_MIXIN)

    if (globalMixin)
      for (var i in globalMixin)
        if (globalMixin.hasOwnProperty(i))
          self.mixin(globalMixin[i])

    // children in loop should inherit from true parent
    if (self._parent && self._parent.root.isLoop) {
      inheritFrom(self._parent)
    }

    // initialiation
    if (impl.fn) impl.fn.call(self, opts)

    // parse layout after init. fn may calculate args for nested custom tags
    parseExpressions(dom, self, expressions)

    // mount the child tags
    toggle(true)

    // update the root adding custom attributes coming from the compiler
    // it fixes also #1087
    if (impl.attrs)
      walkAttributes(impl.attrs, function (k, v) { setAttr(root, k, v) })
    if (impl.attrs || hasImpl)
      parseExpressions(self.root, self, expressions)

    if (!self.parent || isLoop) self.update(item)

    // internal use only, fixes #403
    self.trigger('before-mount')

    if (isLoop && !hasImpl) {
      // update the root attribute for the looped elements
      root = dom.firstChild
    } else {
      while (dom.firstChild) root.appendChild(dom.firstChild)
      if (root.stub) root = parent.root
    }

    defineProperty(self, 'root', root)

    // parse the named dom nodes in the looped child
    // adding them to the parent as well
    if (isLoop)
      parseNamedElements(self.root, self.parent, null, true)

    // if it's not a child tag we can trigger its mount event
    if (!self.parent || self.parent.isMounted) {
      self.isMounted = true
      self.trigger('mount')
    }
    // otherwise we need to wait that the parent event gets triggered
    else self.parent.one('mount', function() {
      // avoid to trigger the `mount` event for the tags
      // not visible included in an if statement
      if (!isInStub(self.root)) {
        self.parent.isMounted = self.isMounted = true
        self.trigger('mount')
      }
    })
  })


  defineProperty(this, 'unmount', function(keepRootTag) {
    var el = root,
      p = el.parentNode,
      ptag,
      tagIndex = __virtualDom.indexOf(self)

    self.trigger('before-unmount')

    // remove this tag instance from the global virtualDom variable
    if (~tagIndex)
      __virtualDom.splice(tagIndex, 1)

    if (p) {

      if (parent) {
        ptag = getImmediateCustomParentTag(parent)
        // remove this tag from the parent tags object
        // if there are multiple nested tags with same name..
        // remove this element form the array
        if (isArray(ptag.tags[tagName]))
          each(ptag.tags[tagName], function(tag, i) {
            if (tag._riot_id == self._riot_id)
              ptag.tags[tagName].splice(i, 1)
          })
        else
          // otherwise just delete the tag instance
          ptag.tags[tagName] = undefined
      }

      else
        while (el.firstChild) el.removeChild(el.firstChild)

      if (!keepRootTag)
        p.removeChild(el)
      else {
        // the riot-tag and the data-is attributes aren't needed anymore, remove them
        remAttr(p, RIOT_TAG_IS)
        remAttr(p, RIOT_TAG) // this will be removed in riot 3.0.0
      }

    }

    if (this._virts) {
      each(this._virts, function(v) {
        if (v.parentNode) v.parentNode.removeChild(v)
      })
    }

    self.trigger('unmount')
    toggle()
    self.off('*')
    self.isMounted = false
    delete root._tag

  })

  // proxy function to bind updates
  // dispatched from a parent tag
  function onChildUpdate(data) { self.update(data, true) }

  function toggle(isMount) {

    // mount/unmount children
    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })

    // listen/unlisten parent (events flow one way from parent to children)
    if (!parent) return
    var evt = isMount ? 'on' : 'off'

    // the loop tags will be always in sync with the parent automatically
    if (isLoop)
      parent[evt]('unmount', self.unmount)
    else {
      parent[evt]('update', onChildUpdate)[evt]('unmount', self.unmount)
    }
  }


  // named elements available for fn
  parseNamedElements(dom, this, childTags)

}
/**
 * Attach an event to a DOM node
 * @param { String } name - event name
 * @param { Function } handler - event callback
 * @param { Object } dom - dom node
 * @param { Tag } tag - tag instance
 */
function setEventHandler(name, handler, dom, tag) {

  dom[name] = function(e) {

    var ptag = tag._parent,
      item = tag._item,
      el

    if (!item)
      while (ptag && !item) {
        item = ptag._item
        ptag = ptag._parent
      }

    // cross browser event fix
    e = e || window.event

    // override the event properties
    if (isWritable(e, 'currentTarget')) e.currentTarget = dom
    if (isWritable(e, 'target')) e.target = e.srcElement
    if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode

    e.item = item

    // prevent default behaviour (by default)
    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
      if (e.preventDefault) e.preventDefault()
      e.returnValue = false
    }

    if (!e.preventUpdate) {
      el = item ? getImmediateCustomParentTag(ptag) : tag
      el.update()
    }

  }

}


/**
 * Insert a DOM node replacing another one (used by if- attribute)
 * @param   { Object } root - parent node
 * @param   { Object } node - node replaced
 * @param   { Object } before - node added
 */
function insertTo(root, node, before) {
  if (!root) return
  root.insertBefore(before, node)
  root.removeChild(node)
}

/**
 * Update the expressions in a Tag instance
 * @param   { Array } expressions - expression that must be re evaluated
 * @param   { Tag } tag - tag instance
 */
function update(expressions, tag) {

  each(expressions, function(expr, i) {

    var dom = expr.dom,
      attrName = expr.attr,
      value = tmpl(expr.expr, tag),
      parent = expr.parent || expr.dom.parentNode

    if (expr.bool) {
      value = !!value
    } else if (value == null) {
      value = ''
    }

    // #1638: regression of #1612, update the dom only if the value of the
    // expression was changed
    if (expr.value === value) {
      return
    }
    expr.value = value

    // textarea and text nodes has no attribute name
    if (!attrName) {
      // about #815 w/o replace: the browser converts the value to a string,
      // the comparison by "==" does too, but not in the server
      value += ''
      // test for parent avoids error with invalid assignment to nodeValue
      if (parent) {
        // cache the parent node because somehow it will become null on IE
        // on the next iteration
        expr.parent = parent
        if (parent.tagName === 'TEXTAREA') {
          parent.value = value                    // #1113
          if (!IE_VERSION) dom.nodeValue = value  // #1625 IE throws here, nodeValue
        }                                         // will be available on 'updated'
        else dom.nodeValue = value
      }
      return
    }

    // ~~#1612: look for changes in dom.value when updating the value~~
    if (attrName === 'value') {
      if (dom.value !== value) {
        dom.value = value
        setAttr(dom, attrName, value)
      }
      return
    } else {
      // remove original attribute
      remAttr(dom, attrName)
    }

    // event handler
    if (isFunction(value)) {
      setEventHandler(attrName, value, dom, tag)

    // if- conditional
    } else if (attrName == 'if') {
      var stub = expr.stub,
        add = function() { insertTo(stub.parentNode, stub, dom) },
        remove = function() { insertTo(dom.parentNode, dom, stub) }

      // add to DOM
      if (value) {
        if (stub) {
          add()
          dom.inStub = false
          // avoid to trigger the mount event if the tags is not visible yet
          // maybe we can optimize this avoiding to mount the tag at all
          if (!isInStub(dom)) {
            walk(dom, function(el) {
              if (el._tag && !el._tag.isMounted)
                el._tag.isMounted = !!el._tag.trigger('mount')
            })
          }
        }
      // remove from DOM
      } else {
        stub = expr.stub = stub || document.createTextNode('')
        // if the parentNode is defined we can easily replace the tag
        if (dom.parentNode)
          remove()
        // otherwise we need to wait the updated event
        else (tag.parent || tag).one('updated', remove)

        dom.inStub = true
      }
    // show / hide
    } else if (attrName === 'show') {
      dom.style.display = value ? '' : 'none'

    } else if (attrName === 'hide') {
      dom.style.display = value ? 'none' : ''

    } else if (expr.bool) {
      dom[attrName] = value
      if (value) setAttr(dom, attrName, attrName)
      if (FIREFOX && attrName === 'selected' && dom.tagName === 'OPTION') {
        dom.__riot1374 = value   // #1374
      }

    } else if (value === 0 || value && typeof value !== T_OBJECT) {
      // <img src="{ expr }">
      if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
        attrName = attrName.slice(RIOT_PREFIX.length)
      }
      setAttr(dom, attrName, value)
    }

  })

}
/**
 * Specialized function for looping an array-like collection with `each={}`
 * @param   { Array } els - collection of items
 * @param   {Function} fn - callback function
 * @returns { Array } the array looped
 */
function each(els, fn) {
  var len = els ? els.length : 0

  for (var i = 0, el; i < len; i++) {
    el = els[i]
    // return false -> current item was removed by fn during the loop
    if (el != null && fn(el, i) === false) i--
  }
  return els
}

/**
 * Detect if the argument passed is a function
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
function isFunction(v) {
  return typeof v === T_FUNCTION || false   // avoid IE problems
}

/**
 * Get the outer html of any DOM node SVGs included
 * @param   { Object } el - DOM node to parse
 * @returns { String } el.outerHTML
 */
function getOuterHTML(el) {
  if (el.outerHTML) return el.outerHTML
  // some browsers do not support outerHTML on the SVGs tags
  else {
    var container = mkEl('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

/**
 * Set the inner html of any DOM node SVGs included
 * @param { Object } container - DOM node where we will inject the new html
 * @param { String } html - html to inject
 */
function setInnerHTML(container, html) {
  if (typeof container.innerHTML != T_UNDEF) container.innerHTML = html
  // some browsers do not support innerHTML on the SVGs tags
  else {
    var doc = new DOMParser().parseFromString(html, 'application/xml')
    container.appendChild(
      container.ownerDocument.importNode(doc.documentElement, true)
    )
  }
}

/**
 * Checks wether a DOM node must be considered part of an svg document
 * @param   { String }  name - tag name
 * @returns { Boolean } -
 */
function isSVGTag(name) {
  return ~SVG_TAGS_LIST.indexOf(name)
}

/**
 * Detect if the argument passed is an object, exclude null.
 * NOTE: Use isObject(x) && !isArray(x) to excludes arrays.
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
function isObject(v) {
  return v && typeof v === T_OBJECT         // typeof null is 'object'
}

/**
 * Remove any DOM attribute from a node
 * @param   { Object } dom - DOM node we want to update
 * @param   { String } name - name of the property we want to remove
 */
function remAttr(dom, name) {
  dom.removeAttribute(name)
}

/**
 * Convert a string containing dashes to camel case
 * @param   { String } string - input string
 * @returns { String } my-string -> myString
 */
function toCamel(string) {
  return string.replace(/-(\w)/g, function(_, c) {
    return c.toUpperCase()
  })
}

/**
 * Get the value of any DOM attribute on a node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { String } name - name of the attribute we want to get
 * @returns { String | undefined } name of the node attribute whether it exists
 */
function getAttr(dom, name) {
  return dom.getAttribute(name)
}

/**
 * Set any DOM/SVG attribute
 * @param { Object } dom - DOM node we want to update
 * @param { String } name - name of the property we want to set
 * @param { String } val - value of the property we want to set
 */
function setAttr(dom, name, val) {
  var xlink = XLINK_REGEX.exec(name)
  if (xlink && xlink[1])
    dom.setAttributeNS(XLINK_NS, xlink[1], val)
  else
    dom.setAttribute(name, val)
}

/**
 * Detect the tag implementation by a DOM node
 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
 */
function getTag(dom) {
  return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG_IS) ||
    getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()]
}
/**
 * Add a child tag to its parent into the `tags` object
 * @param   { Object } tag - child tag instance
 * @param   { String } tagName - key where the new tag will be stored
 * @param   { Object } parent - tag instance where the new child tag will be included
 */
function addChildTag(tag, tagName, parent) {
  var cachedTag = parent.tags[tagName]

  // if there are multiple children tags having the same name
  if (cachedTag) {
    // if the parent tags property is not yet an array
    // create it adding the first cached tag
    if (!isArray(cachedTag))
      // don't add the same tag twice
      if (cachedTag !== tag)
        parent.tags[tagName] = [cachedTag]
    // add the new nested tag to the array
    if (!contains(parent.tags[tagName], tag))
      parent.tags[tagName].push(tag)
  } else {
    parent.tags[tagName] = tag
  }
}

/**
 * Move the position of a custom tag in its parent tag
 * @param   { Object } tag - child tag instance
 * @param   { String } tagName - key where the tag was stored
 * @param   { Number } newPos - index where the new tag will be stored
 */
function moveChildTag(tag, tagName, newPos) {
  var parent = tag.parent,
    tags
  // no parent no move
  if (!parent) return

  tags = parent.tags[tagName]

  if (isArray(tags))
    tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0])
  else addChildTag(tag, tagName, parent)
}

/**
 * Create a new child tag including it correctly into its parent
 * @param   { Object } child - child tag implementation
 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
 * @param   { String } innerHTML - inner html of the child node
 * @param   { Object } parent - instance of the parent tag including the child custom tag
 * @returns { Object } instance of the new child tag just created
 */
function initChildTag(child, opts, innerHTML, parent) {
  var tag = new Tag(child, opts, innerHTML),
    tagName = getTagName(opts.root),
    ptag = getImmediateCustomParentTag(parent)
  // fix for the parent attribute in the looped elements
  tag.parent = ptag
  // store the real parent tag
  // in some cases this could be different from the custom parent tag
  // for example in nested loops
  tag._parent = parent

  // add this tag to the custom parent tag
  addChildTag(tag, tagName, ptag)
  // and also to the real parent tag
  if (ptag !== parent)
    addChildTag(tag, tagName, parent)
  // empty the child node once we got its template
  // to avoid that its children get compiled multiple times
  opts.root.innerHTML = ''

  return tag
}

/**
 * Loop backward all the parents tree to detect the first custom parent tag
 * @param   { Object } tag - a Tag instance
 * @returns { Object } the instance of the first custom parent tag found
 */
function getImmediateCustomParentTag(tag) {
  var ptag = tag
  while (!getTag(ptag.root)) {
    if (!ptag.parent) break
    ptag = ptag.parent
  }
  return ptag
}

/**
 * Helper function to set an immutable property
 * @param   { Object } el - object where the new property will be set
 * @param   { String } key - object key where the new property will be stored
 * @param   { * } value - value of the new property
* @param   { Object } options - set the propery overriding the default options
 * @returns { Object } - the initial object
 */
function defineProperty(el, key, value, options) {
  Object.defineProperty(el, key, extend({
    value: value,
    enumerable: false,
    writable: false,
    configurable: true
  }, options))
  return el
}

/**
 * Get the tag name of any DOM node
 * @param   { Object } dom - DOM node we want to parse
 * @returns { String } name to identify this dom node in riot
 */
function getTagName(dom) {
  var child = getTag(dom),
    namedTag = getAttr(dom, 'name'),
    tagName = namedTag && !tmpl.hasExpr(namedTag) ?
                namedTag :
              child ? child.name : dom.tagName.toLowerCase()

  return tagName
}

/**
 * Extend any object with other properties
 * @param   { Object } src - source object
 * @returns { Object } the resulting extended object
 *
 * var obj = { foo: 'baz' }
 * extend(obj, {bar: 'bar', foo: 'bar'})
 * console.log(obj) => {bar: 'bar', foo: 'bar'}
 *
 */
function extend(src) {
  var obj, args = arguments
  for (var i = 1; i < args.length; ++i) {
    if (obj = args[i]) {
      for (var key in obj) {
        // check if this property of the source object could be overridden
        if (isWritable(src, key))
          src[key] = obj[key]
      }
    }
  }
  return src
}

/**
 * Check whether an array contains an item
 * @param   { Array } arr - target array
 * @param   { * } item - item to test
 * @returns { Boolean } Does 'arr' contain 'item'?
 */
function contains(arr, item) {
  return ~arr.indexOf(item)
}

/**
 * Check whether an object is a kind of array
 * @param   { * } a - anything
 * @returns {Boolean} is 'a' an array?
 */
function isArray(a) { return Array.isArray(a) || a instanceof Array }

/**
 * Detect whether a property of an object could be overridden
 * @param   { Object }  obj - source object
 * @param   { String }  key - object property
 * @returns { Boolean } is this property writable?
 */
function isWritable(obj, key) {
  var props = Object.getOwnPropertyDescriptor(obj, key)
  return typeof obj[key] === T_UNDEF || props && props.writable
}


/**
 * With this function we avoid that the internal Tag methods get overridden
 * @param   { Object } data - options we want to use to extend the tag instance
 * @returns { Object } clean object without containing the riot internal reserved words
 */
function cleanUpData(data) {
  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION))
    return data

  var o = {}
  for (var key in data) {
    if (!RESERVED_WORDS_BLACKLIST.test(key)) o[key] = data[key]
  }
  return o
}

/**
 * Walk down recursively all the children tags starting dom node
 * @param   { Object }   dom - starting node where we will start the recursion
 * @param   { Function } fn - callback to transform the child node just found
 */
function walk(dom, fn) {
  if (dom) {
    // stop the recursion
    if (fn(dom) === false) return
    else {
      dom = dom.firstChild

      while (dom) {
        walk(dom, fn)
        dom = dom.nextSibling
      }
    }
  }
}

/**
 * Minimize risk: only zero or one _space_ between attr & value
 * @param   { String }   html - html string we want to parse
 * @param   { Function } fn - callback function to apply on any attribute found
 */
function walkAttributes(html, fn) {
  var m,
    re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g

  while (m = re.exec(html)) {
    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
  }
}

/**
 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
 * @param   { Object }  dom - DOM node we want to parse
 * @returns { Boolean } -
 */
function isInStub(dom) {
  while (dom) {
    if (dom.inStub) return true
    dom = dom.parentNode
  }
  return false
}

/**
 * Create a generic DOM node
 * @param   { String } name - name of the DOM node we want to create
 * @param   { Boolean } isSvg - should we use a SVG as parent node?
 * @returns { Object } DOM node just created
 */
function mkEl(name, isSvg) {
  return isSvg ?
    document.createElementNS('http://www.w3.org/2000/svg', 'svg') :
    document.createElement(name)
}

/**
 * Shorter and fast way to select multiple nodes in the DOM
 * @param   { String } selector - DOM selector
 * @param   { Object } ctx - DOM node where the targets of our search will is located
 * @returns { Object } dom nodes found
 */
function $$(selector, ctx) {
  return (ctx || document).querySelectorAll(selector)
}

/**
 * Shorter and fast way to select a single node in the DOM
 * @param   { String } selector - unique dom selector
 * @param   { Object } ctx - DOM node where the target of our search will is located
 * @returns { Object } dom node found
 */
function $(selector, ctx) {
  return (ctx || document).querySelector(selector)
}

/**
 * Simple object prototypal inheritance
 * @param   { Object } parent - parent object
 * @returns { Object } child instance
 */
function inherit(parent) {
  return Object.create(parent || null)
}

/**
 * Get the name property needed to identify a DOM node in riot
 * @param   { Object } dom - DOM node we need to parse
 * @returns { String | undefined } give us back a string to identify this dom node
 */
function getNamedKey(dom) {
  return getAttr(dom, 'id') || getAttr(dom, 'name')
}

/**
 * Set the named properties of a tag element
 * @param { Object } dom - DOM node we need to parse
 * @param { Object } parent - tag instance where the named dom element will be eventually added
 * @param { Array } keys - list of all the tag instance properties
 */
function setNamed(dom, parent, keys) {
  // get the key value we want to add to the tag instance
  var key = getNamedKey(dom),
    isArr,
    // add the node detected to a tag instance using the named property
    add = function(value) {
      // avoid to override the tag properties already set
      if (contains(keys, key)) return
      // check whether this value is an array
      isArr = isArray(value)
      // if the key was never set
      if (!value)
        // set it once on the tag instance
        parent[key] = dom
      // if it was an array and not yet set
      else if (!isArr || isArr && !contains(value, dom)) {
        // add the dom node into the array
        if (isArr)
          value.push(dom)
        else
          parent[key] = [value, dom]
      }
    }

  // skip the elements with no named properties
  if (!key) return

  // check whether this key has been already evaluated
  if (tmpl.hasExpr(key))
    // wait the first updated event only once
    parent.one('mount', function() {
      key = getNamedKey(dom)
      add(parent[key])
    })
  else
    add(parent[key])

}

/**
 * Faster String startsWith alternative
 * @param   { String } src - source string
 * @param   { String } str - test string
 * @returns { Boolean } -
 */
function startsWith(src, str) {
  return src.slice(0, str.length) === str
}

/**
 * requestAnimationFrame function
 * Adapted from https://gist.github.com/paulirish/1579671, license MIT
 */
var rAF = (function (w) {
  var raf = w.requestAnimationFrame    ||
            w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame

  if (!raf || /iP(ad|hone|od).*OS 6/.test(w.navigator.userAgent)) {  // buggy iOS6
    var lastTime = 0

    raf = function (cb) {
      var nowtime = Date.now(), timeout = Math.max(16 - (nowtime - lastTime), 0)
      setTimeout(function () { cb(lastTime = nowtime + timeout) }, timeout)
    }
  }
  return raf

})(window || {})

/**
 * Mount a tag creating new Tag instance
 * @param   { Object } root - dom node where the tag will be mounted
 * @param   { String } tagName - name of the riot tag we want to mount
 * @param   { Object } opts - options to pass to the Tag instance
 * @returns { Tag } a new Tag instance
 */
function mountTo(root, tagName, opts) {
  var tag = __tagImpl[tagName],
    // cache the inner HTML to fix #855
    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML

  // clear the inner html
  root.innerHTML = ''

  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)

  if (tag && tag.mount) {
    tag.mount()
    // add this tag to the virtualDom variable
    if (!contains(__virtualDom, tag)) __virtualDom.push(tag)
  }

  return tag
}
/**
 * Riot public api
 */

// share methods for other riot parts, e.g. compiler
riot.util = { brackets: brackets, tmpl: tmpl }

/**
 * Create a mixin that could be globally shared across all the tags
 */
riot.mixin = (function() {
  var mixins = {},
    globals = mixins[GLOBAL_MIXIN] = {},
    _id = 0

  /**
   * Create/Return a mixin by its name
   * @param   { String }  name - mixin name (global mixin if object)
   * @param   { Object }  mixin - mixin logic
   * @param   { Boolean } g - is global?
   * @returns { Object }  the mixin logic
   */
  return function(name, mixin, g) {
    // Unnamed global
    if (isObject(name)) {
      riot.mixin('__unnamed_'+_id++, name, true)
      return
    }

    var store = g ? globals : mixins

    // Getter
    if (!mixin) {
      if (typeof store[name] === T_UNDEF) {
        throw new Error('Unregistered mixin: ' + name)
      }
      return store[name]
    }
    // Setter
    if (isFunction(mixin)) {
      extend(mixin.prototype, store[name] || {})
      store[name] = mixin
    }
    else {
      store[name] = extend(store[name] || {}, mixin)
    }
  }

})()

/**
 * Create a new riot tag implementation
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   html - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
riot.tag = function(name, html, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs
    if (/^[\w\-]+\s?=/.test(css)) {
      attrs = css
      css = ''
    } else attrs = ''
  }
  if (css) {
    if (isFunction(css)) fn = css
    else styleManager.add(css)
  }
  name = name.toLowerCase()
  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
  return name
}

/**
 * Create a new riot tag implementation (for use by the compiler)
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   html - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
riot.tag2 = function(name, html, css, attrs, fn) {
  if (css) styleManager.add(css)
  //if (bpair) riot.settings.brackets = bpair
  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
  return name
}

/**
 * Mount a tag using a specific tag implementation
 * @param   { String } selector - tag DOM selector
 * @param   { String } tagName - tag implementation name
 * @param   { Object } opts - tag logic
 * @returns { Array } new tags instances
 */
riot.mount = function(selector, tagName, opts) {

  var els,
    allTags,
    tags = []

  // helper functions

  function addRiotTags(arr) {
    var list = ''
    each(arr, function (e) {
      if (!/[^-\w]/.test(e)) {
        e = e.trim().toLowerCase()
        list += ',[' + RIOT_TAG_IS + '="' + e + '"],[' + RIOT_TAG + '="' + e + '"]'
      }
    })
    return list
  }

  function selectAllTags() {
    var keys = Object.keys(__tagImpl)
    return keys + addRiotTags(keys)
  }

  function pushTags(root) {
    if (root.tagName) {
      var riotTag = getAttr(root, RIOT_TAG_IS) || getAttr(root, RIOT_TAG)

      // have tagName? force riot-tag to be the same
      if (tagName && riotTag !== tagName) {
        riotTag = tagName
        setAttr(root, RIOT_TAG_IS, tagName)
        setAttr(root, RIOT_TAG, tagName) // this will be removed in riot 3.0.0
      }
      var tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts)

      if (tag) tags.push(tag)
    } else if (root.length) {
      each(root, pushTags)   // assume nodeList
    }
  }

  // ----- mount code -----

  // inject styles into DOM
  styleManager.inject()

  if (isObject(tagName)) {
    opts = tagName
    tagName = 0
  }

  // crawl the DOM to find the tag
  if (typeof selector === T_STRING) {
    if (selector === '*')
      // select all the tags registered
      // and also the tags found with the riot-tag attribute set
      selector = allTags = selectAllTags()
    else
      // or just the ones named like the selector
      selector += addRiotTags(selector.split(/, */))

    // make sure to pass always a selector
    // to the querySelectorAll function
    els = selector ? $$(selector) : []
  }
  else
    // probably you have passed already a tag or a NodeList
    els = selector

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectAllTags()
    // if the root els it's just a single tag
    if (els.tagName)
      els = $$(tagName, els)
    else {
      // select all the children for all the different root elements
      var nodeList = []
      each(els, function (_el) {
        nodeList.push($$(tagName, _el))
      })
      els = nodeList
    }
    // get rid of the tagName
    tagName = 0
  }

  pushTags(els)

  return tags
}

/**
 * Update all the tags instances created
 * @returns { Array } all the tags instances
 */
riot.update = function() {
  return each(__virtualDom, function(tag) {
    tag.update()
  })
}

/**
 * Export the Virtual DOM
 */
riot.vdom = __virtualDom

/**
 * Export the Tag constructor
 */
riot.Tag = Tag
  // support CommonJS, AMD & browser
  /* istanbul ignore next */
  if (typeof exports === T_OBJECT)
    module.exports = riot
  else if (typeof define === T_FUNCTION && typeof define.amd !== T_UNDEF)
    define(function() { return riot })
  else
    window.riot = riot

})(typeof window != 'undefined' ? window : void 0);

},{}],17:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":18,"punycode":12,"querystring":15}],18:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}]},{},[3]);
