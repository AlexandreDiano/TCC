import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core';
import { Title, Text, Margin } from '~/components/elements';
import { Panel, ArrowDown } from './styles';

export default function TextCollapse({ title, text, simple }) {
  const [boxOpen, openBox] = useState(!simple);

  const handleOpener = () => {
    openBox(!boxOpen);
  };
  return (
    <>
      <Panel expanded={boxOpen} onChange={handleOpener} simple={simple}>
        <ExpansionPanelSummary expandIcon={<ArrowDown simple={simple} />}>
          {!simple ? (
            <Title as="3" level="6" levelDesktop="3">
              {title}
            </Title>
          ) : (
            <Margin mt={1} mb={1}>
              <Text level="3" as={boxOpen && 'strong'}>
                {title}
              </Text>
            </Margin>
          )}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <p
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          />
        </ExpansionPanelDetails>
      </Panel>
    </>
  );
}

TextCollapse.defaultProps = {
  title: '',
  text: '',
  simple: false,
};

TextCollapse.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  simple: PropTypes.bool,
};
