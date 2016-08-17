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
    children: PropTypes.func.isRequired,
    action: actionType.isRequired,
    location: locationType.isRequired,
    prompt: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    go: PropTypes.func.isRequired
  }

  static childContextTypes = {
    history: historyContextType.isRequired
  }

  getChildContext() {
    const { prompt, push, replace, go } = this.props

    return {
      history: {
        prompt,
        push,
        replace,
        go
      }
    }
  }

  render() {
    const { action, location } = this.props

    const { path, ...everythingElse } = location
    const { pathname, search, hash } = parsePath(path)

    return this.props.children({
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
