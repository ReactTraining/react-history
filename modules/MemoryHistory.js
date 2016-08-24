import warning from 'warning'
import invariant from 'invariant'
import React, { PropTypes } from 'react'
import { createKey } from './LocationKeys'
import HistoryProvider from './HistoryProvider'

const clamp = (n, lowerBound, upperBound) =>
  Math.min(Math.max(n, lowerBound), upperBound)

/**
 * A history that stores its own URL entries.
 */
class MemoryHistory extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    getUserConfirmation: PropTypes.func,
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number,
    keyLength: PropTypes.number,
  }

  static defaultProps = {
    initialEntries: [ '/' ],
    initialIndex: 0,
    keyLength: 6
  }

  state = {
    prevIndex: null,
    action: null,
    index: null,
    entries: null
  }

  createKey() {
    return createKey(this.props.keyLength)
  }

  block = (prompt) => {
    invariant(
      typeof prompt === 'string' || typeof prompt === 'function',
      'A <MemoryHistory> prompt must be a string or a function'
    )

    warning(
      this.prompt == null,
      '<MemoryHistory> supports only one <Prompt> at a time'
    )

    this.prompt = prompt

    return () => {
      if (this.prompt === prompt)
        this.prompt = null
    }
  }

  confirmTransitionTo(action, location, callback) {
    let prompt = this.prompt

    if (prompt) {
      if (typeof prompt === 'function')
        prompt = prompt(location, action)

      if (this.props.getUserConfirmation) {
        this.props.getUserConfirmation(prompt, callback)
      } else {
        warning(
          false,
          '<MemoryHistory> needs a getUserConfirmation prop in order to use a <Prompt>'
        )
      }
    } else {
      callback(true)
    }
  }

  push = (path, state) => {
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

      this.setState(prevState => {
        const prevIndex = prevState.index
        const entries = prevState.entries.slice(0)

        const nextIndex = prevIndex + 1
        if (entries.length > nextIndex) {
          entries.splice(nextIndex, entries.length - nextIndex, location)
        } else {
          entries.push(location)
        }

        return {
          prevIndex: prevState.index,
          action,
          index: nextIndex,
          entries
        }
      })
    })
  }

  replace = (path, state) => {
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

      this.setState(prevState => {
        const prevIndex = prevState.index
        const entries = prevState.entries.slice(0)

        entries[prevIndex] = location

        return {
          prevIndex: prevState.index,
          action,
          entries
        }
      })
    })
  }

  go = (n) => {
    const { index, entries } = this.state
    const nextIndex = clamp(index + n, 0, entries.length - 1)

    const action = 'POP'
    const location = entries[nextIndex]

    this.confirmTransitionTo(action, location, (ok) => {
      if (ok) {
        this.setState({
          prevIndex: index,
          action,
          index: nextIndex
        })
      } else {
        // Mimic the behavior of DOM histories by
        // causing a render after a cancelled POP.
        this.forceUpdate()
      }
    })
  }

  goBack = () =>
    this.go(-1)

  goForward = () =>
    this.go(1)

  canGo = (n) => {
    const { index, entries } = this.state
    const nextIndex = index + n

    return nextIndex >= 0 && nextIndex < entries.length
  }

  componentWillMount() {
    const { initialEntries, initialIndex } = this.props

    // Normalize initialEntries based on type.
    const entries = initialEntries.map(entry => {
      if (typeof entry === 'string')
        return { path: entry }

      return entry
    })

    this.setState({
      action: 'POP',
      index: clamp(initialIndex, 0, initialEntries.length - 1),
      entries
    })
  }

  render() {
    const { children } = this.props
    const { action, index, entries } = this.state
    const location = entries[index]
    const historyContext = {
      action,
      location,
      block: this.block,
      push: this.push,
      replace: this.replace,
      go: this.go,
      goBack: this.goBack,
      goForward: this.goForward,
      canGo: this.canGo
    }

    return (
      <HistoryProvider
        historyContext={historyContext}
        children={children}
      />
    )
  }
}

export default MemoryHistory
