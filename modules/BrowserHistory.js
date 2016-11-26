import React, { PropTypes } from 'react'
import createBrowserHistory from 'history/createBrowserHistory'
import HistoryProvider from './HistoryProvider'

class BrowserHistory extends React.Component {
  static propTypes = {
    basename: PropTypes.string,
    forceRefresh: PropTypes.bool,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number
  }

  componentWillMount() {
    const { basename, forceRefresh, getUserConfirmation, keyLength } = this.props

    this.history = createBrowserHistory({
      basename,
      forceRefresh,
      getUserConfirmation,
      keyLength
    })
  }

  render() {
    return <HistoryProvider {...this.props} history={this.history}/>
  }
}

export default BrowserHistory
