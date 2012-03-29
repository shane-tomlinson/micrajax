(function() {
  "use strict";

  var micra = window.Micrajax;

  module("micrajax");

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
      error: function() {
        ok(false, "error should not have been called");
        start();
      }
    });

    equal(mockXHR.readyState, 0, "readyState set on returned mockXHR");
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
      error: function() {
        ok(false, "error should not have been called");
        start();
      }
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
      error: function() {
        ok(false, "error should not have been called");
        start();
      }
    });
  });

  asyncTest("get with failure, expect error to be called", function() {
    micra.ajax({
      url: "/get_failure",
      data: {
        key: "value"
      },
      success: function(data, responseText, jqXHR) {
        ok(false, "success should not have been called");
        start();
      },
      error: function(jqXHR, status, responseText) {
        equal(status, 500, "correct status returned");
        equal(responseText, "get failure", "correct responseText returned");
        start();
      }
    });
  });

  asyncTest("post with data success, text response - expect 200 response, responseText with post data", function() {
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
      error: function() {
        ok(false, "error should not have been called");
        start();
      }
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
      error: function() {
        ok(false, "error should not have been called");
        start();
      }
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
        equal(status, 500, "correct status returned");
        equal(responseText, "post failure", "correct responseText returned");
        start();
      }
    });
  });

}());

