import React, { PropTypes } from 'react'
import {
  historyContext as historyContextType
} from './PropTypes'

/**
 * The common public API for all *History components.
 */
class History extends React.Component {
  static childContextTypes = {
    history: historyContextType.isRequired
  }

  getChildContext() {
    return {
      history: this.history
    }
  }

  setupHistory(props) {
    const { createHistory, historyOptions } = props
    this.history = createHistory(historyOptions)
    this.unlisten = this.history.listen(() => this.forceUpdate())
  }

  componentWillMount() {
    this.setupHistory(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const prevHistoryOptions = this.props.historyOptions
    const nextHistoryOptions = nextProps.historyOptions

    // TODO: Each type of history should have the ability to determine
    // whether a prop change requires creation of a new history object.
    // For example, <MemoryHistory> doesn't need a new history instance
    // when the initialEntries prop changes.
    let changed = false
    for (const key in nextHistoryOptions) {
      if (nextHistoryOptions[key] !== prevHistoryOptions[key]) {
        changed = true
        break
      }
    }

    if (changed) {
      this.unlisten()
      this.setupHistory(nextProps)
    }
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const history = this.history
    const { location, action } = history

    return this.props.children({
      history,
      location,
      action
    })
  }
}

if (__DEV__) {
  History.propTypes = {
    children: PropTypes.func.isRequired,
    createHistory: PropTypes.func.isRequired,
    historyOptions: PropTypes.object
  }
}

export default History
