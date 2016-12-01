import React, { PropTypes } from 'react'
import createBrowserHistory from 'history/createBrowserHistory'
import ProviderHelpers from './ProviderHelpers'

/**
 * Manages session history using the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */
class BrowserHistory extends React.Component {
  static propTypes = {
    basename: PropTypes.string,
    forceRefresh: PropTypes.bool,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number,
    ...ProviderHelpers.propTypes
  }

  static childContextTypes = ProviderHelpers.childContextTypes

  getChildContext = ProviderHelpers.getChildContext

  componentWillMount() {
    const { basename, forceRefresh, getUserConfirmation, keyLength } = this.props

    this.history = createBrowserHistory({
      basename,
      forceRefresh,
      getUserConfirmation,
      keyLength
    })

    ProviderHelpers.componentWillMount.call(this)
  }

  componentWillUnmount = ProviderHelpers.componentWillUnmount

  render = ProviderHelpers.render
}

export default BrowserHistory
