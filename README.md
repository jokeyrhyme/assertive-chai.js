# Assertive Chai

[Chai.JS](http://chaijs.com/) without Expect or Should

## What?

This is just the [Assert API](http://chaijs.com/api/assert/) from
Chai.JS. When run in Node.JS, it depends on the built-in `assert`
module. When run in the browser, it depends on the [browser port of
those assertions](https://github.com/Jxck/assert).

The unit tests are stolen from Chai.JS in part.

## Why?

- [Chai.JS needlessly requires ECMAScript 5](https://github.com/chaijs/chai/issues/117), making it a poor choice for projects that need to span a wide variety of browsers

- I don't feel that BDD is necessary: as an API it's often harder to
  learn than TDD, and tests aren't that difficult to read in any case


