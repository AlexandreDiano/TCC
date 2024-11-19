import React from 'react';
import { storiesOf } from '@storybook/react';
import Message from './Message';

const stories = storiesOf('components/elements', module);
stories.add(`Message`, () => (
  <>
    <Message variant="error">Campo obrigatorio</Message>
    <Message variant="success">Mensagem enviada</Message>
  </>
));
