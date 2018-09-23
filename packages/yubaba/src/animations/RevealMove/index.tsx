import * as React from 'react';
import Reveal from '../Reveal';
import Move from '../Move';

export default class RevealMove extends React.Component<any> {
  render() {
    const { children, ...props } = this.props;
    return (
      <Move {...props}>
        <Reveal {...props}>{children}</Reveal>
      </Move>
    );
  }
}
