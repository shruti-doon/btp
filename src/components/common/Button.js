import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, onClick, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 transition-colors duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  onClick: () => {},
  className: '',
  disabled: false
};

export default Button;