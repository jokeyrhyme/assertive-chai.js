# Changelog

## v2.0.0 - 2015-03-27

### Changed

- use `/dist/assertive-chai.js` for browser testing, not `/assertive-chai.js`

- development process now uses [gulp](http://gulpjs.com/)

- development process now uses [browserify](http://browserify.org/)

- execute tests both directly in Node.js and now within [PhantomJS](http://phantomjs.org/)

- depend on [chaijs/deep-eql](https://github.com/chaijs/deep-eql) from upstream Chai.js to minimise staleness

- depend on [chaijs/pathval](https://github.com/chaijs/pathval) from upstream Chai.js to minimise staleness

- depend on [chaijs/type-detect](https://github.com/chaijs/type-detect) from upstream Chai.js to minimise staleness

- switched to the MIT license for easier compatibility with upstream Chai.js

    - we have a modified version of their tests and some other snippets

### Fixes

- `deepEquals()` now works with circular objects

- circular Backbone models no longer cause tests in PhantomJS to hang
