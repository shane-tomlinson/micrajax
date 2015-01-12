(function () {
  'use strict';

  var micra = window.Micrajax;
  var assert = window.chai.assert;

  var urlRoot = '';
  function getUrl (endpoint) {
    return urlRoot + endpoint;
  }

  function unexpected(msg) {
    return function (done) {
      assert.fail(msg);
      done();
    }
  }


  describe('micrajax', function () {
    it('get without data success, text response - expect 200 response, empty responseText', function (done) {
      var mockXHR = micra.ajax({
        url: getUrl('/get_success_text'),
        success: function (data, responseText, jqXHR) {
          assert.equal(data, '', 'correct data');
          assert.equal(responseText, '', 'correct text responseText');
          assert.equal(jqXHR.status, 200, 'correct status');
          assert.equal(jqXHR.readyState, 4, 'correct readyState');
          done();
        },
        error: unexpected('error', done)
      });
    });

    it('get with data success, text response - expect 200 response, responseText with get data', function (done) {
      micra.ajax({
        url: getUrl('/get_success_text'),
        data: {
          key: 'value'
        },
        success: function (data, responseText, jqXHR) {
          assert.equal(data, 'key=value', 'correct data');
          assert.equal(responseText, 'key=value', 'correct responseText');
          assert.equal(jqXHR.status, 200, 'correct status');
          done();
        },
        error: unexpected('error', done)
      });
    });

    it('get with data success, JSON response - expect 200 response, data parsed from JSON', function (done) {
      micra.ajax({
        url: getUrl('/get_success_json'),
        data: {
          key: 'value'
        },
        success: function (data, responseText, jqXHR) {
          assert.equal(data.key, 'value', 'correct data');
          assert.equal(jqXHR.status, 200, 'correct status');
          done();
        },
        error: unexpected('error', done)
      });
    });

    it('get with failure, expect error to be called', function (done) {
      micra.ajax({
        url: getUrl('/get_failure'),
        data: {
          key: 'value'
        },
        success: unexpected('success', done),
        error: function (jqXHR, status, responseText) {
          assert.equal(status, 400, 'correct status returned');
          assert.equal(responseText, 'get failure', 'correct responseText returned');
          done();
        }
      });
    });

    it('get with headers - expect headers to be received',
        function (done) {
      micra.ajax({
        url: getUrl('/get_headers'),
        headers: {
          'X-TEST-HEADER': 'x-test-header-value'
        },
        success: function (data, responseText, jqXHR) {
          assert.equal(data['x-test-header'], 'x-test-header-value');
          done();
        },
        error: unexpected('error', done)
      });
    });

    it('post with undefined data success, text response - expect 200 response, responseText with no data', function (done) {
      micra.ajax({
        type: 'POST',
        url: getUrl('/post_success_text'),
        success: function (data, responseText, jqXHR) {
          assert.equal(data, '', 'correct data');
          assert.equal(responseText, '', 'correct responseText');
          assert.equal(jqXHR.status, 200, 'correct status');
          done();
        },
        error: unexpected('error', done)
      });
    });

    it('post with null data success, text response - expect 200 response, responseText with no data', function (done) {
      micra.ajax({
        type: 'POST',
        url: getUrl('/post_success_text'),
        data: null,
        success: function (data, responseText, jqXHR) {
          assert.equal(data, '', 'correct data');
          assert.equal(responseText, '', 'correct responseText');
          assert.equal(jqXHR.status, 200, 'correct status');
          done();
        },
        error: unexpected('error', done)
      });
    });

    it('post with object data success, text response - expect 200 response, responseText with post data', function (done) {
      micra.ajax({
        type: 'POST',
        url: getUrl('/post_success_text'),
        data: {
          key: 'value'
        },
        success: function (data, responseText, jqXHR) {
          assert.equal(data, 'key=value', 'correct data');
          assert.equal(responseText, 'key=value', 'correct responseText');
          assert.equal(jqXHR.status, 200, 'correct status');
          done();
        },
        error: unexpected('error', done)
      });
    });

    it('post with JSON data success, text response - expect 200 response, responseText with post data', function (done) {
      var jsonValue = JSON.stringify({ key: 'value' });
      micra.ajax({
        type: 'POST',
        url: getUrl('/post_success_text'),
        data: jsonValue,
        contentType: 'application/json',
        success: function (data, responseText, jqXHR) {
          var expectedResponse = 'key=value';
          assert.equal(data, expectedResponse, 'correct data');
          assert.equal(responseText, expectedResponse, 'correct responseText');
          assert.equal(jqXHR.status, 200, 'correct status');
          done();
        },
        error: unexpected('error', done)
      });
    });

    it('post with data success, JSON response - expect 200 response, data parsed from JSON', function (done) {
      micra.ajax({
        type: 'POST',
        url: getUrl('/post_success_json'),
        data: {
          key: 'value'
        },
        success: function (data, responseText, jqXHR) {
          assert.equal(data.key, 'value', 'correct data');
          assert.equal(jqXHR.status, 200, 'correct status');
          done();
        },
        error: unexpected('error', done)
      });
    });

    it('post with failure, expect error to be called', function (done) {
      micra.ajax({
        type: 'POST',
        url: getUrl('/post_failure'),
        data: {
          key: 'value'
        },
        success: function (data, responseText, jqXHR) {
          ok(false, 'success should not have been called');
          done();
        },
        error: function (jqXHR, status, responseText) {
          assert.equal(status, 400, 'correct status returned');
          assert.equal(responseText, 'post failure', 'correct responseText returned');
          done();
        }
      });

    });

    it('post with headers - expect headers to be received',
        function (done) {
      micra.ajax({
        type: 'POST',
        url: getUrl('/post_headers'),
        headers: {
          'X-TEST-HEADER': 'x-test-header-value'
        },
        success: function (data, responseText, jqXHR) {
          assert.equal(data['x-test-header'], 'x-test-header-value');
          done();
        },
        error: unexpected('error', done)
      });
    });

    it('abort a request - error callback with statusText=`aborted`',
        function (done) {
      var xhr = micra.ajax({
        url: getUrl('/request_with_latency'),
        data: {
          timeout: 1000
        },
        success: unexpected('success', done),
        error: function (xhr, status, responseText) {
          assert.equal(xhr.statusText, 'aborted')
          assert.equal(status, 0);
          done();
        }
      });

      xhr.abort();
    });


    it('not found - error callback with statusText=`Not Found`',
        function (done) {
      var xhr = micra.ajax({
        url: getUrl('/not_found'),
        success: unexpected('success', done),
        error: function (xhr, status, responseText) {
          assert.equal(xhr.statusText, 'Not Found')
          assert.equal(status, 404);
          done();
        }
      });
    });
  });
}());

