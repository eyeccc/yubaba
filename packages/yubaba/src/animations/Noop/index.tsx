import * as React from 'react';
import Collector, { CollectorChildrenProps, CollectorActions } from '../../Collector';

interface NoopProps extends CollectorChildrenProps {
  duration: number;
}

/**
 * @hidden
 */
export default class Noop extends React.Component<NoopProps> {
  render() {
    const { children, duration } = this.props;

    return (
      <Collector
        data={{
          action: CollectorActions.animation,
          payload: {
            beforeAnimate: (_, onFinish) => {
              onFinish();
            },
            animate: (_, onFinish) => {
              setTimeout(onFinish, duration);
            },
            afterAnimate: (_, onFinish) => {
              onFinish();
            },
          },
        }}
      >
        {children}
      </Collector>
    );
  }
}
