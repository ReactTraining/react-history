import React, { PropTypes } from 'react'
import createHashHistory from 'history/createHashHistory'
import ProviderHelpers from './ProviderHelpers'

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
    ...ProviderHelpers.propTypes
  }

  static childContextTypes = ProviderHelpers.childContextTypes

  getChildContext = ProviderHelpers.getChildContext

  componentWillMount() {
    const { basename, getUserConfirmation, hashType } = this.props

    this.history = createHashHistory({
      basename,
      getUserConfirmation,
      hashType
    })

    ProviderHelpers.componentWillMount.call(this)
  }

  componentWillUnmount = ProviderHelpers.componentWillUnmount

  render = ProviderHelpers.render
}

export default HashHistory
