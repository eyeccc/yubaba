import * as React from 'react';
import Reveal, { RevealProps } from '../Reveal';
import Move, { MoveProps } from '../Move';

export default class RevealMove extends React.Component<RevealProps & MoveProps> {
  render() {
    const { children, ...props } = this.props;
    return (
      <Move {...props}>
        <Reveal {...props}>{children}</Reveal>
      </Move>
    );
  }
}
