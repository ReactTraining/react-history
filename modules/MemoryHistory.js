import React from "react"
import PropTypes from "prop-types"
import createMemoryHistory from "history/createMemoryHistory"
import { history as historyType } from "./PropTypes"

/**
 * Manages session history using in-memory storage.
 */
class MemoryHistory extends React.Component {
  static propTypes = {
    getUserConfirmation: PropTypes.func,
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number,
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
      getUserConfirmation,
      initialEntries,
      initialIndex,
      keyLength
    } = this.props

    this.history = createMemoryHistory({
      getUserConfirmation,
      initialEntries,
      initialIndex,
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

export default MemoryHistory
