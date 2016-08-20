import React, { PropTypes } from 'react'
import { parsePath } from './PathUtils'
import {
  action as actionType,
  historyContext as historyContextType,
  location as locationType
} from './PropTypes'

/**
 * The common public API for all *History components.
 */
class HistoryContext extends React.Component {
  static propTypes = {
    action: actionType.isRequired,
    location: locationType.isRequired,
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
    const { action, location, historyContext, children } = this.props

    const { path, ...everythingElse } = location
    const { pathname, search, hash } = parsePath(path)

    return children({
      history: historyContext,
      action,
      location: {
        ...everythingElse,
        pathname,
        search,
        hash
      }
    })
  }
}

export default HistoryContext
