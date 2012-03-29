/*jshint browsers:true, forin: true, laxbreak: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
window.Micrajax = (function() {
  "use strict";
  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP = function () {},
          fBound = function () {
            return fToBind.apply(this instanceof fNOP
                                   ? this
                                   : oThis || window,
                                 aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
  }

  function getXHRObject() {
    var xhrObject;

    if (window.ActiveXObject) {
      xhrObject = new ActiveXObject('Microsoft.XMLHTTP');
    }
    else if (window.XMLHttpRequest) {
      xhrObject = new XMLHttpRequest();
    }

    return xhrObject;
  }

  function onReadyStateChange(xhrObject, callback) {
    try {
      if (xhrObject.readyState==4) {
        callback && callback(xhrObject.responseText, xhrObject.status);
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
      'Accept': 'application/json;text/plain',
      'Content-type': 'application/x-www-form-urlencoded'
    };

    for(var key in definedHeaders) {
      headers[key] = definedHeaders[key];
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

  function getData(type, data) {
    var requestString = toRequestString(data) || null;

    if (type === "GET" && requestString) {
      requestString = null;
    }

    return requestString;
  }

  function sendRequest(options, callback, data) {
    var xhrObject = getXHRObject();

    if (xhrObject) {
      xhrObject.onreadystatechange = onReadyStateChange.bind(null, xhrObject, callback);

      var type = (options.type || "GET").toUpperCase(),
          url = getURL(options.url, type, options.data),
          data = getData(type, options.data);

      xhrObject.open(type, url, true);
      setRequestHeaders(options.headers, xhrObject);
      xhrObject.send(data);
    }
  }

  var Micrajax = {
    ajax: function(options) {
      var error = options.error,
          success = options.success,
          mockXHR = { readyState: 0 };

      sendRequest(options, function(responseText, status) {
        mockXHR.status = status;
        mockXHR.responseText = responseText;
        mockXHR.readyState = 4;

        if (status >= 200 && status < 300 || status === 304) {
          var respData = responseText;

          try {
            // The text response could be text/plain, just ignore the JSON
            // parse error in this case.
            var respData = JSON.parse(responseText);
          } catch(e) {}

          success && success(respData, responseText, mockXHR);
        }
        else {
          error && error(mockXHR, status, responseText);
        }
      });

      return mockXHR;
    }
  };

  return Micrajax;

}());
