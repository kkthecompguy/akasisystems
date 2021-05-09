import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ component: Component,  ...rest }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  return <Route {...rest} render={(props) => {
    if (isAuthenticated) {
      return <Component />;
    } else {
      return <Redirect to={{pathname: "/", state: { from: props.location }}} />
    }
  }} />
}

export default ProtectedRoute;