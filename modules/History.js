import React, { PropTypes } from 'react'
import {
  historyContext as historyContextType
} from './PropTypes'

/**
 * The common public API for all *History components.
 */
class History extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    createHistory: PropTypes.func.isRequired,
    historyOptions: PropTypes.object
  }

  static childContextTypes = {
    history: historyContextType.isRequired
  }

  getChildContext() {
    return {
      history: this.getHistoryContext()
    }
  }

  getHistoryContext() {
    const { action, location } = this.state
    const { history } = this

    return {
      action,
      location,
      ...history
    }
  }

  state = {
    action: null,
    location: null
  }

  componentWillMount() {
    this.setupHistory(this.props)
  }

  setupHistory(props) {
    const { createHistory, historyOptions } = props

    this.history = createHistory(historyOptions)

    this.setState({
      action: 'POP',
      location: this.history.getCurrentLocation()
    })

    this.unlisten = this.history.listen((location, action) => {
      this.setState({ action, location })
    })
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
    return this.props.children(this.getHistoryContext())
  }
}

export default History
