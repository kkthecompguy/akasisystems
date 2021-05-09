import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { changeAvatar } from '../../actions/users';

const Accounts = ({ profile }) => {
  const filePicker = useRef();
  const dispatch = useDispatch();

  const handleChooseFile = () => {
    filePicker.current.click();
  }

  const handleSelectedFile = e => {
    if (e.target.files.length === 0) {
      return;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        dispatch(changeAvatar(reader.result));
      }
    }
  }
  return (
    <main>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card card-body">
            <div className="avatar-container">
              <img src={ profile && profile.profile_photo ? profile.profile_photo : "https://images.unsplash.com/photo-1617722944387-5166b39cd735?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"} alt="profilephoto" className="profile-photo" />
              <span className="pencil" onClick={() => handleChooseFile()}><i className="las la-pencil-alt la-2x"></i></span>
              <input ref={filePicker} type="file" name="file" className="filepicker" onChange={e => handleSelectedFile(e)} />
            </div>
            <div className="sadmin-info"> 
              <div className="row">
                <div className="col-md-4 py-2 px-2">
                  <div>User ID:</div>
                  <div>Name:</div>
                  <div>Email:</div>
                  <div>Role:</div>
                  <div>Department:</div>
                </div>
                <div className="col-md-8 py-2 px-2">
                  <div>{profile && profile.work_id}</div>
                  <div>{profile && profile.name}</div>
                  <div>{profile && profile.email}</div>
                  <div>{profile && profile.role}</div>
                  <div>{profile && profile.department}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Accounts;