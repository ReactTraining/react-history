import { PropTypes } from 'react'
import createBrowserHistory from 'history/createBrowserHistory'
import createHistoryProvider from './createHistoryProvider'

/**
 * Manages session history using the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */
const BrowserHistory = createHistoryProvider(
  {
    basename: PropTypes.string,
    forceRefresh: PropTypes.bool,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number
  },
  ({ basename, forceRefresh, getUserConfirmation, keyLength }) => createBrowserHistory({
    basename,
    forceRefresh,
    getUserConfirmation,
    keyLength
  })
)

export default BrowserHistory
