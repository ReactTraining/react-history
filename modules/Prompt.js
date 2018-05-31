import React from "react";
import PropTypes from "prop-types";
import { polyfill } from 'react-lifecycles-compat';
import { canUseDOM } from "history/DOMUtils";
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

  constructor(props, context) {
    super(props, context);

    if (canUseDOM) {
      if (this.props.when) {
        this.enable(this.props.message);
      }
    }
  }

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

  getSnapshotBeforeUpdate(prevProps) {
    if (this.props.when) {
      if (!prevProps.when || prevProps.message !== this.props.message)
        this.enable(this.props.message);
    } else {
      this.disable();
    }
    return null;
  }

  componentDidUpdate() {
    // we must define this lifecycle method as long as we're using the polyfill
  }

  componentWillUnmount() {
    this.disable();
  }

  render() {
    return null;
  }
}

// Polyfill your component so the new lifecycles will work with older versions of React:
polyfill(Prompt);

export default Prompt;
