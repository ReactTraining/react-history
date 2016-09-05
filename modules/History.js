import React, { PropTypes } from 'react'
import {
  historyContext as historyContextType
} from './PropTypes'

/**
 * The common public API for all *History components.
 */
class History extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    getCurrentLocation: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    go: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    goForward: PropTypes.func.isRequired,
    canGo: PropTypes.func,
    block: PropTypes.func.isRequired,
    listen: PropTypes.func.isRequired
  }

  static childContextTypes = {
    history: historyContextType.isRequired
  }

  getChildContext() {
    return {
      history: this.getHistoryContext()
    }
  }

  getHistoryContext() {
    const { action, location } = this.state
    const { push, replace, go, goBack, goForward, canGo, block } = this.props

    return {
      action,
      location,
      push,
      replace,
      go,
      goBack,
      goForward,
      canGo,
      block
    }
  }

  state = {
    action: null,
    location: null
  }

  componentWillMount() {
    this.setState({
      action: 'POP',
      location: this.props.getCurrentLocation()
    })

    this.unlisten = this.props.listen((location, action) => {
      this.setState({ action, location })
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const { action, location, ...history } = this.getHistoryContext()

    return this.props.children({
      action,
      location,
      history
    })
  }
}

export default History
