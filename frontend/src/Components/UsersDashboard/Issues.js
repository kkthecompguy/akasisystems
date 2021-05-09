import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { resolveIssue } from '../../actions/users';
import axios from 'axios';


const Issues = ({ myissues, issues }) => {
  const [relatedIssue, setRelatedIssue] = useState('ActionButtons');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [message, setMessage] = useState('');
  const token = useSelector(state => state.auth.token);

  const dispatch = useDispatch();

  const handleSubmit = async () => {
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

  const handleReports = () => {
    const config = {
      headers: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          responseType: 'blob'
        }
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
      { relatedIssue === 'ActionButtons' && <div className="issues-action-btns">
        <button onClick={() => setRelatedIssue('MyIssues')} className="btn btn-primary text-uppercase issuebtns">My Issues</button>
        <button onClick={() => setRelatedIssue('IssuesAssigned')} className="btn btn-primary text-uppercase issuebtns">Issues Assigned To Me</button>
      </div> }


      { relatedIssue === "MyIssues" && (
        <React.Fragment>
          <div className="text-center text-uppercase">My Issues</div>
          <div className="issues-addressed-to-me"><button onClick={() => setRelatedIssue("IssuesAssigned")} className="btn btn-primary">View Issues Assigned To Me <i className="las la-arrow-circle-right"></i></button></div>
          <div className="organizations" id="myreports">
            <div className="projects">
              <div className="card-project">
                <div className="card-bodys">
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Issue ID</th>
                          <th>Issue</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        { myissues.map((issue, index) => (
                          <tr key={index}>
                            <td>{issue.issue_id}</td>
                            <td>{issue.message}</td>
                            <td>
                              {issue.status ? <span className="text-success">resolved</span> : <span className="text-danger">pending</span>}
                            </td>
                            <td>{issue.resolve_message}</td>
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
            <button onClick={() => handleMyReports(myissues)} className="btn btn-primary custom-label text-uppercase">Generate Report</button>
          </div>
        </React.Fragment>
      ) }


      { relatedIssue === "IssuesAssigned" && (
        <React.Fragment>
          <div className="text-center text-uppercase">Issues Assigned To Me</div>
          <div className="issues-addressed-to-me"><button onClick={() => setRelatedIssue("MyIssues")} className="btn btn-primary">View My Issues <i className="las la-arrow-circle-right"></i></button></div>
          <div className="organizations">
            <div className="projects">
              <div className="card-project">
                <div className="card-bodys">
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Issue ID</th>
                          <th>Issue</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        { issues.map((issue, index) => (
                          <tr key={index}>
                            <td>{issue.issue_id}</td>
                            <td>{issue.message}</td>
                            <td>
                              {issue.status ? <span className="text-success">resolved</span> : <span className="text-danger">pending</span>}
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
            <button onClick={() => handleReports(issues)} className="btn btn-primary custom-label text-uppercase">Generate Report</button>
          </div>

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
                          <button onClick={() => handleSubmit()} className="btn btn-primary btn-sm" data-bs-dismiss="modal">Resolve</button>
                        </div>
                      </>
                    ) }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) }
    </main>
  );
}

export default Issues;