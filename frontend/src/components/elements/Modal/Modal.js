import React from "react";
import PropTypes from "prop-types";

import { Paper, Close, DialogStyle } from "./styles";

function Modal({ className, children, open, onClose, size, notClose }) {
  // const Transition = React.forwardRef(function Transition(props, ref) {
  //   return <Slide direction="up" ref={ref} {...props} />;
  // });

  if (open) {
    return (
      <DialogStyle
        className={className}
        open={open}
        // TransitionComponent={Transition}
        keepMounted
        fullWidth
        onClose={onClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth={size}
      >
        {!notClose && <Close onClick={onClose} />}
        <Paper size={size}>{children}</Paper>
      </DialogStyle>
    );
  }
  return null;
}

Modal.defaultProps = {
  size: "xl",
  className: "",
  notClose: false,
  onClose: () => {},
};

Modal.propTypes = {
  notClose: PropTypes.bool,
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
};

export default React.memo(Modal);
