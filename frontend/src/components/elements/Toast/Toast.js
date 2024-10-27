import React from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { MdError } from 'react-icons/md';
import { Box } from './styles';

const Info = ({ message }) => (
  <Box>
    <MdError />
    <p>{message}</p>
  </Box>
);

function Toast(variant, message) {
  toast[variant](<Info message={message} />, {
    position: toast.POSITION.BOTTOM_LEFT,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
  });
}

Toast.propTypes = {
  variant: PropTypes.oneOf(['success', 'error']).isRequired,
  message: PropTypes.string.isRequired,
};

Info.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Toast;
