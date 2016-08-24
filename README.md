# react-history [![Travis][build-badge]][build] [![npm package][npm-badge]][npm]

[build-badge]: https://img.shields.io/travis/ReactTraining/react-history/master.svg?style=flat-square
[build]: https://travis-ci.org/ReactTraining/react-history

[npm-badge]: https://img.shields.io/npm/v/react-history.svg?style=flat-square
[npm]: https://www.npmjs.com/package/react-history

[`react-history`](https://www.npmjs.com/package/react-history) provides tools to manage the URL history using [React](https://facebook.github.io/react).

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-history

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using an ES6 transpiler, like babel
import { BrowserHistory } from 'react-history'

// not using an ES6 transpiler
var BrowserHistory = require('react-history').BrowserHistory
```

The UMD build is also available on [npmcdn](https://npmcdn.com):

```html
<script src="https://npmcdn.com/react-history/umd/react-history.min.js"></script>
```

You can find the library on `window.ReactHistory`.

## Usage

`react-history` ships with 3 different history implementations:

- `<BrowserHistory>` - for modern browsers, uses the `popstate` event
- `<HashHistory>` - for older browsers, essentially a hack that uses the `hashchange` event
- `<MemoryHistory>` - for other environments and testing

For the sake of brevity, the term `<History>` in this document refers to any of these implementations.

When you render a `<History>` it will emit an object with an `action` and a `location` object to its `children` function when the URL changes.

```js
import History from 'react-history/BrowserHistory'

const App = React.createClass({
  render() {
    return (
      <History>
        {({ history, action, location }) => (
          <p>The current URL is {location.path}</p>
        )}
      </History>
    )
  }
})
```

The `history` object contains a bunch of methods you can use to imperatively modify the URL. These include:

- `history.push(path, state)`
- `history.replace(path, state)`
- `history.go(n)`
- `history.goBack()`
- `history.goForward()`
- `history.canGo(n)` (only supported in `<MemoryHistory>`)

The `action` will always be one of `PUSH`, `REPLACE`, or `POP` and refers to the type of change that was made to the history "stack" in order to arrive at the current URL. Note that unlike the traditional abstract stack data type, a `POP` does not actually modify the size of the stack, only the current pointer or index.

The `location` is an object that has the following properties:

- `location.path` - The current URL path, including query string and hash fragment
- `location.state` - Extra state specific to this location (not supported in `<HashHistory>`)
- `location.key` - A string identifier specific to this location (not supported in `<HashHistory>`)

`react-history` also provides the following components that may be used to modify the current URL:

- `<Push>` - pushes a new entry onto the history stack
- `<Replace>` - replaces the current entry on the history stack with a new one
- `<Pop>` - modifies the current pointer or index into the history stack
- `<Back>` - moves back one entry in the history, shorthand for `<Pop go={-1}/>`
- `<Forward>` - moves forward one entry in the history, shorthand for `<Pop go={1}/>`

These components are called "action" components because they modify the URL. When any of these are rendered, the URL updates and `<History>` objects emit a new location.

For example, you could build a simple `<Link>` component using a `<Push>`:

```js
import React, { PropTypes } from 'react'
import { Push } from 'react-history'

const Link = React.createClass({
  propTypes: {
    to: PropTypes.string.isRequired
  },

  getInitialState() {
    return { wasClicked: false }
  },

  render() {
    const { to, ...props } = this.props

    // If the <Link> was clicked, update the URL!
    if (this.state.wasClicked)
      return <Push path={to}/>

    return (
      <span {...props} onClick={() => this.setState({ wasClicked: true })}/>
    )
  }
})
```

**Note:** This `<Link>` implementation is for demonstration purposes only. It is not accessible and does not include many of the nice features of a real hyperlink. If you're looking for a proper `<Link>` implementation, [please use `react-router`](https://www.npmjs.com/package/react-router).

TODO: MOAR DOCS!!!
