import warning from 'warning'
import React, { PropTypes } from 'react'
import { locationsAreEqual } from './LocationUtils'
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
    confirm: PropTypes.func,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    go: PropTypes.func.isRequired,
    revert: PropTypes.func.isRequired
  }

  static defaultProps = {
    confirm: (callback) => callback(true)
  }

  static childContextTypes = {
    history: historyContextType.isRequired
  }

  getChildContext() {
    const { push, replace, go } = this.props

    return {
      history: {
        push,
        replace,
        go,
        prompt: this.prompt
      }
    }
  }

  prompt = (block) => {
    warning(
      this.block == null,
      'You should not render more than one <Prompt> at a time; previous ones will be overwritten'
    )

    this.block = block

    return () => {
      if (this.block === block)
        this.block = null
    }
  }

  state = {
    action: null,
    location: null
  }

  componentWillMount() {
    this.isBlocked = false

    const { action, location } = this.props

    this.setState({
      action,
      location
    })
  }

  confirmTransition(action, location, callback) {
    const block = this.block

    if (typeof block === 'function') {
      block({ action, location }, callback)
    } else if (typeof block === 'string') {
      this.props.confirm(block, callback)
    } else {
      callback(true)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { action, location } = nextProps

    if (!locationsAreEqual(this.props.location, location)) {
      if (this.isBlocked) {
        // Unblock after a revert.
        this.isBlocked = false
      } else {
        this.isBlocked = true

        this.confirmTransition(action, location, (ok) => {
          if (ok) {
            this.isBlocked = false

            this.setState({
              action,
              location
            })
          } else {
            // Remain blocked so we ignore the next prop change as well.
            this.props.revert()
          }
        })
      }
    }
  }

  shouldComponentUpdate() {
    return !this.isBlocked
  }

  render() {
    const { action, location } = this.state

    return this.props.children({
      action,
      location
    })
  }
}

export default HistoryContext
