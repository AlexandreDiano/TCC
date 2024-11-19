import React from 'react';
import { storiesOf } from '@storybook/react';
import Toast from './Toast';
import { Button } from '~/components/elements';

const stories = storiesOf('components/elements', module);
stories.add(`Toast`, () => (
  <>
    <Button
      color="secondary"
      onClick={() => Toast('success', 'Sucesso exemplo toast')}
    >
      clique para visualizar SUCESSO
    </Button>
    <Button onClick={() => Toast('error', 'Erro exemplo toast')}>
      {' '}
      clique para visualizar ERRO
    </Button>
  </>
));
