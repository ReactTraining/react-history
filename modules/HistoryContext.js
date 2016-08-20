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
    return {
      history: {
        prompt: this.prompt,
        push: this.push,
        replace: this.replace,
        go: this.go,
        goBack: this.goBack,
        goForward: this.goForward
      }
    }
  }

  prompt = (...args) =>
    this.props.prompt(...args)

  push = (...args) =>
    this.props.push(...args)

  replace = (...args) =>
    this.props.replace(...args)

  go = (...args) =>
    this.props.go(...args)

  goBack = () =>
    this.go(-1)

  goForward = () =>
    this.go(1)

  render() {
    const { children, action, location } = this.props

    const { path, ...everythingElse } = location
    const { pathname, search, hash } = parsePath(path)

    return children({
      history: this.getChildContext().history,
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
