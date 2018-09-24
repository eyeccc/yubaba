import * as React from 'react';
import { css } from 'emotion';
import Collector, {
  CollectorChildrenProps,
  AnimationCallback,
  CollectorActions,
} from '../../Collector';
import { standard } from '../../lib/curves';

export interface RevealProps extends CollectorChildrenProps {
  /**
   * How long the animation should take over {duration}ms.
   */
  duration: number;

  /**
   * Delays the animation from starting for {delay}ms.
   */
  delay?: number;

  /**
   * zIndex to be applied to the moving element.
   */
  zIndex?: number;

  /**
   * Timing function to be used in the transition, see: https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function
   */
  timingFunction: string;
}

/**
 * ## Reveal
 *
 * Flex centering makes things difficult.
 * For vertically aligned items consider either wrapping your element inside another div or turning on skipInitialTransformOffset.
 * For horizontally aligned items it's little bit tricker. Try turning on skipInitialTransformOffset.
 */
export default class Reveal extends React.Component<RevealProps> {
  static defaultProps = {
    duration: 500,
    timingFunction: standard(),
  };

  beforeAnimate: AnimationCallback = (data, onFinish, setTargetProps) => {
    if (!data.toTarget.targetDOMData) {
      throw new Error(`yubaba
targetElement was missing.`);
    }

    setTargetProps({
      style: () => ({
        opacity: 1,
        visibility: 'visible',
        willChange: 'height, width',
        height: data.toTarget.targetDOMData.size.height,
        width: data.toTarget.targetDOMData.size.width,
        overflow: 'hidden',
      }),
      className: () => css`
        > * {
          transform: translate3d(
            -${data.toTarget.targetDOMData.location.left - data.toTarget.location.left}px,
            -${data.toTarget.targetDOMData.location.top - data.toTarget.location.top}px,
            0
          );
        }
      `,
    });

    onFinish();
  };

  animate: AnimationCallback = (data, onFinish, setTargetProps) => {
    const { timingFunction, duration } = this.props;

    setTargetProps({
      style: () => ({
        height: data.toTarget.size.height,
        width: data.toTarget.size.width,
        transition: `height ${duration}ms ${timingFunction}, width ${duration}ms ${timingFunction}`,
      }),
      className: () => css`
        > * {
          transition: transform ${duration}ms ${timingFunction};
          transform: translate3d(0, 0, 0);
        }
      `,
    });

    setTimeout(() => onFinish(), duration);
  };

  render() {
    const { children } = this.props;

    return (
      <Collector
        data={{
          action: CollectorActions.animation,
          payload: {
            beforeAnimate: this.beforeAnimate,
            animate: this.animate,
          },
        }}
      >
        {children}
      </Collector>
    );
  }
}
