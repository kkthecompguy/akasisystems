import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';
import { resolveIssue } from '../../actions/orgadmin';

const Issues = ({ issues, addressIssues }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [message, setMessage] = useState('')
  const [toggleIssues, setToggleIssues] = useState('ALL ISSUES');
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();

  const handleResolveIssue = async() => {
    if (message.trim() === "") {
      return;
    } else {
      const success = await dispatch(resolveIssue(message, selectedIssue));
      if (success) {
        setMessage('');
        setSelectedIssue(null)
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
        })
        
        Toast.fire({
          icon: 'success',
          title: 'Issue resolved successfully'
        });
      }
    }
  }

  const handleMyReports = issues => {
    console.log(issues)
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        responseType: 'blob'
      }
    }
    if (issues.length === 0) {
      return;
    } else {
      const data = JSON.stringify({issues})
      axios.post('/api/v1/users/reports', data, config)
      .then((res) => {
        axios.get('/api/v1/users/reports', { headers: {Authorization: `Bearer ${token}`}, responseType: 'blob' })
        .then((res) => { 
          const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `report-${Date.now()}.pdf`);
          document.body.appendChild(link);
          link.click();
        })
        .catch(err => console.log(err))
      })
      .catch(err => console.log(err));
    }
  }

  const handleReports = (issues) => {
    console.log(issues)
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        responseType: 'blob'
      }
    }
    if (issues.length === 0) {
      return;
    } else {
      const data = JSON.stringify({issues})
      axios.post('/api/v1/users/reports', data, config)
      .then(() => {
        axios.get('/api/v1/users/reports', { headers: {Authorization: `Bearer ${token}`}, responseType: 'blob' })
        .then((res) => { 
          const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `report-${Date.now()}.pdf`);
          document.body.appendChild(link);
          link.click();
        })
        .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    }
  }

  return (
    <main>
      <div className="text-center text-uppercase">{ toggleIssues === "ALL ISSUES" ? 'Issues': "Issues Addressed To Me"}</div>
      { toggleIssues === "ALL ISSUES" ? <div className="issues-addressed-to-me"><button onClick={() => setToggleIssues("ADDRESS TO ME")} className="btn btn-primary">View Issues Addressed To Me <i className="las la-arrow-circle-right"></i></button></div>: <div className="issues-addressed-to-me"><button onClick={() => setToggleIssues("ALL ISSUES")} className="btn btn-primary"><i className="las la-arrow-circle-left"></i> View All Issues</button></div>}
      
      { toggleIssues === "ALL ISSUES" && (
        <>
        <div className="organizations">
          <div className="projects">
            <div className="card-project">
              <div className="card-bodys">
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Issues ID</th>
                        <th>Issue</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      { issues.map((issue, index) => (
                        <tr key={index}>
                        <td>{issue.issue_id}</td>
                        <td>{issue.message}</td>
                        <td>
                          {issue.status ? (
                            <span className="text-success">resolved</span>
                          ): (
                            <span className="text-danger">pending</span>
                          )}
                        </td>
                      </tr>
                      )) }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="generate-report">
          <button onClick={() => handleMyReports(issues)} className="btn btn-primary custom-label text-uppercase">Generate Report</button>
        </div>
        </>
      ) }

      { toggleIssues === "ADDRESS TO ME" && (
        <>
        <div className="organizations">
          <div className="projects">
            <div className="card-project">
              <div className="card-bodys">
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Issues ID</th>
                        <th>Issue</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      { addressIssues.map((issue, index) => (
                        <tr key={index}>
                        <td>{issue.issue_id}</td>
                        <td>{issue.message}</td>
                        <td>
                          {issue.status ? (
                            <span className="text-success">resolved</span>
                          ): (
                            <span className="text-danger">pending</span>
                          )}
                        </td>
                        <td>
                        { issue.status ? <span><i className="las la-lock"></i>No action</span>  : <i className="las la-pencil-alt" data-bs-toggle="modal" onClick={() => setSelectedIssue(issue)} data-bs-target="#openModal"></i> }
                        </td>
                      </tr>
                      )) }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="generate-report">
          <button onClick={() => handleReports(addressIssues)} className="btn btn-primary custom-label text-uppercase">Generate Report</button>
        </div>
        </>
      ) }

      <div className="col-md-8">
        <div
          className="modal fade"
          id="openModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          style={{ display: "none", }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content profile-modal">
              <div className="text-right">
                <button
                  type="button"
                  className="btn closeModalBtn"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="las fa-times"></i>
                </button>
              </div>
              <div className="modal-body text-center px-5 pb-2 promotion">
                { selectedIssue && (
                  <>
                    <div className="text-center">Resolve Issue</div>
                    <textarea className="form-control" name="message" id="message" rows="5" cols="3" onChange={e => setMessage(e.target.value)}></textarea>
                    <div className="statusbtns">
                      <button onClick={handleResolveIssue} className="btn btn-primary btn-sm" data-bs-dismiss="modal">Resolve</button>
                    </div>
                  </>
                ) }
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Issues;