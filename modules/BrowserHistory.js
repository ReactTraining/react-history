import warning from 'warning'
import invariant from 'invariant'
import React, { PropTypes } from 'react'
import HistoryContext from './HistoryContext'
import {
  addEventListener,
  removeEventListener,
  supportsHistory,
  supportsPopStateOnHashChange
} from './DOMUtils'

const PopStateEvent = 'popstate'
const HashChangeEvent = 'hashchange'

const getHistoryState = () => {
  try {
    return window.history.state || {}
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    return {}
  }
}

/**
 * A history that uses the HTML5 history API with automatic fallback
 * to full page refreshes in older browsers.
 */
class BrowserHistory extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    keyLength: PropTypes.number
  }

  static defaultProps = {
    keyLength: 6
  }

  state = {
    action: null,
    location: null,
    allKeys: null
  }

  createKey() {
    return Math.random().toString(36).substr(2, this.props.keyLength)
  }

  createLocation(historyState) {
    const { key, state } = (historyState || {})
    const { pathname, search, hash } = window.location

    return {
      path: pathname + search + hash,
      state,
      key
    }
  }

  handlePrompt = (prompt) => {
    invariant(
      typeof prompt === 'function' || typeof prompt === 'string',
      'A <BrowserHistory> prompt must be a function or a string'
    )

    warning(
      this.prompt == null,
      '<BrowserHistory> supports only one <Prompt> at a time'
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
    const action = 'PUSH'
    const key = this.createKey()
    const location = {
      path,
      state,
      key
    }

    this.confirmTransitionTo(action, location, (ok) => {
      if (!ok)
        return

      if (this.supportsHistory) {
        window.history.pushState({ key, state }, null, path)

        this.setState(prevState => {
          const prevKeys = prevState.allKeys
          const prevIndex = prevKeys.indexOf(prevState.location.key)

          const allKeys = prevKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1)
          allKeys.push(location.key)

          return {
            action,
            location,
            allKeys
          }
        })
      } else {
        warning(
          state === undefined,
          '<BrowserHistory> cannot push state in browsers that do not support HTML5 history'
        )

        window.location.href = path
      }
    })
  }

  handleReplace = (path, state) => {
    const action = 'REPLACE'
    const key = this.createKey()
    const location = {
      path,
      state,
      key
    }

    this.confirmTransitionTo(action, location, (ok) => {
      if (!ok)
        return

      if (this.supportsHistory) {
        window.history.replaceState({ key, state }, null, path)

        this.setState(prevState => {
          const allKeys = prevState.allKeys.slice(0)
          const prevIndex = allKeys.indexOf(prevState.location.key)

          if (prevIndex !== -1)
            allKeys[prevIndex] = location.key

          return {
            action,
            location,
            allKeys
          }
        })
      } else {
        warning(
          state === undefined,
          '<BrowserHistory> cannot replace state in browsers that do not support HTML5 history'
        )

        window.location.replace(path)
      }
    })
  }

  handleGo = (n) => {
    window.history.go(n)
  }

  handlePopState = (event) => {
    if (event.state === undefined)
      return // Ignore extraneous popstate events in WebKit.

    const action = 'POP'
    const location = this.createLocation(event.state)

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

  handleHashChange = () => {
    const action = 'POP' // Best guess.
    const location = this.createLocation(getHistoryState())

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

  revertPop(popLocation) {
    const { location, allKeys } = this.state

    // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    let toIndex = allKeys.indexOf(location.key)

    if (toIndex === -1)
      toIndex = 0

    let fromIndex = allKeys.indexOf(popLocation.key)

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
      this.supportsHistory = supportsHistory()
      this.needsHashChangeListener = !supportsPopStateOnHashChange()

      const location = this.createLocation(getHistoryState())

      this.setState({
        action: 'POP',
        location,
        allKeys: [ location.key ]
      })
    } else {
      warning(
        false,
        '<BrowserHistory> works only in DOM environments'
      )
    }
  }

  componentDidMount() {
    addEventListener(window, PopStateEvent, this.handlePopState)

    if (this.needsHashChangeListener)
      addEventListener(window, HashChangeEvent)
  }

  componentWillUnmount() {
    removeEventListener(window, PopStateEvent, this.handlePopState)

    if (this.needsHashChangeListener)
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

export default BrowserHistory
