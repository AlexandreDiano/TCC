import React from 'react';
import { storiesOf } from '@storybook/react';
import Textarea from './Textarea';

const stories = storiesOf('components/elements', module);
stories.add(`Textarea`, () => (
  <Textarea placeholder="Ex.: salão de beleza, mecânica, escritório, etc..." />
));
