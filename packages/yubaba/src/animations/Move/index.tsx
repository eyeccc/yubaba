import * as React from 'react';
import Collector, {
  CollectorChildrenProps,
  AnimationCallback,
  CollectorActions,
} from '../../Collector';
import * as math from '../../lib/math';
import { recalculateLocationFromScroll } from '../../lib/dom';
import { standard } from '../../lib/curves';

export interface MoveProps extends CollectorChildrenProps {
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
  zIndex: number;

  /**
   * Timing function to be used in the transition, see: https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function
   */
  timingFunction: string;
}

/**
 * ## Move
 *
 * Move will animate the end target from the start target, to the end position.
 * It will match both size and position of the start target.
 *
 * Note that it will not fade between elements, so this animation really only looks good
 * when transitioning the same (or very similar) element.
 *
 * If you want to transition distinct elements I'd suggestion using CrossFadeMove, however
 * it is slightly more expensive to animate.
 */
export default class Move extends React.Component<MoveProps> {
  static defaultProps = {
    duration: 500,
    timingFunction: standard(),
    zIndex: 10001,
  };

  beforeAnimate: AnimationCallback = (data, onFinish, setTargetProps) => {
    const { zIndex } = this.props;

    // Scroll could have changed between unmount and this prepare step.
    const fromTargetSizeLocation = recalculateLocationFromScroll(data.fromTarget);
    const toStartXOffset = fromTargetSizeLocation.location.left - data.toTarget.location.left;
    const toStartYOffset = fromTargetSizeLocation.location.top - data.toTarget.location.top;

    setTargetProps({
      style: prevStyles => ({
        ...prevStyles,
        zIndex,
        opacity: 1,
        transformOrigin: '0 0',
        visibility: 'visible',
        willChange: 'transform',
        transform: `translate3d(${toStartXOffset}px, ${toStartYOffset}px, 0) scale3d(${math.percentageDifference(
          fromTargetSizeLocation.size.width,
          data.toTarget.size.width
        )}, ${math.percentageDifference(
          fromTargetSizeLocation.size.height,
          data.toTarget.size.height
        )}, 1)`,
      }),
    });

    onFinish();
  };

  animate: AnimationCallback = (_, onFinish, setTargetProps) => {
    const { duration, timingFunction } = this.props;

    setTargetProps({
      style: prevStyles => ({
        ...prevStyles,
        transition: `transform ${duration}ms ${timingFunction}, opacity ${duration /
          2}ms ${timingFunction}`,
        transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
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
