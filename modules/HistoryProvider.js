import React, { PropTypes } from 'react'
import {
  history as historyType
} from './PropTypes'

/**
 * The common public API for all *History components.
 */
class HistoryProvider extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]).isRequired,
    history: PropTypes.object.isRequired
  }

  static childContextTypes = {
    history: historyType.isRequired
  }

  getChildContext() {
    return {
      history: this.props.history
    }
  }

  componentWillMount() {
    this.unlisten = this.props.history.listen(() => this.forceUpdate())
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const { children, history } = this.props

    if (typeof children !== 'function')
      return React.Children.only(children)

    return children({
      action: history.action,
      location: history.location,
      history
    })
  }
}

export default HistoryProvider
