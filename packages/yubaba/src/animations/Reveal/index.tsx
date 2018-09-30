import * as React from 'react';
import { css } from 'emotion';
import Collector, {
  CollectorChildrenProps,
  AnimationCallback,
  CollectorActions,
} from '../../Collector';
import { standard } from '../../lib/curves';
import { combine } from '../../lib/style';

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

  /**
   * ??? Does this work.
   * Defaults to true.
   */
  childrenTransformX?: boolean;

  /**
   * ??? Does this work.
   * Defaults to `true`.
   */
  childrenTransformY?: boolean;
}

/**
 * ## Reveal
 */
export default class Reveal extends React.Component<RevealProps> {
  static defaultProps = {
    duration: 500,
    timingFunction: standard(),
    childrenTransformX: true,
    childrenTransformY: true,
  };

  beforeAnimate: AnimationCallback = (data, onFinish, setTargetProps) => {
    if (!data.toTarget.targetDOMData) {
      throw new Error(`yubaba
targetElement was missing.`);
    }

    const { childrenTransformX, childrenTransformY } = this.props;

    const offsetChildrenX = childrenTransformX
      ? data.toTarget.targetDOMData.location.left - data.toTarget.location.left
      : 0;
    const offsetChildrenY = childrenTransformY
      ? data.toTarget.targetDOMData.location.top - data.toTarget.location.top
      : 0;

    setTargetProps({
      style: prevStyles =>
        data.toTarget.targetDOMData
          ? {
              ...prevStyles,
              opacity: 1,
              visibility: 'visible',
              willChange: combine('height, width')(prevStyles.willChange),
              height: data.toTarget.targetDOMData.size.height,
              width: data.toTarget.targetDOMData.size.width,
              overflow: 'hidden',
            }
          : undefined,
      className: () =>
        data.toTarget.targetDOMData
          ? css({
              '> *': {
                transform: `translate3d(-${offsetChildrenX}px, -${offsetChildrenY}px, 0)`,
              },
            })
          : undefined,
    });

    onFinish();
  };

  animate: AnimationCallback = (data, onFinish, setTargetProps) => {
    const { timingFunction, duration } = this.props;

    setTargetProps({
      style: prevStyles => ({
        ...prevStyles,
        height: data.toTarget.size.height,
        width: data.toTarget.size.width,
        transition: combine(
          `height ${duration}ms ${timingFunction}, width ${duration}ms ${timingFunction}`
        )(prevStyles.transition),
      }),
      className: () =>
        css({
          '> *': {
            transform: `translate3d(0, 0, 0)`,
            transition: `transform ${duration}ms ${timingFunction}`,
          },
        }),
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
