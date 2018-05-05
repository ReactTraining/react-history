import React from "react";
import PropTypes from "prop-types";
import { history as historyType } from "./PropTypes";

class Prompt extends React.Component {
  static propTypes = {
    when: PropTypes.bool,
    message: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired
  };

  static contextTypes = {
    history: historyType.isRequired
  };

  static defaultProps = {
    when: true
  };

  enable(message) {
    if (this.unblock) this.unblock();

    this.unblock = this.context.history.block(message);
  }

  disable() {
    if (this.unblock) {
      this.unblock();
      this.unblock = null;
    }
  }

  componentWillMount() {
    if (this.props.when) this.enable(this.props.message);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.when) {
      if (!this.props.when || this.props.message !== nextProps.message)
        this.enable(nextProps.message);
    } else {
      this.disable();
    }
  }

  componentWillUnmount() {
    this.disable();
  }

  render() {
    return null;
  }
}

export default Prompt;
