import React, { PropTypes } from 'react'
import createHistory from 'history/createMemoryHistory'
import History from './History'

const MemoryHistory = ({ children, ...props }) => (
  <History {...createHistory(props)} children={children}/>
)

MemoryHistory.propTypes = {
  children: PropTypes.func.isRequired,
  getUserConfirmation: PropTypes.func,
  initialEntries: PropTypes.array,
  initialIndex: PropTypes.number,
  keyLength: PropTypes.number
}

export default MemoryHistory
