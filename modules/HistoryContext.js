import React, { PropTypes } from 'react'
import { parsePath } from './PathUtils'
import {
  action as actionType,
  historyContext as historyContextType,
  location as locationType
} from './PropTypes'

const stripPrefix = (prefix, string) =>
  string.indexOf(prefix) === 0 ? string.substring(prefix.length) : string

/**
 * The common public API for all *History components.
 */
class HistoryContext extends React.Component {
  static propTypes = {
    basename: PropTypes.string,
    children: PropTypes.func.isRequired,
    action: actionType.isRequired,
    location: locationType.isRequired,
    prompt: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    go: PropTypes.func.isRequired
  }

  static defaultProps = {
    basename: ''
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

  push = (path, state) =>
    this.props.push(this.props.basename + path, state)

  replace = (path, state) =>
    this.props.replace(this.props.basename + path, state)

  go = (...args) =>
    this.props.go(...args)

  goBack = () =>
    this.go(-1)

  goForward = () =>
    this.go(1)

  render() {
    const { basename, children, action, location } = this.props

    const { path, ...everythingElse } = location
    const { pathname, search, hash } = parsePath(path)

    return children({
      action,
      location: {
        ...everythingElse,
        pathname: basename ? stripPrefix(basename, pathname) : pathname,
        search,
        hash
      }
    })
  }
}

export default HistoryContext
