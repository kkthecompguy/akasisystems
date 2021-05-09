import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createOrg } from '../../actions/superadmin';
import Swal from 'sweetalert2';


const CreateOrg = () => {
  const [formData, setFormData] = useState({
    orgName: '',
    orgEmail: '',
    orgPassword: '', 
    adminName: '', 
    adminEmail: '',
    adminPassword: '',
    workId: ''
  });
  const [createOrgAdmin, setCreateOrgAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [errors, setErrors] = useState(false);
  const dispatch = useDispatch();

  const handleChange = e => {
    setFormData(current => {
      return {...current, [e.target.name]: e.target.value}
    })
  }

  const { orgName, orgEmail, orgPassword, adminName, adminEmail, adminPassword, workId } = formData;

  const handleSubmit = async e => {
    e.preventDefault();
    if (orgName.trim() === "" || orgEmail.trim() === "" || orgPassword.trim() === "" || adminName.trim() === "" || adminEmail.trim() === "" || adminPassword.trim() === "") {
      setErrors(true);
      return;
    } else {
      const success = await dispatch(createOrg(formData));
      if (success) {
        Swal.fire({
          title: "success",
          text: "Organization Created Successfully",
          icon: "success"
        });
        setFormData(current => {
          return {...current, orgName: "", orgEmail: "", orgPassword: "", adminEmail: "", adminName: "", adminPassword: "", workId: ""}
        });
        setShowPassword(false);
      } else {
        Swal.fire({
          title: "error",
          text: "Something went wrong",
          icon: "error"
        })
      }
    }
  }

  return (
    <main>
      <div className="text-center text-uppercase">{ createOrgAdmin ? 'Organization Administration' : 'Create Organisation'}</div>
      <div className="organizations">
        <div className="card card-body">
          <form onSubmit={e => handleSubmit(e)}>
            { !createOrgAdmin && (
              <React.Fragment>
                <div className="form-group-custom">
                  <label htmlFor="orgName">Organisation Name</label>
                  <input
                  type="text" 
                  className="form-control" 
                  name="orgName" 
                  required
                  value={orgName}
                  onChange={e => handleChange(e)}
                  id="orgName" />
                </div>
                <div className="form-group-custom">
                  <label htmlFor="orgEmail">Organisation Email</label>
                  <input
                  type="text" 
                  className="form-control" 
                  name="orgEmail" 
                  required
                  value={orgEmail}
                  onChange={e => handleChange(e)}
                  id="orgEmail" />
                </div>
                <div className="form-group-custom">
                  <label htmlFor="orgPassword">Organisation Password</label>
                  <div className="password-wrapper">
                    <input
                    type={!showPassword ? 'password': 'text'}
                    className="form-control" 
                    name="orgPassword" 
                    required
                    value={orgPassword}
                    onChange={e => handleChange(e)}
                    id="orgPassword" />
                    <span  onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE': 'SHOW'}</span>
                  </div>
                </div> 
                <div className="custom-btn-div">
                  <button onClick={() => setCreateOrgAdmin(true)} type="button" className="btn btn-primary btn-sm text-uppercase">Continue To Create Admin</button>
                </div>
              </React.Fragment>
            ) }

            { createOrgAdmin && (
              <React.Fragment>
                <div className="form-group-custom">
                  <label htmlFor="workId">Work ID</label>
                  <input
                   type="number" 
                   className="form-control" 
                   name="workId" 
                   required
                   value={workId}
                   onChange={e => handleChange(e)}
                   id="workId" />
                </div>
                <div className="form-group-custom">
                  <label htmlFor="adminName">Name</label>
                  <input
                   type="text" 
                   className="form-control" 
                   name="adminName" 
                   required
                   value={adminName}
                   onChange={e => handleChange(e)}
                   id="adminName" />
                </div>
                <div className="form-group-custom">
                  <label htmlFor="adminEmail">Email</label>
                  <input
                   type="text" 
                   required
                   className="form-control" 
                   name="adminEmail" 
                   value={adminEmail}
                   onChange={e => handleChange(e)}
                   id="adminEmail" />
                </div>
                <div className="form-group-custom">
                  <label htmlFor="adminPassword">Password</label>
                  <div className="password-wrapper">
                    <input
                    type={!showPassword ? 'password': 'text'} 
                    className="form-control" 
                    required
                    name="adminPassword" 
                    value={adminPassword}
                    onChange={e => handleChange(e)}
                    id="adminPassword" />
                    <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE': 'SHOW'}</span>
                  </div> 
                </div> 
                {errors && <div className="pwd-error text-center mt-2 mb-2">
                  You missed out some required fields
                </div>}
                <div className="custom-btn-div">
                  <button type="submit" className="btn btn-primary btn-sm text-uppercase">Finish</button>
                </div>
              </React.Fragment>
            ) }
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreateOrg;