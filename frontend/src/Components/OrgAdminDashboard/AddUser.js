import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { createUser } from '../../actions/orgadmin';

const AddUser = () => {
  const { organizationId } = useSelector(state => state.auth.user);
  const [formData, setFormData] = useState({
    workId: 'EMP'+Math.floor(1000 + Math.random() * 9000),
    name: '',
    email: '',
    password: '',
    role: '',
    department: '',
    organization: organizationId
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState('');
  const dispatch = useDispatch();

  const handleChange = e => {
    setFormData(current => {
      return {...current, [e.target.name]: e.target.value}
    });
  }

  const { workId, name, email, password, role, department } = formData;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!organizationId) {
      return;
    } else {
      const success = await dispatch(createUser(formData));
      if (success) {
        Swal.fire({
          icon: "success",
          "title": "success",
          "text": "User created successfully"
        });
        setFormData(current => {
          return {...current, workId: "", name: "", password: "", role: "", department: "", email: ""}
        });
        setShowPassword(false);
        setErrors('')
      } else {
        setErrors('Employee work ID must be unique');
      }
    }
  }

  return (
    <main>
      <div className="text-center text-uppercase mb-2 mt-2">Create User</div>
      <div className="card card-body">
        <form onSubmit={e => handleSubmit(e)}>
          <div className="form-group-custom">
            <label htmlFor="workId">USER ID</label>
            <input
             type="text" 
             name="workId" 
             id="workId" 
             value={workId} 
             required
             onChange={e => handleChange(e)} 
             className="form-control" />
          </div>
          <div className="form-group-custom">
            <label htmlFor="name">Name</label>
            <input
             type="text" 
             name="name" 
             id="name" 
             value={name} 
             required
             onChange={e => handleChange(e)} 
             className="form-control" />
          </div>
          <div className="form-group-custom">
            <label htmlFor="email">Email</label>
            <input
             type="email" 
             name="email" 
             id="email" 
             value={email} 
             required
             onChange={e => handleChange(e)} 
             className="form-control" />
          </div>
          <div className="form-group-custom">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
              type={!showPassword ? 'password': 'text'}
              className="form-control" 
              name="password" 
              required
              value={password}
              onChange={e => handleChange(e)}
              id="password" />
              <span  onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE': 'SHOW'}</span>
            </div>
          </div>
          <div className="form-group-custom">
            <label htmlFor="role">Role</label>
            <select value={role} onChange={e => handleChange(e)} name="role" className="form-select" required>
              <option value="">----select-----</option>
              <option value="supervisor">Supervisor</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="form-group-custom">
            <label htmlFor="department">Department</label>
            <input
             type="text" 
             name="department" 
             id="department" 
             value={department} 
             required
             onChange={e => handleChange(e)} 
             className="form-control" />
          </div>
          {errors && <div className="pwd-error text-center mt-2 mb-2">
            {errors}
          </div>}
          <div className="custom-btn-div">
            <button type="submit" className="btn btn-primary text-uppercase">Add User</button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AddUser;