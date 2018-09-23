import * as React from 'react';
import Collector, {
  CollectorChildrenProps,
  AnimationCallback,
  CollectorData,
  CollectorActions,
} from '../../Collector';
import * as math from '../../lib/math';
import { recalculateLocationFromScroll } from '../../lib/dom';
import noop from '../../lib/noop';
import { standard } from '../../lib/curves';

export interface FadeMoveProps extends CollectorChildrenProps {
  /**
   * How long the animation should take over {duration}ms.
   */
  duration?: number;

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
  timingFunction?: string;
}

/**
 * ## FadeMove
 *
 * FadeMove will create two new elements (positioned absolutely in the body),
 * position them at the start element and then cross fade move them to the end element.
 *
 * This animation works best if you have two elements that aren't the same, but you'd like
 * to transition them to each other.
 *
 * If you're transitioning the same element I'd suggest using FLIPMove, as it is a cheaper
 * animation.
 */
export default class FadeMove extends React.Component<FadeMoveProps> {
  static defaultProps = {
    duration: 500,
    timingFunction: standard(),
  };

  renderAnimation: (start: boolean) => React.ReactNode;

  beforeAnimate: AnimationCallback = (data, onFinish, setTargetProps) => {
    // Scroll could have changed between unmount and this prepare step, let's recalculate
    // just in case.
    const fromTargetSizeLocation = recalculateLocationFromScroll(data.fromTarget);
    const fromEndXOffset = data.toTarget.location.left - fromTargetSizeLocation.location.left;
    const fromEndYOffset = data.toTarget.location.top - fromTargetSizeLocation.location.top;
    const duration = this.props.duration as number;
    const noTransform = 'translate3d(0, 0, 0) scale3d(1, 1, 1)';
    const { timingFunction } = this.props;

    const from = {
      transition: `transform ${duration}ms ${timingFunction}, opacity ${duration /
        2}ms ${timingFunction}`,
      position: 'absolute',
      transformOrigin: '0 0',
    };

    this.renderAnimation = (start: boolean) =>
      data.fromTarget.render({
        ref: noop,
        style: {
          ...fromTargetSizeLocation.location,
          ...from,
          transform: noTransform,
          opacity: 1,
          zIndex: this.props.zIndex || 20000,
          // Elminate any margins so they don't affect the transition.
          margin: 0,
          height: `${fromTargetSizeLocation.size.height}px`,
          width: `${fromTargetSizeLocation.size.width}px`,
          ...(start
            ? {
                transform: `translate3d(${fromEndXOffset}px, ${fromEndYOffset}px, 0) scale3d(${math.percentageDifference(
                  data.toTarget.size.width,
                  fromTargetSizeLocation.size.width
                )}, ${math.percentageDifference(
                  data.toTarget.size.height,
                  fromTargetSizeLocation.size.height
                )}, 1)`,
                opacity: 0,
              }
            : {}),
        },
      });

    requestAnimationFrame(onFinish);
    return this.renderAnimation(false);
  };

  animate: AnimationCallback = (_, onFinish) => {
    setTimeout(onFinish, this.props.duration);
    return this.renderAnimation(true);
  };

  render() {
    const data: CollectorData = {
      action: CollectorActions.animation,
      payload: {
        beforeAnimate: this.beforeAnimate,
        animate: this.animate,
      },
    };

    return <Collector data={data}>{this.props.children}</Collector>;
  }
}
