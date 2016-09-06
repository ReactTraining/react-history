import React, { PropTypes } from 'react'
import createMemoryHistory from 'history/createMemoryHistory'
import History from './History'

const MemoryHistory = ({ children, ...historyOptions }) => (
  <History
    children={children}
    createHistory={createMemoryHistory}
    historyOptions={historyOptions}
  />
)

MemoryHistory.propTypes = {
  children: PropTypes.func.isRequired,
  getUserConfirmation: PropTypes.func,
  initialEntries: PropTypes.array,
  initialIndex: PropTypes.number,
  keyLength: PropTypes.number
}

export default MemoryHistory
