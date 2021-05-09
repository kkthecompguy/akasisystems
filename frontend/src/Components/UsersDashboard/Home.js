import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { updateInfo } from '../../actions/users';

const Home = ({ profile }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    password2: '',
    email: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState('');
  const dispatch = useDispatch();

  const handleChange = e => {
    setFormData(current => {
      return { ...current, [e.target.name]: e.target.value }
    });
  }

  const { oldPassword, newPassword, password2, email } = formData;

  const handleSubmit = async e => {
    e.preventDefault();
    if (newPassword !== password2) {
      setErrors('New Passwords do not match')
      return;
    } else if (oldPassword.trim() === "" || newPassword.trim() === "") {
      return;
    } else {
      const success = await dispatch(updateInfo(formData));
      if (success) {
        Swal.fire({
          title: "success",
          icon: "success",
          text: "Admin info updated successfully"
        });
        setFormData(current => {
          return  {...current, oldPassword: "", newPassword: "", password2: "", email: ""}
        })
        setErrors('');
      } else {
        setErrors('The given password was incorrect')
      }
    }
  }

  return (
    <main>
      <div className="card card-body">
        <div className="updateadmininfo">
          <div className="admin-name-wrapper2"> 
            <div className="workid">
              <span>WorkID {profile && profile.work_id}</span>
            </div>
          </div>
          <div>
            <div className="mt-2 mb-2">Update Your Info</div>
            <div className="card card-body">
              <form onSubmit={e => handleSubmit(e)}>
                <div className="form-group-custom">
                  <label>Old Password (Given by Admin):</label>
                  <div className="password-wrapper">
                    <input
                      type={!showPassword ? 'password' : 'text'}
                      className="form-control"
                      name="oldPassword"
                      required
                      value={oldPassword}
                      onChange={e => handleChange(e)}
                      id="oldPassword" />
                    <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE' : 'SHOW'}</span>
                  </div>
                </div>
                <div className="form-group-custom">
                  <label>New Password:</label>
                  <div className="password-wrapper">
                    <input
                      type={!showPassword ? 'password' : 'text'}
                      className="form-control"
                      name="newPassword"
                      required
                      value={newPassword}
                      onChange={e => handleChange(e)}
                      id="newPassword" />
                    <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE' : 'SHOW'}</span>
                  </div>
                </div>
                <div className="form-group-custom">
                  <label>Confirm Password:</label>
                  <div className="password-wrapper">
                    <input
                      type={!showPassword ? 'password' : 'text'}
                      className="form-control"
                      name="password2"
                      required
                      value={password2}
                      onChange={e => handleChange(e)}
                      id="password2" />
                    <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE' : 'SHOW'}</span>
                  </div>
                </div>
                <div className="form-group-custom">
                  <label>Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={e => handleChange(e)}
                    id="email" />
                </div>
                {errors && <div className="pwd-error text-center mt-2 mb-2">
                  {errors}
                </div>}
                <div className="custom-btn-div">
                  <button type="submit" className="btn btn-primary btn-sm text-uppercase">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;