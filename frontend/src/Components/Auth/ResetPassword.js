import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { resetPassword } from '../../actions/auth';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    role: 'superadmin',
    password: '',
    password2: ''
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState('');
  const loading = useSelector(state => state.auth.loading);
  const dispatch = useDispatch();
  const location = useLocation();

  let parameters = location.search.split("=");
  let token = parameters[1] || ''; 
  let resetToken  = token.slice(0, -7); 
  let user = parameters[2] || ''; 
  let userId  = user.slice(0, -10);

  const handleChange = e => {
    setFormData(current => {
      return {...current, [e.target.name]: e.target.value}
    });
  }

  const { role, password, password2 } = formData;

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setErrors('Passwords do not match');
      return;
    } else if (!resetToken || !userId) {
      setErrors('Invalid Token or Token has expired')
      return;
    }
    const success = await dispatch(resetPassword({...formData, resetToken: resetToken, userId: Number(userId)}));
    if (success) {
      setFormData(current => {
        return {...current, role: "", password: "", password2: ""}
      });
      setSuccess(true);
    } else {
      setErrors("Something went wrong please try again");
    }
  }

  return (
    <div className="auth-bg-color">
      <div className="container">
        <div className="row">
          <div className="col-md-5 mx-auto mt-custom">
            <div className="card card-body">
              <p className="login-heading">Reset Your Password</p>
              <form onSubmit={e => handleSubmit(e)}>
                <div className="form-group mb-2 text-center">
                  <span className="custom-label mr-2">Enter the details to reset your password </span>
                </div>
                <div className="form-group">
                  <div className="text-center text-uppercase select-wrapper">
                    <select name="role" value={role} onChange={e => handleChange(e)} required className="custom-select form-select form-select-sm">
                      <option value="superadmin">SUPER ADMIN</option>
                      <option value="orgadmin">ORG ADMIN</option>
                      <option value="employee">USER</option>
                    </select>
                  </div> 
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="custom-label">New Password</label>
                  <input
                   type="password" 
                   id="password" 
                   name="password" 
                   value={password}
                   required
                   onChange={e => handleChange(e)}
                   className="form-control"  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="custom-label">Confirm Password</label>
                  <input
                   type="password" 
                   id="password2" 
                   name="password2" 
                   value={password2}
                   required
                   onChange={e => handleChange(e)}
                   className="form-control"  />
                </div>
                {success && <div className="text-success text-center mt-2 mb-2">
                  <span>Password changed successfully </span>
                  <Link to="/"> Proceed to login</Link> 
                </div>}
                {errors && <div className="pwd-error text-center mt-2 mb-2">
                  {errors}
                </div>}
                <div className="form-group text-center mt-3 mb-2">
                  <button type="submit" className="btn btn-primary text-uppercase custom-label">{loading ? 'submitting....' : 'Continue'}</button>
                </div>
              </form>
            </div>
          </div>
        </div> 
      </div>
    </div>
  )
}

export default ResetPassword;