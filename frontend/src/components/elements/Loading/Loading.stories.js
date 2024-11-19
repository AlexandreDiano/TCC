import React from 'react';
import { storiesOf } from '@storybook/react';
import Loading from './index';

const stories = storiesOf('components/elements', module);
stories.add(`Loading`, () => <Loading />);
