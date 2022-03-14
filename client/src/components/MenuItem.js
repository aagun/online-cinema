import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';

export default function MenuItem(props) {
  const { icon, alt, width, onClick, to, children, className, replace } = props;
  const navigate = useNavigate();

  const gotTo = () => {
    return navigate(to, { replace: !!replace });
  };

  const checkAction = () => {
    if (to) return gotTo; // the component will be an link
    if (onClick) return onClick; // the component can do something;
  };

  return (
    <Fragment>
      <div className={classnames('ps-4 py-3 fw-bold', className)} onClick={checkAction()}>
        {icon && <img src={icon} alt={alt} width={width} />}
        <span className="ms-3">{children}</span>
      </div>
    </Fragment>
  );
}
