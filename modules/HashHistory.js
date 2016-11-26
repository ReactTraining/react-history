import React, { PropTypes } from 'react'
import createHashHistory from 'history/createHashHistory'
import HistoryProvider from './HistoryProvider'

class HashHistory extends React.Component {
  static propTypes = {
    basename: PropTypes.string,
    getUserConfirmation: PropTypes.func,
    hashType: PropTypes.oneOf([
      'hashbang',
      'noslash',
      'slash'
    ])
  }

  componentWillMount() {
    const { basename, getUserConfirmation, hashType } = this.props

    this.history = createHashHistory({
      basename,
      getUserConfirmation,
      hashType
    })
  }

  render() {
    return <HistoryProvider {...this.props} history={this.history}/>
  }
}

export default HashHistory
