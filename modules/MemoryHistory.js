import React, { PropTypes } from 'react'
import createMemoryHistory from 'history/createMemoryHistory'
import ProviderHelpers from './ProviderHelpers'

/**
 * Manages session history using in-memory storage.
 */
class MemoryHistory extends React.Component {
  static propTypes = {
    getUserConfirmation: PropTypes.func,
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number,
    keyLength: PropTypes.number,
    ...ProviderHelpers.propTypes
  }

  static childContextTypes = ProviderHelpers.childContextTypes

  getChildContext = ProviderHelpers.getChildContext

  componentWillMount() {
    const { getUserConfirmation, initialEntries, initialIndex, keyLength } = this.props

    this.history = createMemoryHistory({
      getUserConfirmation,
      initialEntries,
      initialIndex,
      keyLength
    })

    ProviderHelpers.componentWillMount.call(this)
  }

  componentWillUnmount = ProviderHelpers.componentWillUnmount

  render = ProviderHelpers.render
}

export default MemoryHistory
