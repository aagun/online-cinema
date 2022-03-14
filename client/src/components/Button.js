import React from 'react';
import classnames from 'classnames';

export default function Button({ children, className, onClick, type }) {
  return (
    <button type={type} className={classnames('btn px-4 py-2 fw-bold', className)} onClick={onClick}>
      {children}
    </button>
  );
}
