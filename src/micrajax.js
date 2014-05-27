/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* jshint ignore:start */
(function(define){
/* jshint ignore:end */
define(function (require, exports, module, undefined) {
  'use strict';

  function curry(fToBind) {
    var aArgs = [].slice.call(arguments, 1),
        fBound = function () {
          return fToBind.apply(null, aArgs.concat([].slice.call(arguments)));
        };

    return fBound;
  }

  function getXhrObject() {
    var xhrObject;

    // From http://blogs.msdn.com/b/ie/archive/2011/08/31/browsing-without-plug-ins.aspx
    // Best Practice: Use Native XHR, if available
    if (window.XMLHttpRequest) {
      // If IE7+, Gecko, WebKit: Use native object
      xhrObject = new window.XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
      // ...if not, try the ActiveX control
      xhrObject = new window.ActiveXObject('Microsoft.XMLHTTP');
    }

    return xhrObject;
  }

  function noOp() {}

  function onReadyStateChange(xhrObject, callback) {
    try {
      if (xhrObject.readyState === 4) {
        xhrObject.onreadystatechange = noOp;

        callback && callback(xhrObject.responseText, xhrObject.status, xhrObject.statusText);
      }
    } catch(e) {}
  }

  function toRequestString(data) {
    var components = [],
        requestString = "";

    for(var key in data) {
      if (typeof data[key] !== "undefined") {
        components.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
      }
    }

    if (components && components.length) {
      requestString = components.join("&");
    }

    return requestString;
  }


  function setRequestHeaders(definedHeaders, xhrObject) {
    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json;text/plain'
    };

    for(var definedHeader in definedHeaders) {
      headers[definedHeader] = definedHeaders[definedHeader];
    }

    for(var key in headers) {
      xhrObject.setRequestHeader(key, headers[key]);
    }
  }

  function getURL(url, type, data) {
    var requestString = toRequestString(data);

    if (type === "GET" && requestString) {
      url += "?" + requestString;
    }

    return url;
  }

  function getData(contentType, type, data) {
    var sendData;

    if (type !== "GET" && data) {
      switch(contentType) {
        case "application/json":
          if(typeof data === "string") {
            sendData = data;
          }
          else {
            sendData = JSON.stringify(data);
          }
          break;
        case 'application/x-www-form-urlencoded':
          sendData = toRequestString(data);
          break;
        default:
          // do nothing
          break;
      }
    }

    return sendData || null;
  }

  function sendRequest(options, callback, data) {
    var xhrObject = getXhrObject();

    if (xhrObject) {
      xhrObject.onreadystatechange = curry(onReadyStateChange, xhrObject, callback);

      var type = (options.type || "GET").toUpperCase(),
          contentType = options.contentType || 'application/x-www-form-urlencoded',
          url = getURL(options.url, type, options.data);

      data = getData(contentType, type, options.data);

      xhrObject.open(type, url, true);
      var headers = {
        "Content-type" : contentType
      };
      for(var k in options.headers) {
        headers[k] = options.headers[k];
      }
      setRequestHeaders(headers, xhrObject);
      xhrObject.send(data);
    }
    else {
      throw "could not get XHR object";
    }

    return xhrObject;
  }

  var Micrajax = {
    ajax: function(options) {
      var error = options.error,
          success = options.success,
          mockXHR = { readyState: 0 };

      var xhrObject = sendRequest(options, function(responseText, status, statusText) {
        mockXHR.status = status;
        mockXHR.responseText = responseText;
        if (!mockXHR.statusText)
          mockXHR.statusText = status !== 0 ? statusText : "error";
        mockXHR.readyState = 4;

        if (status >= 200 && status < 300 || status === 304) {
          var respData = responseText;

          try {
            // The text response could be text/plain, just ignore the JSON
            // parse error in this case.
            respData = JSON.parse(responseText);
          } catch(e) {}

          success && success(respData, responseText, mockXHR);
        }
        else {
          error && error(mockXHR, status, responseText);
        }
      });

      mockXHR.abort = function() {
        mockXHR.statusText = "aborted";
        xhrObject.abort();
      };

      return mockXHR;
    }
  };

  module.exports = Micrajax;
});
/* jshint ignore:start */
})((function(n,w){return typeof define=='function'&&define.amd
?define:typeof module=='object'?function(c){c(require,exports,module);}
:function(c){var m={exports:{}},r=function(n){return w[n];};w[n]=c(r,m.exports,m)||m.exports;};
})('Micrajax',this));
/* jshint ignore:end */
