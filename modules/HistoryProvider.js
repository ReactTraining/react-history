import React, { PropTypes } from 'react'
import {
  historyContext as historyContextType
} from './PropTypes'

/**
 * The common public API for all *History components.
 */
class HistoryProvider extends React.Component {
  static propTypes = {
    historyContext: historyContextType.isRequired,
    children: PropTypes.func.isRequired
  }

  static childContextTypes = {
    history: historyContextType.isRequired
  }

  getChildContext() {
    return {
      history: this.props.historyContext
    }
  }

  render() {
    const { historyContext, children } = this.props
    const { action, location, ...history } = historyContext

    return children({
      history,
      action,
      location
    })
  }
}

export default HistoryProvider
