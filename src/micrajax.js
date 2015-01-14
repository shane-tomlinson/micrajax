/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

;(function (root, factory) {
  // more info:
  // https://raw.githubusercontent.com/umdjs/umd/master/returnExports.js
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Micrajax = factory();
  }
}(this, function () {

  'use strict';

  var DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded';

  function curry(fToBind) {
    var aArgs = [].slice.call(arguments, 1);
    var fBound = function () {
      return fToBind.apply(null, aArgs.concat([].slice.call(arguments)));
    };

    return fBound;
  }

  function getXHRObject(options) {
    // From http://blogs.msdn.com/b/ie/archive/2011/08/31/browsing-without-plug-ins.aspx
    // Best Practice: Use Native XHR, if available
    if (options.xhr) {
      return options.xhr;
    } else if (window.XMLHttpRequest) {
      // If IE7+, Gecko, WebKit: Use native object
      return new window.XMLHttpRequest();
    } else if (window.ActiveXObject) {
      // ...if not, try the ActiveX control
      return new window.ActiveXObject('Microsoft.XMLHTTP');
    }
  }

  function noOp() {}

  function onReadyStateChange(xhrObject, callback) {
    try {
      if (xhrObject.readyState === 4) {
        xhrObject.onreadystatechange = noOp;

        callback(xhrObject.responseText, xhrObject.status, xhrObject.statusText);
      }
    } catch(e) {}
  }

  function toQueryParamsString(data) {
    var queryParams = [];

    for (var key in data) {
      var value = data[key];

      if (typeof value !== 'undefined') {
        var queryParam = encodeURIComponent(key) +
                         '=' +
                         encodeURIComponent(value);
        queryParams.push(queryParam);
      }
    }

    return queryParams.join('&');
  }


  function setRequestHeaders(definedHeaders, xhrObject) {
    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json;text/plain'
    };

    for (var definedHeader in definedHeaders) {
      headers[definedHeader] = definedHeaders[definedHeader];
    }

    for (var key in headers) {
      xhrObject.setRequestHeader(key, headers[key]);
    }
  }

  function getURL(url, type, data) {
    var requestString = toQueryParamsString(data);

    if (type === 'GET' && requestString) {
      url += '?' + requestString;
    }

    return url;
  }

  function getData(contentType, type, data) {
    var sendData;

    if (type !== 'GET' && data) {
      switch (contentType) {
        case 'application/json':
          if (typeof data === 'string') {
            sendData = data;
          } else {
            sendData = JSON.stringify(data);
          }
          break;
        case 'application/x-www-form-urlencoded':
          sendData = toQueryParamsString(data);
          break;
        default:
          // do nothing
          break;
      }
    }

    return sendData || null;
  }

  function getHeaders(contentType, specifiedHeaders) {
    var headers = {
      'Content-type': contentType
    };

    for (var k in specifiedHeaders) {
      headers[k] = specifiedHeaders[k];
    }

    return headers;
  }

  function sendRequest(options, callback, data) {
    options = options || {};

    var xhrObject = getXHRObject(options);

    if (! xhrObject) {
      throw new Error('could not get XHR object');
    }

    xhrObject.onreadystatechange = curry(onReadyStateChange, xhrObject, callback|| noOp);

    var type = (options.type || 'GET').toUpperCase();
    var contentType = options.contentType || DEFAULT_CONTENT_TYPE;
    var url = getURL(options.url, type, options.data);

    data = getData(contentType, type, options.data);

    xhrObject.open(type, url, true);

    var headers = getHeaders(contentType, options.headers);
    setRequestHeaders(headers, xhrObject);

    xhrObject.send(data);

    return xhrObject;
  }

  var Micrajax = {
    ajax: function (options) {
      options = options || {};
      var error = options.error || noOp;
      var success = options.success || noOp;
      var mockXHR = { readyState: 0 };

      var xhrObject = sendRequest(options, function (responseText, status, statusText) {
        mockXHR.status = status;
        mockXHR.responseText = responseText;
        if (! mockXHR.statusText) {
          mockXHR.statusText = status !== 0 ? statusText : 'error';
        }
        mockXHR.readyState = 4;

        if (status >= 200 && status < 300 || status === 304) {
          var respData = responseText;

          try {
            // The text response could be text/plain, just ignore the JSON
            // parse error in this case.
            respData = JSON.parse(responseText);
          } catch(e) {}

          success(respData, responseText, mockXHR);
        } else {
          error(mockXHR, status, responseText);
        }
      });

      mockXHR.abort = function () {
        mockXHR.statusText = 'aborted';
        xhrObject.abort();
      };

      return mockXHR;
    }
  };

  return Micrajax;
}));
