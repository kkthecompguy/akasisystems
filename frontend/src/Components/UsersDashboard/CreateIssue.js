import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createIssue } from '../../actions/users';
import Swal from 'sweetalert2';

const CreateIssue = ({ profile }) => {
  const [formData, setFormData] = useState({
    message: '',
    title: '',
    category: '',
    priority: '',
    location: '',
    base64EncodedImage: ''
  });
  const [errors, setErrors] = useState('');
  const orgAdmin = useSelector(state => state.users.organization['org_admin']);
  const supervisor = useSelector(state => state.users.organization['supervisor']);
  const manager = useSelector(state => state.users.organization['manager']);
  const organizationId = useSelector(state => state.users.organization['org_id']);
  const userId = useSelector(state => state.users.profile['emp_id']);
  const dispatch = useDispatch();

  const { message, title, category, priority, location, base64EncodedImage } = formData;

  const handleChange = e => {
    setFormData(current => {
      return {...current, [e.target.name]: e.target.value}
    })
  }

  const handleFileChange = e => {
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onloadend = () => {
      setFormData(current => {
        return {...current, base64EncodedImage: reader.result}
      })
    }
  }

  const handleCreateIssueToSupervisor = async () => {
    if (message.trim() === "") return;
    if (!supervisor) {
      setErrors('Organization does not have supervisor at the moment');
      return;
    } else {
      const issue = {
        message,
        createdAt: new Date().toISOString(),
        recipient: supervisor,
        orgId: organizationId,
        title,
        category,
        priority,
        location,
        base64EncodedImage
      }
      const success = await dispatch(createIssue(issue));
      if (success) {
        setFormData(current => {
          return {...current, message: '', title: '', category: '', priority: '', location: '', base64EncodedImage: ''}
        })
        setErrors('');
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        
        Toast.fire({
          icon: 'success',
          title: 'Issue created successfully'
        });
      } 
    }
  }

  const handleCreateIssueToOrgAdmin = async () => {
    if (message.trim() === "") return;
    if (!orgAdmin) {
      setErrors('Organization does not have administrator at the moment');
      return;
    } else {
      const issue = {
        message,
        createdAt: new Date().toISOString(),
        recipient: orgAdmin,
        orgId: organizationId,
        title,
        category,
        priority,
        location,
        base64EncodedImage
      }
      const success = await dispatch(createIssue(issue));
      if (success) {
        setFormData(current => {
          return {...current, message: '', title: '', category: '', priority: '', location: '', base64EncodedImage: ''}
        })
        setErrors('');
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        
        Toast.fire({
          icon: 'success',
          title: 'Issue created successfully'
        });
      } 
    }
  }

  const handleCreateIssueToManager = async () => {
    if (message.trim() === "") return;
    if (!manager) {
      setErrors('Organization does not have manager at the moment');
      return;
    } else {
      const issue = {
        message,
        createdAt: new Date().toISOString(),
        recipient: manager,
        orgId: organizationId,
        title,
        category,
        priority,
        location,
        base64EncodedImage
      }
      const success = await dispatch(createIssue(issue));
      if (success) {
        setFormData(current => {
          return {...current, message: '', title: '', category: '', priority: '', location: '', base64EncodedImage: ''}
        });
        setErrors('');
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        
        Toast.fire({
          icon: 'success',
          title: 'Issue created successfully'
        });
      } 
    }
  }

  return (
    <main>
      <div className="card card-body">
        <div className="updateadmininfo">
          <div className="admin-name-wrapper"> 
            <div className="text-center">
              <span>Welcome { profile && profile.name }</span>
            </div>
          </div>
          <div> 
              <div className="form-group mb-3">
                <label>Title</label>
                <input
                 type="text" 
                 required
                 name="title" 
                 id="title" 
                 className="form-control" 
                 value={title} 
                 onChange={e => handleChange(e)} />
              </div>
              <div className="form-group mb-3">
                <label>Category</label>
                <select required name="category" value={category} className="form-select" onChange={e => handleChange(e)}>
                <option value="">select</option>
                  <option value="category1">Category1</option>
                  <option value="category2">Category2</option>
                  <option value="category3">Category3</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label>Priority</label>
                <select required name="priority" value={priority} className="form-select" onChange={e => handleChange(e)}>
                  <option value="">select</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label>Location</label>
                <input
                 type="text" 
                 required
                 id="location"
                 name="location" 
                 value={location} 
                 className="form-control" 
                 onChange={e => handleChange(e)} 
                 />
              </div>
              <div className="form-group mb-3">
                <label>Upload Photo</label>
                <input
                 type="file" 
                 name="file" 
                 className="form-control" 
                 onChange={e => handleFileChange(e)} 
                 />
              </div>
              <div className="form-group mb-3">
                <label>Message</label>
                <textarea required rows='5' cols='10' name="message" value={message} onChange={e => handleChange(e)} className="form-control" id="message"></textarea>
              </div>
              <div className="text-center text-uppercase mt-4 mb-4">SEND TO</div>
              {errors && <div className="pwd-error text-center mt-2 mb-2">
                  {errors}
                </div>}
              <div className="form-group-btns">
                <button disabled={userId === supervisor} onClick={() => handleCreateIssueToSupervisor()} type="submit" className="btn btn-primary btn-sm text-uppercase">Supervisor</button>
                <button onClick={() => handleCreateIssueToOrgAdmin()} type="submit" className="btn btn-primary btn-sm text-uppercase">Org Admin</button>
                <button disabled={userId === manager} onClick={() => handleCreateIssueToManager()} type="submit" className="btn btn-primary btn-sm text-uppercase">Manager</button>
              </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CreateIssue;