import * as React from 'react';
import { storiesOf } from '@storybook/react';
import styled, { css } from 'styled-components';
import { Toggler } from 'yubaba-common';
import Baba from '../../Baba';
import Collector from '../../Collector';
import Target from '../../Target';
import RevealMove from './index';

const Container = styled.div<{ center?: boolean }>`
  margin: 100px ${props => (props.center ? 'auto' : '100px')};
  ${props =>
    props.center
      ? css`
          display: flex;
          justify-content: center;
        `
      : ''};
`;

interface ListItemProps {
  height: number;
  width: number;
}

const ListItem = styled.div<ListItemProps>`
  background: #fea3aa;
  height: ${props => props.height}px;
  width: ${props => props.width}px;

  position: relative;
  cursor: pointer;

  &:before {
    content: 'click me';
    text-align: center;
    left: 0;
    right: 0;
    position: absolute;
    color: white;
    font-family: Roboto, HelveticaNeue, Arial, sans-serif;
    top: 70%;
  }

  &:after {
    content: '😊';
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    pointer-events: none;
  }
`;

type Orientation = 'horizontal' | 'vertical' | 'both';

interface TallListItemProps extends ListItemProps {
  orientation: Orientation;
}

const TallListItem = styled.div<TallListItemProps>`
  display: flex;
  align-items: center;
  background: #baed91;
  margin: 0 auto;
  height: ${props =>
    props.orientation === 'both' || props.orientation === 'vertical'
      ? props.height * 3
      : props.height}px;
  max-width: ${props =>
    props.orientation === 'both' || props.orientation === 'horizontal'
      ? props.width * 3
      : props.width}px;
`;

const build = (width: number, height: number, orientation: Orientation) => (
  <Toggler>
    {({ shown, toggle }) => (
      <React.Fragment>
        {shown || (
          <Container center>
            <Baba name={`reveal-move-${orientation}`}>
              <RevealMove childrenTransformX={false} childrenTransformY={false} transformX={false}>
                {baba => (
                  <ListItem
                    onClick={() => toggle()}
                    style={baba.style}
                    className={baba.className}
                    innerRef={baba.ref}
                    width={width}
                    height={height}
                  />
                )}
              </RevealMove>
            </Baba>
          </Container>
        )}

        {shown && (
          <Container>
            <Baba name={`reveal-move-${orientation}`}>
              <Collector>
                {baba => (
                  <TallListItem
                    width={width}
                    height={height}
                    orientation={orientation}
                    style={baba.style}
                    className={baba.className}
                    innerRef={baba.ref}
                  >
                    <Target>
                      {target => (
                        <ListItem
                          width={width}
                          height={height}
                          onClick={() => toggle()}
                          innerRef={target.ref}
                        />
                      )}
                    </Target>
                  </TallListItem>
                )}
              </Collector>
            </Baba>
          </Container>
        )}
      </React.Fragment>
    )}
  </Toggler>
);

storiesOf('yubaba/RevealMove', module)
  // .addDecorator(story => <Container>{story()}</Container>)
  .add('TargetHeight', () => build(200, 200, 'vertical'))
  .add('TargetWidth', () => build(200, 200, 'horizontal'))
  .add('TargetBoth', () => build(200, 200, 'both'));
