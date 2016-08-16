import warning from 'warning'
import invariant from 'invariant'
import React, { PropTypes } from 'react'
import HistoryContext from './HistoryContext'
import {
  addEventListener,
  removeEventListener,
  supportsGoWithoutReloadUsingHash
} from './DOMUtils'
import {
  locationsAreEqual
} from './LocationUtils'

const HashChangeEvent = 'hashchange'

const addLeadingSlash = (path) =>
  path.charAt(0) === '/' ? path : '/' + path

const HashPathCoders = {
  hashbang: {
    encodePath: (path) => path.charAt(0) === '!' ? path : '!' + addLeadingSlash(path),
    decodePath: (path) => path.charAt(0) === '!' ? path.substring(1) : path
  },

  noslash: {
    encodePath: (path) => path.charAt(0) === '/' ? path.substring(1) : path,
    decodePath: addLeadingSlash
  },

  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
}

const getHashPath = () => {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  const href = window.location.href
  const hashIndex = href.indexOf('#')
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1)
}

const pushHashPath = (path) =>
  window.location.hash = path

const replaceHashPath = (path) => {
  const hashIndex = window.location.href.indexOf('#')

  window.location.replace(
    window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path
  )
}

/**
 * A history that uses the URL hash and hashchange event.
 */
class HashHistory extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    hashType: PropTypes.oneOf(Object.keys(HashPathCoders))
  }

  static defaultProps = {
    hashType: 'slash'
  }

  state = {
    action: null,
    location: null,
    allPaths: null
  }

  decodePath(path) {
    return HashPathCoders[this.props.hashType].decodePath(path)
  }

  encodePath(path) {
    return HashPathCoders[this.props.hashType].encodePath(path)
  }

  createLocation() {
    const path = this.decodePath(getHashPath())

    return {
      path
    }
  }

  handlePrompt = (prompt) => {
    invariant(
      typeof prompt === 'function' || typeof prompt === 'string',
      'A <HashHistory> prompt must be a function or a string'
    )

    warning(
      this.prompt == null,
      '<HashHistory> supports only one <Prompt> at a time'
    )

    this.prompt = prompt

    return () => {
      if (this.prompt === prompt)
        this.prompt = null
    }
  }

  confirmTransitionTo(action, location, callback) {
    const prompt = this.prompt

    if (typeof prompt === 'function') {
      prompt({ action, location }, callback)
    } else if (typeof prompt === 'string') {
      callback(window.confirm(prompt)) // eslint-disable-line no-alert
    } else {
      callback(true)
    }
  }

  handlePush = (path, state) => {
    warning(
      state === undefined,
      '<HashHistory> cannot push state; it will be dropped'
    )

    const action = 'PUSH'
    const location = {
      path
    }

    this.confirmTransitionTo(action, location, (ok) => {
      if (!ok)
        return

      const encodedPath = this.encodePath(path)
      const hashChanged = getHashPath() !== encodedPath

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other <HashHistory>s in the page will consider it a POP.
        this.ignorePath = path
        pushHashPath(encodedPath)
      }

      this.setState(prevState => {
        const prevPaths = prevState.allPaths
        const prevIndex = prevPaths.lastIndexOf(prevState.location.path)

        const allPaths = prevPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1)
        allPaths.push(location.path)

        return {
          action,
          location,
          allPaths
        }
      })
    })
  }

  handleReplace = (path, state) => {
    warning(
      state === undefined,
      '<HashHistory> cannot replace state; it will be dropped'
    )

    const action = 'REPLACE'
    const location = {
      path
    }

    this.confirmTransitionTo(action, location, (ok) => {
      if (!ok)
        return

      const encodedPath = this.encodePath(path)
      const hashChanged = getHashPath() !== encodedPath

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other <HashHistory>s in the page will consider it a POP.
        this.ignorePath = path
        replaceHashPath(encodedPath)
      }

      this.setState(prevState => {
        const allPaths = prevState.allPaths.slice(0)
        const prevIndex = allPaths.indexOf(prevState.location.path)

        if (prevIndex !== -1)
          allPaths[prevIndex] = location.path

        return {
          action,
          location,
          allPaths
        }
      })
    })
  }

  handleGo = (n) => {
    warning(
      this.goIsSupportedWithoutReload,
      '<HashHistory> go(n) causes a full page reload in this browser'
    )

    window.history.go(n)
  }

  handleHashChange = () => {
    const path = getHashPath()
    const encodedPath = this.encodePath(path)

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath)
    } else {
      const action = 'POP'
      const location = this.createLocation()
      const prevLocation = this.state.location

      if (!this.forceNextPop && locationsAreEqual(prevLocation, location))
        return // A hashchange doesn't always == location change.

      if (this.ignorePath === location.path)
        return // Ignore this change; we already setState in push/replace.

      this.ignorePath = null

      if (this.forceNextPop) {
        this.forceNextPop = false
        this.forceUpdate()
      } else {
        this.confirmTransitionTo(action, location, (ok) => {
          if (ok) {
            this.setState({
              action,
              location
            })
          } else {
            this.revertPop(location)
          }
        })
      }
    }
  }

  revertPop(popLocation) {
    const { location, allPaths } = this.state

    // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    let toIndex = allPaths.lastIndexOf(location.path)

    if (toIndex === -1)
      toIndex = 0

    let fromIndex = allPaths.lastIndexOf(popLocation.path)

    if (fromIndex === -1)
      fromIndex = 0

    const delta = toIndex - fromIndex

    if (delta) {
      this.forceNextPop = true
      window.history.go(delta)
    }
  }

  componentWillMount() {
    if (typeof window === 'object') {
      this.goIsSupportedWithoutReload = supportsGoWithoutReloadUsingHash()

      // Ensure the hash is encoded properly.
      const path = getHashPath()
      const encodedPath = this.encodePath(path)

      if (path !== encodedPath)
        replaceHashPath(encodedPath)

      const location = this.createLocation()

      this.setState({
        action: 'POP',
        location,
        allPaths: [ location.path ]
      })
    } else {
      warning(
        false,
        '<HashHistory> works only in DOM environments'
      )
    }
  }

  componentDidMount() {
    addEventListener(window, HashChangeEvent, this.handleHashChange)
  }

  componentWillUnmount() {
    removeEventListener(window, HashChangeEvent, this.handleHashChange)
  }

  render() {
    const { children } = this.props
    const { action, location } = this.state

    return (
      <HistoryContext
        children={children}
        action={action}
        location={location}
        prompt={this.handlePrompt}
        push={this.handlePush}
        replace={this.handleReplace}
        go={this.handleGo}
      />
    )
  }
}

export default HashHistory
