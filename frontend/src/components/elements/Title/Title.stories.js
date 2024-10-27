import React from 'react';
import { storiesOf } from '@storybook/react';
import Title from './index';

const title = [
  { as: '1', level: '1', text: 'Titulo H1' },
  { as: '2', level: '2', text: 'Titulo H2' },
  { as: '3', level: '3', text: 'Titulo H3' },
  { as: '4', level: '4', text: 'Titulo H4' },
  { as: '5', level: '5', text: 'Titulo H5' },
  { as: '6', level: '6', text: 'Titulo H6' },
];

const stories = storiesOf('components/elements', module);
stories.add(`Title`, () => (
  <>
    {title.map(item => (
      <Title as={item.as} level={item.level}>
        {item.text}
      </Title>
    ))}
  </>
));
