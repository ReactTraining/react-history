import React from "react";
import PropTypes from "prop-types";
import createHashHistory from "history/createHashHistory";
import { canUseDOM } from "history/DOMUtils";
import { history as historyType } from "./PropTypes";

/**
 * Manages session history using window.location.hash.
 */
class HashHistory extends React.Component {
  static propTypes = {
    basename: PropTypes.string,
    getUserConfirmation: PropTypes.func,
    hashType: PropTypes.oneOf(["hashbang", "noslash", "slash"]),
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
  };

  static childContextTypes = {
    history: historyType.isRequired
  };

  getChildContext() {
    return { history: this.history };
  }

  constructor(props) {
    super(props);
    
    const { basename, getUserConfirmation, hashType } = this.props;

    if (canUseDOM) {
      this.history = createHashHistory({
        basename,
        getUserConfirmation,
        hashType
      });

      // Do this here so we catch actions in cDM.
      this.unlisten = this.history.listen(() => this.forceUpdate());
    } else {
      this.history = {};
    }
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { children } = this.props;

    return typeof children === "function"
      ? children(this.history)
      : React.Children.only(children);
  }
}

export default HashHistory;
