import React, { PropTypes } from 'react'
import {
  history as historyType
} from './PropTypes'

export default {
  // static
  propTypes: {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]).isRequired
  },

  // static
  childContextTypes: {
    history: historyType.isRequired
  },

  getChildContext() {
    return {
      history: this.history
    }
  },

  componentWillMount() {
    // Do this here so we catch actions in cDM.
    this.unlisten = this.history.listen(() => this.forceUpdate())
  },

  componentWillUnmount() {
    this.unlisten()
  },

  render() {
    const { children } = this.props

    if (typeof children !== 'function')
      return React.Children.only(children)

    return children({
      action: this.history.action,
      location: this.history.location,
      history: this.history
    })
  },
}
