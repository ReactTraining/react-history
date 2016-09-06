import React, { PropTypes } from 'react'
import createHashHistory from 'history/createHashHistory'
import History from './History'

const HashHistory = ({ children, ...historyOptions}) => (
  <History
    children={children}
    createHistory={createHashHistory}
    historyOptions={historyOptions}
  />
)

HashHistory.propTypes = {
  children: PropTypes.func.isRequired,
  basename: PropTypes.string,
  getUserConfirmation: PropTypes.func,
  hashType: PropTypes.oneOf([
    'hashbang',
    'noslash',
    'slash'
  ])
}

export default HashHistory
