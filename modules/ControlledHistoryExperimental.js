import React, { PropTypes } from 'react'
import { historyContext as historyContextType } from './PropTypes'
import { locationsAreEqual } from './LocationUtils'

const initialKeys = [ undefined ]

class ControlledHistory extends React.Component {

  static propTypes = {
    children: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    action: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    restoreKeys: PropTypes.func.isRequired,
    saveKeys: PropTypes.func.isRequired
  }

  static childContextTypes = {
    history: historyContextType.isRequired
  }

  static defaultProps = {
    restoreKeys: () => initialKeys,
    saveKeys: () => {}
  }

  getChildContext() {
    return {
      history: this.props.history
    }
  }

  constructor(props) {
    super(props)
    const location = props.history.location
    const shouldRestoreKeys = !!location.key
    this.updatingFromHistoryChange = false
    this.syncingHistory = false
    this.keys = shouldRestoreKeys ? props.restoreKeys() : initialKeys
    this.setupHistory()
    this.state = {
      location,
      action: 'POP'
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.syncingHistory &&
      !this.updatingFromHistoryChange &&
      !locationsAreEqual(
        nextProps.location,
        this.props.location
      )
    ) {
      this.syncingHistory = true
      const { history } = this.props
      const { action, location } = nextProps
      const nextIndex = this.keys.indexOf(location.key)
      if (location.key && nextIndex !== -1) {
        // we've been here before
        const currentIndex = this.keys.indexOf(this.props.location.key)
        const delta = nextIndex - currentIndex
        history.go(delta)
      } else if (action === 'PUSH') {
        history.push(location)
      } else if (action === 'REPLACE') {
        history.replace(location)
      }
    }
  }

  setupHistory() {
    this.props.history.listen((location, action) => {
      this.storeKey(location.key, action)
      this.updatingFromHistoryChange = true // must come before onChange!
      if (this.syncingHistory) {
        this.props.onChange(location, 'SYNC')
      } else {
        this.props.onChange(location, action)
      }
      this.setState({ location, action }, () => {
        this.updatingFromHistoryChange = false
        if (this.syncingHistory) {
          this.syncingHistory = false
        } else {
          this.checkIfLocationAccepted()
        }
      })
    })
  }

  checkIfLocationAccepted() {
    const { location } = this.props
    const { location:stateLocation, action:stateAction } = this.state
    if (!locationsAreEqual(location, stateLocation)) {
      this.syncingHistory = true
      const index = this.keys.indexOf(location.key)
      const stateIndex = this.keys.indexOf(stateLocation.key)
      const delta = index - stateIndex
      if (stateAction === 'REPLACE') {
        this.props.history.replace(location)
      } else {
        if (stateIndex === -1) {
          // playing whack-a-mole here D: after we pop off the last key a
          // few lines down, if they click "forward" we won't find the key
          // so let's just do a -1 for delta.
          this.props.history.go(-1)
        } else {
          this.props.history.go(delta)
        }
        if (stateAction === 'PUSH') {
          // get rid of the last entry so our delta isn't off if they try to
          // push here again
          this.keys.pop()
        }
      }
    }
  }

  storeKey(key, action) {
    if (action === 'PUSH') {
      this.keys.push(key)
    } else if (action === 'REPLACE') {
      this.keys[this.keys.length - 1] = key
    }
    // browsers only keep 50 entries, so we'll do that too
    if (this.keys.length > 50)
      this.keys.unshift()
    this.props.saveKeys(this.keys)
  }

  render() {
    const { history, location, action } = this.props
    return this.props.children({
      history,
      location,
      action
    })
  }
}

export default ControlledHistory
