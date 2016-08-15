# react-history [![npm package][npm-badge]][npm]

[npm-badge]: https://img.shields.io/npm/v/react-history.svg?style=flat-square
[npm]: https://www.npmjs.org/package/react-history

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
