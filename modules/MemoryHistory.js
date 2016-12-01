import { PropTypes } from 'react'
import createMemoryHistory from 'history/createMemoryHistory'
import createHistoryProvider from './createHistoryProvider'

/**
 * Manages session history using in-memory storage.
 */
const MemoryHistory = createHistoryProvider(
  {
    getUserConfirmation: PropTypes.func,
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number,
    keyLength: PropTypes.number
  },
  ({ getUserConfirmation, initialEntries, initialIndex, keyLength }) => createMemoryHistory({
    getUserConfirmation,
    initialEntries,
    initialIndex,
    keyLength
  })
)

export default MemoryHistory
