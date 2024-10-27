import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { Box } from './styles';

export default function Loading({ button }) {
  return (
    <Box button={button}>
      <CircularProgress />
    </Box>
  );
}

Loading.defaultProps = {
  button: false,
};

Loading.propTypes = { button: PropTypes.bool };
