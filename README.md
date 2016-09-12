# react-history [![Travis][build-badge]][build] [![npm package][npm-badge]][npm]

[build-badge]: https://img.shields.io/travis/ReactTraining/react-history/master.svg?style=flat-square
[build]: https://travis-ci.org/ReactTraining/react-history

[npm-badge]: https://img.shields.io/npm/v/react-history.svg?style=flat-square
[npm]: https://www.npmjs.com/package/react-history

[`react-history`](https://www.npmjs.com/package/react-history) provides tools to manage session history using [React](https://facebook.github.io/react). It's a thin wrapper around the [`history`](https://www.npmjs.com/package/history) package. In web browsers, this library also transparently manages changes to the URL which makes it easier for creators of single-page applications to support things like bookmarks and the back button.

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

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/react-history/umd/react-history.min.js"></script>
```

You can find the library on `window.ReactHistory`.

## Usage

`react-history` ships with 3 different history components that you can use depending on your environment.

- `<BrowserHistory>` is for use in modern web browsers that support the [HTML5 history API](http://diveintohtml5.info/history.html) (see [cross-browser compatibility](http://caniuse.com/#feat=history))
- `<MemoryHistory>` is used as a reference implementation and may also be used in non-DOM environments, like [React Native](https://facebook.github.io/react-native/)
- `<HashHistory>` is for use in legacy web browsers

Depending on the method you want to use to keep track of history, you'll `import` (or `require`) one of these methods directly from the package root (i.e. `history/BrowserHistory`). For the sake of brevity, the term `<History>` in this document refers to any of these implementations.

Basic usage looks like this:

```js
import History from 'react-history/BrowserHistory'

const App = React.createClass({
  render() {
    return (
      <History>
        {({ history, action, location }) => (
          <p>The current URL is {location.pathname}{location.search}{location.hash}. You arrived at this URL via a {action} action.</p>
        )}
      </History>
    )
  }
})
```

The props for each `<History>`, along with their default values are:

```js
<BrowserHistory
  basename=""               // The base URL of the app (see below)
  forceRefresh={false}      // Set true to force full page refreshes
  keyLength={6}             // The length of location.key
  // A function to use to confirm navigation with the user (see below)
  getUserConfirmation={(message, callback) => callback(window.confirm(message))}
/>

<MemoryHistory
  initialEntries={[ '/' ]}  // The initial URLs in the history stack
  initialIndex={0}          // The starting index in the history stack
  keyLength={6}             // The length of location.key
  // A function to use to confirm navigation with the user. Required
  // if you return string prompts from transition hooks (see below)
  getUserConfirmation={null}
/>

<HashHistory
  basename=""               // The base URL of the app (see below)
  hashType="slash"          // The hash type to use (see below)
  // A function to use to confirm navigation with the user (see below)
  getUserConfirmation={(message, callback) => callback(window.confirm(message))}
/>
```

### Listening

When you render a `<History>` it will emit an object with an `action` and a `location` object to its `children` function when the URL changes.

```js
<History>
  {({ history, action, location }) => (
    <div>
      <p>The current URL is {location.pathname}{location.search}{location.hash}.</p>
      <p>You arrived at this URL via a {action} action.</p>
    </div>
  )}
</History>
```

The `history` object is the same object you'd get if you created your own [`history` object](https://npmjs.com/package/history) directly. Please refer to [the `history` docs](https://github.com/mjackson/history/blob/master/README.md) for more information on how to use it. The `location` and `action` properties are also provided for convenience.

### Navigation

`react-history` also provides the following components that may be used to modify the current URL:

- `<Push>` pushes a new entry onto the history stack
- `<Replace>` replaces the current entry on the history stack with a new one
- `<Pop>` modifies the current pointer or index into the history stack
- `<Back>` moves back one entry in the history, shorthand for `<Pop go={-1}/>`
- `<Forward>` moves forward one entry in the history, shorthand for `<Pop go={1}/>`

These components are called "action" components because they modify the URL. When any of these are rendered, the URL updates and `<History>` objects emit a new location.

`<Push>` and `<Replace>` accept either:

- `path` and `state` props *or*
- a `location` prop

```js
// Push a new entry onto the history stack.
<Push path="/home?the=query#the-hash" state={{ some: 'state' }}/>

// Use a location-like object to push a new entry onto the stack.
<Push location={{
  pathname: '/home',
  search: '?the=query',
  hash: '#the-hash'
  state: { some: 'state' }
}}/>
```

**Note:** Location state is not supported using `<HashHistory>`.

For example, you could build a very simple `<Link>` component using a `<Push>`:

```js
import React, { PropTypes } from 'react'
import { Push } from 'react-history/Actions'

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

### Blocking Transitions

`react-history` lets you register a prompt message that will be shown to the user before location listeners are notified. This allows you to make sure the user wants to leave the current page before they navigate away. You do this by rendering a `<Prompt>` component.

```js
import Prompt from 'react-history/Prompt'

const Form = React.createClass({
  getInitialState() {
    return { inputText: '' }
  },

  handleChange(event) {
    this.setState({ inputText: event.target.value })
  },

  render() {
    const { inputText } = this.state

    return (
      <form>
        <Prompt
          message="Are you sure you want to leave before submitting the form?"
          when={inputText}
        />
        <input
          type="text"
          defaultValue={inputText}
          onChange={this.handleChange}
        />
      </form>
    )
  }
})
```

**Note:** You'll need to provide a `getUserConfirmation` prop to use `<Prompt>`s with `<MemoryHistory>` (see [the `history` docs](https://github.com/mjackson/history#customizing-the-confirm-dialog)).

### Using a Base URL

If all the URLs in your app are relative to some other "base" URL, use the `basename` option. This option transparently adds the given string to the front of all URLs you use.

```js
// All URLs transparently have the "/the/base" prefix.
<History basename="/the/base">
{({ location }) => (
  // When the URL is /the/base/home, location.pathname is just /home.
  <p>The current pathname is {location.pathname}.</p>
)}
</History>
```

**Note:** `basename` is not suppported in `<MemoryHistory>` where you have full control over all your URLs.

### Forcing Full Page Refreshes in `<BrowserHistory>`

By default `<BrowserHistory>` uses HTML5 `pushState` and `replaceState` to prevent reloading the entire page from the server while navigating around. If instead you would like to reload as the URL changes, use the `forceRefresh` option.

```js
<BrowserHistory forceRefresh/>
```

### Modifying the Hash Type in `<HashHistory>`

By default `<HashHistory>` uses a leading slash in hash-based URLs. You can use the `hashType` option to use a different hash formatting.


```js
// The default is to add a leading / to all hashes, so your URLs
// are like /#/inbox/5. This is also know as the "slash" hash type.
<HashHistory hashType="slash"/>

// You can also omit the leading slash using the "noslash" hash type.
// This gives you URLs like /#inbox/5.
<HashHistory hashType="noslash"/>

// Support for Google's legacy AJAX URL "hashbang" format gives you
// URLs like /#!/inbox/5.
<HashHistory hashType="hashbang"/>
```

## Thanks

Thanks to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to run our build in real browsers.
