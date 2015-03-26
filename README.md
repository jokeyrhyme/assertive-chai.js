# Assertive Chai

[Chai.JS](http://chaijs.com/) without Expect or Should

## What?

This is just the [Assert API](http://chaijs.com/api/assert/) from
Chai.JS. When run in Node.JS, it depends on the built-in `assert`
module. When run in the browser, it depends on the [browser port of
those assertions](https://github.com/Jxck/assert).

The unit tests are stolen from Chai.JS in part.

### Status

I'm leaning on Node.js' implementation of `deepEqual` and I need to borrow
Chai's instead, so:

- deep-equality assertion for objects with circular references isn't working yet

- deep-equality assertion for objects like `Object.create({ ... })` isn't working
either

Likewise, I'm leaning on Node.js' implementation of `throws` and `doesNotThrow`,
so:

- assertions on the content of a thrown error aren't working yet


## Why?

- [Chai.JS requires ECMAScript 5](https://github.com/chaijs/chai/issues/117),
  making it a poor choice for projects that need to span a wide variety of
  browsers

- I don't feel BDD-style assertions are worth the hassle of having to
  learn what is frequently an inconsistent API

- BDD makes more sense at the test framework level, and it's easy to
  integrate Chai.JS (and this library) with any test framework you like

## How?

### Browser

```sh
bower install assertive-chai --save-dev
```

```html
<script src="bower_components/assertive-chai/dist/assertive-chai.js"></script>
<script>
var assert = chai.assert;
</script>
```

Be sure to include ES5 shims if you need to test in IE8, and a JSON polyfill for
testing in IE7.

### Node.JS

Frankly, I'd probably just stick with upstream Chai for Node.JS (as there
aren't any ES5 compatibility issues with Node.JS), but if you like:

```sh
npm install assertive-chai --save-dev
```

```javascript
var assert = require('assertive-chai').assert;
```

## Development

- generate the browser bundle: `npm run build`
- generate browser tests bundle and run Node.js tests: `npm test`
- run the browser tests by navigating to the HTML files in the tests directory

## License

- [MIT](LICENSE.txt)

## Related Stuff

- see my [tape-chai](https://github.com/jokeyrhyme/tape-chai.js) project if you
  prefer the simplicity of [tape](https://github.com/substack/tape) but miss
  some of the more convenient assertions from [chai](http://chaijs.com/)
