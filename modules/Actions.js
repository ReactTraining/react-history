import React from "react";
import PropTypes from "prop-types";
import { history as historyType } from "./PropTypes";

class Action extends React.Component {
  static propTypes = {
    perform: PropTypes.func.isRequired
  };

  static contextTypes = {
    history: historyType.isRequired
  };

  performAction() {
    this.props.perform(this.context.history);
  }

  componentDidMount() {
    this.performAction();
  }

  componentDidUpdate() {
    this.performAction();
  }

  render() {
    return null;
  }
}

export const Push = ({ location, path, state }) => (
  <Action perform={history => history.push(location || path, state)} />
);

Push.propTypes = {
  path: PropTypes.string,
  state: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    hash: PropTypes.string,
    state: PropTypes.object
  })
};

export const Replace = ({ location, path, state }) => (
  <Action perform={history => history.replace(location || path, state)} />
);

Replace.propTypes = Push.propTypes;

export const Pop = ({ go }) => <Action perform={history => history.go(go)} />;

Pop.propTypes = {
  go: PropTypes.number
};

Pop.defaultProps = {
  go: -1
};

export const Back = () => <Action perform={history => history.goBack()} />;

export const Forward = () => (
  <Action perform={history => history.goForward()} />
);
