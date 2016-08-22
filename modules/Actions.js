import React, { PropTypes } from 'react'
import { createPath } from './PathUtils'
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

const createPathFromProps = (props) =>
  typeof props.path === 'string' ? props.path : createPath(props)

export const Push = (props) =>
  <Action perform={history => history.push(createPathFromProps(props), props.state)}/>

Push.propTypes = {
  path: PropTypes.string,
  pathname: PropTypes.string,
  search: PropTypes.string,
  hash: PropTypes.string,
  state: PropTypes.any
}

export const Replace = (props) =>
  <Action perform={history => history.replace(createPathFromProps(props), props.state)}/>

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
