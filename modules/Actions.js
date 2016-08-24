import React, { PropTypes } from 'react'
import {
  historyContext as historyContextType
} from './PropTypes'

class Action extends React.Component {
  static contextTypes = {
    history: historyContextType.isRequired
  }

  static propTypes = {
    perform: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.perform(this.context.history)
  }

  componentWillReceiveProps(nextProps) {
    nextProps.perform(this.context.history)
  }

  render() {
    return null
  }
}

export const Push = ({ path, state }) =>
  <Action perform={history => history.push(path, state)}/>

Push.propTypes = {
  path: PropTypes.string,
  state: PropTypes.any
}

export const Replace = ({ path, state }) =>
  <Action perform={history => history.replace(path, state)}/>

Replace.propTypes = Push.propTypes

export const Pop = ({ go }) =>
  <Action perform={history => history.go(go)}/>

Pop.propTypes = {
  go: PropTypes.number
}

Pop.defaultProps = {
  go: -1
}

export const Back = () =>
  <Action perform={history => history.goBack()}/>

export const Forward = () =>
  <Action perform={history => history.goForward()}/>
