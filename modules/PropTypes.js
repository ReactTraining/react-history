import PropTypes from 'prop-types'

export const action = PropTypes.oneOf([
  'PUSH',
  'REPLACE',
  'POP'
])

export const location = PropTypes.shape({
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  state: PropTypes.object,
  key: PropTypes.string
})

export const history = PropTypes.shape({
  action: action.isRequired,
  location: location.isRequired,
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  go: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  canGo: PropTypes.func,
  block: PropTypes.func.isRequired
})
