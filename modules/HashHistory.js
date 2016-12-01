import { PropTypes } from 'react'
import createHashHistory from 'history/createHashHistory'
import createHistoryProvider from './createHistoryProvider'
/**
 * Manages session history using window.location.hash.
 */
const HashHistory = createHistoryProvider(
  {
    basename: PropTypes.string,
    getUserConfirmation: PropTypes.func,
    hashType: PropTypes.oneOf([
      'hashbang',
      'noslash',
      'slash'
    ])
  },
  ({ basename, getUserConfirmation, hashType }) => createHashHistory({
    basename,
    getUserConfirmation,
    hashType
  })
)

export default HashHistory
