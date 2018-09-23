import { storiesOf } from '@storybook/react';
import Baba from '../../Baba';
import FadeMove from './index';
import { createMoveExamples } from 'yubaba-common';

const Examples = createMoveExamples({ namePrefix: 'FadeMove', useDistinctEnd: true })(
  Baba,
  FadeMove
);

const stories = storiesOf('yubaba/FadeMove', module);
Object.keys(Examples).forEach(key => stories.add(key, Examples[key]));
