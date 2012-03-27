/*jshint browsers:true, forin: true, laxbreak: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
window.Micrajax = (function() {
  "use strict";

  function request(type, url, contentType, callback, data) {
    var req;

    function stateChange(object) {
      try {
        if (req.readyState==4)
          callback(req.responseText, req.status);
      }catch(e) {}
    }

    function getRequest() {
      if (window.ActiveXObject)
        return new ActiveXObject('Microsoft.XMLHTTP');
      else if (window.XMLHttpRequest)
        return new XMLHttpRequest();
      return false;
    }

    req = getRequest();
    if(req) {
      req.onreadystatechange = stateChange;

      req.open(type, url, true);
      req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      if (data) {
        req.setRequestHeader('Content-type', contentType);
      }

      req.setRequestHeader('Accept', 'application/json;text/plain');
      req.setRequestHeader('Connection', 'close');

      req.send(data || null);
    }
  }

  function toDataString(data) {
    var components = [],
        dataString = "";

    for(var key in data) {
      if(typeof data[key] !== "undefined") {
        components.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
      }
    }

    if(components && components.length) {
      dataString = components.join("&");
    }

    return dataString;
  }

  var Micrajax = {
    ajax: function(req) {
      var type = req.type || "GET",
          url = req.url,
          error = req.error,
          success = req.success,
          contentType = req.contentType || "application/x-www-form-urlencoded",
          data = toDataString(req.data);


      if (type === "GET" && data) {
        url += "?" + data;
        data = null;
      }

      request(type, url, contentType, function(responseText, status) {
        var jqXHR = {
          status: status,
          responseText: responseText
        };

        if (status >= 200 && status < 300 || status === 304) {
          var respData = responseText;

          try {
            // The text response could be text/plain, just ignore the JSON
            // parse error in this case.
            var respData = JSON.parse(responseText);
          } catch(e) {}

          success && success(respData, responseText, jqXHR);
        }
        else {
          error && error(jqXHR, status, responseText);
        }
      }, data);
    }
  };

  return Micrajax;

}());
