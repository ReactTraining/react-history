import React, { PropTypes } from 'react'
import createMemoryHistory from 'history/createMemoryHistory'
import HistoryProvider from './HistoryProvider'

class MemoryHistory extends React.Component {
  static propTypes = {
    getUserConfirmation: PropTypes.func,
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number,
    keyLength: PropTypes.number
  }

  componentWillMount() {
    const { getUserConfirmation, initialEntries, initialIndex, keyLength } = this.props

    this.history = createMemoryHistory({
      getUserConfirmation,
      initialEntries,
      initialIndex,
      keyLength
    })
  }

  render() {
    return <HistoryProvider {...this.props} history={this.history}/>
  }
}

export default MemoryHistory
