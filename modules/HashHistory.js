import React, { PropTypes } from 'react'
import createHistory from 'history/createHashHistory'
import History from './History'

const HashHistory = ({ children, ...props }) => (
  <History {...createHistory(props)} children={children}/>
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
