(function (global) {
  'use strict';
  if (typeof require === 'function') {
    global.assert = global.assert || require('assert');
    global.chai = global.chai || require('../assertive-chai');
  }
}(this));

(function (global) {
  'use strict';
  // https://github.com/chaijs/chai/blob/master/test/assert.js
  describe('assert', function () {
    var assert, err;
    assert = global.chai.assert;
    // https://github.com/chaijs/chai/blob/master/test/bootstrap/index.js
    err = function (fn, msg) {
      try {
        fn();
        throw new Error({ message: 'Expected an error' });
      } catch (ignore) {}
    };

    it('deepEqual for issue #4', function() {
      // https://github.com/jokeyrhyme/assertive-chai.js/issues/4
      err(function () {
        assert.deepEqual(1, 3);
      }, "expected { tea: \'chai\' } to deeply equal { tea: \'black\' }");
    });

    it('notDeepEqual for issue #4', function() {
      // https://github.com/jokeyrhyme/assertive-chai.js/issues/4
      assert.notDeepEqual(1, 3);
    });

  });
}(this));
