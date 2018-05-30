import React from "react"
import PropTypes from "prop-types"
import createBrowserHistory from "history/createBrowserHistory"
import { history as historyType } from "./PropTypes"

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
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
  }

  static childContextTypes = {
    history: historyType.isRequired
  }

  getChildContext() {
    return { history: this.history }
  }

  componentWillMount() {
    const {
      basename,
      forceRefresh,
      getUserConfirmation,
      keyLength
    } = this.props

    this.history = createBrowserHistory({
      basename,
      forceRefresh,
      getUserConfirmation,
      keyLength
    })

    // Do this here so we catch actions in cDM.
    this.unlisten = this.history.listen(() => this.forceUpdate())
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const { children } = this.props

    return typeof children === "function"
      ? children(this.history)
      : React.Children.only(children)
  }
}

export default BrowserHistory
