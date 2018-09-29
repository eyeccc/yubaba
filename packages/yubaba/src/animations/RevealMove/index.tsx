import * as React from 'react';
import Reveal, { RevealProps } from '../Reveal';
import Move, { MoveProps } from '../Move';

export default class RevealMove extends React.Component<RevealProps & MoveProps> {
  render() {
    const { children, ...props } = this.props;
    return (
      <Reveal {...props}>
        <Move {...props} useFocalElement>
          {children}
        </Move>
      </Reveal>
    );
  }
}
