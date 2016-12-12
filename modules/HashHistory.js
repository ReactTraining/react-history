import React, { PropTypes } from 'react'
import createHashHistory from 'history/createHashHistory'
import {
  history as historyType
} from './PropTypes'

/**
 * Manages session history using window.location.hash.
 */
class HashHistory extends React.Component {
  static propTypes = {
    basename: PropTypes.string,
    getUserConfirmation: PropTypes.func,
    hashType: PropTypes.oneOf([
      'hashbang',
      'noslash',
      'slash'
    ]),
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]).isRequired
  }

  static childContextTypes = {
    history: historyType.isRequired
  }

  getChildContext() {
    return { history: this.history }
  }

  componentWillMount() {
    const { basename, getUserConfirmation, hashType } = this.props

    this.history = createHashHistory({
      basename,
      getUserConfirmation,
      hashType
    })

    // Do this here so we catch actions in cDM.
    this.unlisten = this.history.listen(() => this.forceUpdate())
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const { children } = this.props

    if (typeof children !== 'function')
      return React.Children.only(children)

    return children(this.history)
  }
}

export default HashHistory
