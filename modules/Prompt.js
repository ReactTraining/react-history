import React, { PropTypes } from 'react'
import {
  historyContext as historyContextType
} from './PropTypes'

class Prompt extends React.Component {
  static contextTypes = {
    history: historyContextType.isRequired
  }

  static propTypes = {
    message: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string
    ]).isRequired
  }

  componentWillMount() {
    this.unblock = this.context.history.prompt(this.props.message)
  }

  componentWillUnmount() {
    this.unblock()
  }

  render() {
    return null
  }
}

export default Prompt
