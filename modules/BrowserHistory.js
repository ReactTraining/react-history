import React, { PropTypes } from 'react'
import createHistory from 'history/createBrowserHistory'
import History from './History'

const BrowserHistory = ({ children, ...props }) => (
  <History {...createHistory(props)} children={children}/>
)

BrowserHistory.propTypes = {
  children: PropTypes.func.isRequired,
  basename: PropTypes.string,
  forceRefresh: PropTypes.bool,
  getUserConfirmation: PropTypes.func,
  keyLength: PropTypes.number
}

export default BrowserHistory
