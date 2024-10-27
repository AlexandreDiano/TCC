import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from './index';

const buttons = [
  { id: 1, outline: false, color: 'primary' },
  { id: 2, outline: false, color: 'secondary' },
  { id: 1, outline: false, color: 'grey', size: 'large' },
  { id: 2, outline: false, color: 'secondary', size: 'small' },
  { id: 3, color: 'disabled' },
  { id: 4, outline: true, color: 'primary' },
  { id: 5, outline: true, color: 'secondary', size: 'medium' },
  { id: 6, outline: true, color: 'disabled', size: 'large' },
];

const stories = storiesOf('components/elements', module);
stories.add(`Button`, () => (
  <>
    {buttons.map(item => (
      <Button
        key={item.id}
        color={item.color}
        size={item.size}
        outlined={item.outline}
        level={item.level}
      >
        Botao
      </Button>
    ))}
  </>
));
