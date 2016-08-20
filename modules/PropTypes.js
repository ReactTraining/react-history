import { PropTypes } from 'react'

export const action = PropTypes.oneOf([
  'PUSH',
  'REPLACE',
  'POP'
])

export const historyContext = PropTypes.shape({
  prompt: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  go: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  canGo: PropTypes.func
})

export const location = PropTypes.shape({
  path: PropTypes.string.isRequired,
  state: PropTypes.object,
  key: PropTypes.string
})
