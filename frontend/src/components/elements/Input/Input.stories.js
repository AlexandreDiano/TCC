import React from 'react';
import { storiesOf } from '@storybook/react';
import { Message, Margin } from '~/components/elements';
import { BoxInput } from './styles';
import Input from './index';

const Inputs = [
  { id: 1, placeholder: 'email@gmail.com', error: false, icon: 'EMAIL' },
  { id: 2, placeholder: 'placeholder Input', error: false },
  { id: 4, placeholder: 'placeholder Input', error: true },
];

const stories = storiesOf('components/elements', module);
stories.add(`Input`, () => (
  <>
    {Inputs.map(item => (
      <BoxInput key={item.id} errors={item.error}>
        <Input
          icon={item.icon}
          name="input1"
          placeholder={`${item.placeholder} ${item.id}`}
        />
        {item.error && (
          <Margin mt={1}>
            <Message variant="error">Validação Input</Message>
          </Margin>
        )}
      </BoxInput>
    ))}
  </>
));
