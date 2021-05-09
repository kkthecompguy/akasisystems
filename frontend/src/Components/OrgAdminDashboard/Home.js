import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import microsoftlogo from '../../image/microsoftlogo.png';
import { updateAdminInfo, updateOrgInfo } from '../../actions/orgadmin';

const Home = ({ organization, profile }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    password2: '',
    email: ''
  });
  const [orgDetails, setOrgDetails] = useState({
    base64EncodedImage: "",
    theme: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [homeView, setHomeView] = useState('Default');
  const [errors, setErrors] = useState('');
  const dispatch = useDispatch();

  const handleChange = e => {
    setFormData(current => {
      return {...current, [e.target.name]: e.target.value}
    });
  }

  const { oldPassword, newPassword, password2, email } = formData;
  const { base64EncodedImage, theme } = orgDetails;

  const handleSubmit = async e => {
    e.preventDefault();
    if (newPassword !== password2) {
      setErrors('New Passwords do not match')
      return;
    } else if (oldPassword.trim() === "" || newPassword.trim() === "") {
      return;
    } else {
      const success = await dispatch(updateAdminInfo(formData));
      if (success) {
        Swal.fire({
          title: "success",
          icon: "success",
          text: "Admin info updated successfully"
        });
        setFormData(current => {
          return  {...current, oldPassword: "", newPassword: "", password2: "", email: ""}
        });
        setErrors('');
      } else {
        setErrors('The given password was incorrect')
      }
    }
  }

  const handleChooseFile = e => {
    if (e.target.files.length === 0) {
      return;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        setOrgDetails(current => {
          return {...current, base64EncodedImage: reader.result}
        })
      }
    }
  }

  const handleUpdateOrgInfo = async () => {
    if (base64EncodedImage.trim() === "" || theme.trim() === "") {
      return;
    } else {
      const success = await dispatch(updateOrgInfo(orgDetails));
      if (success) {
        Swal.fire({
          title: "success",
          icon: "success",
          text: "Org info updated successfully"
        });
        setOrgDetails(current => {
          return {...current, base64EncodedImage: "", theme: ""}
        })
      }
    }
    
  }

  return (
    <main>
      <div className="container">
        { homeView === "Default" && <div className="text-center">
        <h4>ABOUT ORGANIZATION</h4>
        <div className="orgInfo">
          <img src={organization && organization.logo ? organization.logo : microsoftlogo} alt="microsoftlogo"  />
          <div className="orgName">{organization && organization.org_name}</div>
        </div>
        <div className="orgbtns">
          <button onClick={() => setHomeView('UpdateAdminInfo')} className="btn btn-primary btn-lg">Update Admin Info</button>
          <button onClick={() => setHomeView('UpdateOrgView')} className="btn btn-primary btn-lg">Update Org Details</button>
        </div>
        </div>}

        { homeView === "UpdateAdminInfo" && <div className="updateadmininfo">
          <div className="admin-name-wrapper">
            <div className="admin-name">
              <span>ADMIN: {profile && profile.name}</span>
            </div>
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
                    type={!showPassword ? 'password': 'text'}
                    className="form-control" 
                    name="oldPassword" 
                    required
                    value={oldPassword}
                    onChange={e => handleChange(e)}
                    id="oldPassword" />
                    <span  onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE': 'SHOW'}</span>
                  </div>
                </div>
                <div className="form-group-custom">
                  <label>New Password:</label>
                  <div className="password-wrapper">
                    <input
                    type={!showPassword ? 'password': 'text'}
                    className="form-control" 
                    name="newPassword" 
                    required
                    value={newPassword}
                    onChange={e => handleChange(e)}
                    id="newPassword" />
                    <span  onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE': 'SHOW'}</span>
                  </div>
                </div>
                <div className="form-group-custom">
                  <label>Confirm Password:</label>
                  <div className="password-wrapper">
                    <input
                    type={!showPassword ? 'password': 'text'}
                    className="form-control" 
                    name="password2" 
                    required
                    value={password2}
                    onChange={e => handleChange(e)}
                    id="password2" />
                    <span  onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE': 'SHOW'}</span>
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
        </div>}

        { homeView === "UpdateOrgView" && <div className="updateorgdetails">
          <div className="og-title-update">Update Organization</div>
          <div>
            <div className="logo-wrapper">
              <div className="upload-text">Upload Logo:</div>
              <div className="logo-preview">
                <div className="preview">
                  <img src={organization && organization.logo ? organization.logo : microsoftlogo} alt="microsoft" className="logoimg" />
                </div>
                <div>
                  <input onChange={e => handleChooseFile(e)} type="file" name="file" className="form-control" />
                </div>
              </div>
            </div>
            <div className="choosetheme">
              <div className="upload-text">Choose Theme:</div>
              <div>
                <select name="theme" id="theme" onChange={e => setOrgDetails({...orgDetails, theme: e.target.value})} className="form-select">
                  <option>Select Theme</option>
                  <option value="dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                </select>
              </div>
            </div>
            <div className="upload-btn-div">
              <button onClick={() => handleUpdateOrgInfo()} className="btn btn-primary text-uppercase">Upload</button>
            </div>
          </div>
        </div>}
      </div>
    </main>
  );
}

export default Home;