import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { forgotPassword } from '../../actions/auth';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    role: 'superadmin',
    email: '',
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(false);
  const loading = useSelector(state => state.auth.loading); 
  const dispatch = useDispatch();

  const handleChange = e => {
    setFormData(current => {
      return {...current, [e.target.name]: e.target.value}
    });
  }

  const { role, email } = formData;

  const handleSubmit = async e => {
    e.preventDefault();

    const success = await dispatch(forgotPassword(formData));
    if (success) {
      setSuccess(true);
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
              <p className="login-heading">FORGOT PASSWORD</p>
              <form onSubmit={e => handleSubmit(e)}>
                <div className="form-group">
                  <span className="custom-label mr-2">Enter Your details to receive instructions on reseting your password </span>
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
                  <label htmlFor="email" className="custom-label">Email</label>
                  <input
                   type="text" 
                   id="email" 
                   name="email" 
                   value={email}
                   required
                   onChange={e => handleChange(e)}
                   className="form-control"  />
                </div>
                {success && <div className="text-success text-center mt-2 mb-2">
                  Instructions sent to your email
                </div>}
                {errors && <div className="pwd-error text-center mt-2 mb-2">
                  We do not have your details in our system
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

export default ForgotPassword;