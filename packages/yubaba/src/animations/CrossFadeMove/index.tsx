import * as React from 'react';
import FadeMove from '../FadeMove';
import Move from '../Move';

export default class CrossFadeMove extends React.Component<any> {
  render() {
    const { children, ...props } = this.props;
    return (
      <Move {...props}>
        <FadeMove {...props}>{children}</FadeMove>
      </Move>
    );
  }
}
