// @flow

import type { Children } from 'react';
import type { Transition as TransitionOptions } from './orchestrator';

import React from 'react';
import orchestrator, { removeFromStore } from './orchestrator';

export default class Transition extends React.Component {
  _node: HTMLElement;

  props: {
    pair: string,
    children?: Children,
    transitions: Array<TransitionOptions>,
    style?: {
      [string]: any,
    },
  };

  state = {
    visible: false,
  };

  componentDidMount () {
    this.initialise();
  }

  componentWillUnmount () {
    this.initialise();

    if (this._node.firstElementChild) {
      removeFromStore(this.props.pair, this._node.firstElementChild, true);
    }
  }

  setVisibility = (visible: boolean) => {
    this.setState({
      visible,
    });
  };

  initialise () {
    if (!this._node.firstElementChild) {
      return;
    }

    orchestrator(this.props.pair, {
      node: this._node.firstElementChild,
      transitions: this.props.transitions,
      shouldShow: this.setVisibility,
    });
  }

  render () {
    const { pair, transitions, style, ...props } = this.props;

    return (
      <div
        {...props}
        ref={(node) => (this._node = node)}
        style={{ ...style, opacity: this.state.visible ? 1 : 0 }}
      >
        {this.props.children}
      </div>
    );
  }
}
