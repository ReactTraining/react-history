import React, { PropTypes } from 'react'
import createBrowserHistory from 'history/createBrowserHistory'
import History from './History'

const BrowserHistory = ({ children, ...historyOptions }) => (
  <History
    children={children}
    createHistory={createBrowserHistory}
    historyOptions={historyOptions}
  />
)

BrowserHistory.propTypes = {
  children: PropTypes.func.isRequired,
  basename: PropTypes.string,
  forceRefresh: PropTypes.bool,
  getUserConfirmation: PropTypes.func,
  keyLength: PropTypes.number
}

export default BrowserHistory
