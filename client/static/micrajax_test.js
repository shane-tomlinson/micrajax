(function() {
  "use strict";

  var micra = window.Micrajax;

  module("micrajax");

  function unexpected(msg) {
    return function() {
      ok(false, msg);
      start();
    }
  }

  asyncTest("get without data success, text response - expect 200 response, empty responseText", function() {
    var mockXHR = micra.ajax({
      url: "/get_success_text",
      success: function(data, responseText, jqXHR) {
        equal(data, "", "correct data");
        equal(responseText, "", "correct text responseText");
        equal(jqXHR.status, 200, "correct status");
        equal(jqXHR.readyState, 4, "correct readyState");
        start();
      },
      error: unexpected("error")
    });
  });

  asyncTest("get with data success, text response - expect 200 response, responseText with get data", function() {
    micra.ajax({
      url: "/get_success_text",
      data: {
        key: "value"
      },
      success: function(data, responseText, jqXHR) {
        equal(data, "key=value", "correct data");
        equal(responseText, "key=value", "correct responseText");
        equal(jqXHR.status, 200, "correct status");
        start();
      },
      error: unexpected("error")
    });
  });

  asyncTest("get with data success, JSON response - expect 200 response, data parsed from JSON", function() {
    micra.ajax({
      url: "/get_success_json",
      data: {
        key: "value"
      },
      success: function(data, responseText, jqXHR) {
        equal(data.key, "value", "correct data");
        equal(jqXHR.status, 200, "correct status");
        start();
      },
      error: unexpected("error")
    });
  });

  asyncTest("get with failure, expect error to be called", function() {
    micra.ajax({
      url: "/get_failure",
      data: {
        key: "value"
      },
      success: unexpected("success"),
      error: function(jqXHR, status, responseText) {
        equal(status, 400, "correct status returned");
        equal(responseText, "get failure", "correct responseText returned");
        start();
      }
    });
  });

  asyncTest("get with headers - expect headers to be received",
      function() {
    micra.ajax({
      url: "/get_headers",
      headers: {
        'X-TEST-HEADER': 'x-test-header-value'
      },
      success: function(data, responseText, jqXHR) {
        equal(data['x-test-header'], 'x-test-header-value');
        start();
      },
      error: unexpected("error")
    });
  });

  asyncTest("post with undefined data success, text response - expect 200 response, responseText with no data", function() {
    micra.ajax({
      type: "POST",
      url: "/post_success_text",
      success: function(data, responseText, jqXHR) {
        equal(data, "", "correct data");
        equal(responseText, "", "correct responseText");
        equal(jqXHR.status, 200, "correct status");
        start();
      },
      error: unexpected("error")
    });
  });

  asyncTest("post with null data success, text response - expect 200 response, responseText with no data", function() {
    micra.ajax({
      type: "POST",
      url: "/post_success_text",
      data: null,
      success: function(data, responseText, jqXHR) {
        equal(data, "", "correct data");
        equal(responseText, "", "correct responseText");
        equal(jqXHR.status, 200, "correct status");
        start();
      },
      error: unexpected("error")
    });
  });

  asyncTest("post with object data success, text response - expect 200 response, responseText with post data", function() {
    micra.ajax({
      type: "POST",
      url: "/post_success_text",
      data: {
        key: "value"
      },
      success: function(data, responseText, jqXHR) {
        equal(data, "key=value", "correct data");
        equal(responseText, "key=value", "correct responseText");
        equal(jqXHR.status, 200, "correct status");
        start();
      },
      error: unexpected("error")
    });
  });

  asyncTest("post with JSON data success, text response - expect 200 response, responseText with post data", function() {
    var jsonValue = JSON.stringify({ key: "value" });
    micra.ajax({
      type: "POST",
      url: "/post_success_text",
      data: jsonValue,
      contentType: "application/json",
      success: function(data, responseText, jqXHR) {
        var expectedResponse = "key=value";
        equal(data, expectedResponse, "correct data");
        equal(responseText, expectedResponse, "correct responseText");
        equal(jqXHR.status, 200, "correct status");
        start();
      },
      error: unexpected("error")
    });
  });

  asyncTest("post with data success, JSON response - expect 200 response, data parsed from JSON", function() {
    micra.ajax({
      type: "POST",
      url: "/post_success_json",
      data: {
        key: "value"
      },
      success: function(data, responseText, jqXHR) {
        equal(data.key, "value", "correct data");
        equal(jqXHR.status, 200, "correct status");
        start();
      },
      error: unexpected("error")
    });
  });

  asyncTest("post with failure, expect error to be called", function() {
    micra.ajax({
      type: "POST",
      url: "/post_failure",
      data: {
        key: "value"
      },
      success: function(data, responseText, jqXHR) {
        ok(false, "success should not have been called");
        start();
      },
      error: function(jqXHR, status, responseText) {
        equal(status, 400, "correct status returned");
        equal(responseText, "post failure", "correct responseText returned");
        start();
      }
    });

  });

  asyncTest("post with headers - expect headers to be received",
      function() {
    micra.ajax({
      type: "POST",
      url: "/post_headers",
      headers: {
        'X-TEST-HEADER': 'x-test-header-value'
      },
      success: function(data, responseText, jqXHR) {
        equal(data['x-test-header'], 'x-test-header-value');
        start();
      },
      error: unexpected("error")
    });
  });

  asyncTest("abort a request - error callback with statusText='aborted'",
      function() {
    var xhr = micra.ajax({
      url: "/request_with_latency",
      data: {
        timeout: 1000
      },
      success: unexpected("success"),
      error: function(xhr, status, responseText) {
        equal(xhr.statusText, "aborted")
        equal(status, 0);
        start();
      }
    });

    xhr.abort();
  });


  asyncTest("not found - error callback with statusText='Not Found'",
      function() {
    var xhr = micra.ajax({
      url: "/not_found",
      success: unexpected("success"),
      error: function(xhr, status, responseText) {
        equal(xhr.statusText, "Not Found")
        equal(status, 404);
        start();
      }
    });
  });


}());

