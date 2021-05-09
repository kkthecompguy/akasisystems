import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SuperAdminDashoard from './Components/SuperAdminDashboard';
import OrgAdminDashboard from './Components/OrgAdminDashboard';
import UsersDashboard from './Components/UsersDashboard';
import Login from './Components/Auth/Login';
import ProtectedRoute from './ProtectedRoute';
import ForgotPassword from './Components/Auth/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword';
import { checkValidToken } from './actions/auth';
import SuperAdminLogin from './Components/Auth/SuperadminLogin';
import OrgAdminLogin from './Components/Auth/OrgadminLogin';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkValidToken());
  }, [dispatch])
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/login/superadmin" component={SuperAdminLogin} />
        <Route exact path="/login/orgadmin" component={OrgAdminLogin} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <Route exact path="/resetpassword" component={ResetPassword} />
        <ProtectedRoute exact path="/dashboard/superadmin" component={SuperAdminDashoard} />
        <ProtectedRoute exact path="/dashboard/orgadmin" component={OrgAdminDashboard} />
        <ProtectedRoute exact path="/dashboard/users" component={UsersDashboard} />
      </Switch>
    </Router>
  )
}

export default App;