import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { orgadminlogin } from '../../actions/auth';

const OrgAdminLogin = () => {
  const [formData, setFormData] = useState({
    role: 'orgadmin',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState(false);
  const loading = useSelector(state => state.auth.loading);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleChange = e => {
    setFormData(current => {
      return {...current, [e.target.name]: e.target.value}
    });
  }

  const { email, password } = formData;

  const handleSubmit = async e => {
    e.preventDefault();

    const success = await dispatch(orgadminlogin(formData));
    if (success) {
      let route = `/dashboard/orgadmin`;
      history.push(route);
    } else {
      setErrors(true);
    }
  }

  return (
    <div className="auth-bg-color">
      <div className="container">
        <div className="row">
          <div className="col-md-5 mx-auto mt-custom">
            <div className="card card-body">
              <p className="login-heading">AKASI SYSTEMS LOGIN</p>
              <form onSubmit={e => handleSubmit(e)}>
                <div className="form-group">
                  <div className="text-center text-uppercase">
                    <span className="custom-label mr-2">Login</span> 
                  </div> 
                </div> 
                <div className="form-group">
                  <label htmlFor="email" className="custom-label">Email</label>
                  <input
                   type="email" 
                   id="email" 
                   name="email" 
                   value={email}
                   required
                   onChange={e => handleChange(e)}
                   className="form-control"  />
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="custom-label">Password</label>
                  <input
                   type="password" 
                   id="password" 
                   name="password" 
                   value={password}
                   required
                   onChange={e => handleChange(e)}
                   className="form-control"  />
                </div>
                {errors && <div className="pwd-error text-center mt-2 mb-2">
                  email or password is incorrect
                </div>}
                <div className="form-group text-center mt-3 mb-2">
                  <button type="submit" className="btn btn-primary text-uppercase custom-label">{loading ? 'logging....' : 'Login'}</button>
                </div>
                <div className="form-group">
                  <Link to="/forgotpassword" className="custom-label">Forgot Password?</Link>
                </div>
              </form>
            </div>
          </div>
        </div> 
      </div>
    </div>
  )
}

export default OrgAdminLogin;