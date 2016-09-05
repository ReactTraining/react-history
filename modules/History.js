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
    const { createHistory, children, ...historyOptions } = props // eslint-disable-line
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
    const { children:_1, createHistory:_2, ...prevHistoryOptions } = this.props // eslint-disable-line
    const { children:_3, createHistory:_4, ...nextHistoryOptions } = nextProps // eslint-disable-line
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
    const { action, location, ...history } = this.getHistoryContext()

    return this.props.children({
      action,
      location,
      history
    })
  }
}

export default History
