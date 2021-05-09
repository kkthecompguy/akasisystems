import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeOrgStatus } from '../../actions/superadmin';

const Organization = ({ orgs }) => {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const dispatch = useDispatch();

  return (
    <main>
      <div className="text-center text-uppercase">Organisation</div>
      <div className="organizations">
        <div className="projects">
          <div className="card-project"> 
            <div className="card-bodys">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Organization Name</th>
                      <th>Administration</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    { orgs.map((org, index) => (
                      <tr key={index}>
                      <td>{org.org_name}</td>
                      <td>{org.administrator}</td>
                      <td>
                        {org.org_status ? (
                          <span className="text-success">enabled</span>
                        ): (
                          <span className="text-danger">disabled</span>
                        )}
                      </td>
                      <td>
                        { org.org_status ? <i data-bs-toggle="modal" data-bs-target="#lockModal" onClick={() => setSelectedOrg(org)} className="las la-lock"></i> : <i className="las la-pencil-alt" data-bs-toggle="modal" onClick={() => setSelectedOrg(org)} data-bs-target="#openModal"></i> }
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

      <div className="col-md-8">
        <div
          className="modal fade"
          id="lockModal"
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
                { selectedOrg && (
                  <>
                    <div className="text-center biggerfont"><i className="las la-info-circle"></i></div>
                    <div>Are you sure you want to disabled this organization</div>
                    <div className="statusbtns">
                      <button onClick={() => dispatch(changeOrgStatus(selectedOrg.org_id, false))} className="btn btn-danger btn-sm" data-bs-dismiss="modal">Yes</button>
                      <button className="btn btn-warning btn-sm" data-bs-dismiss="modal">Cancel</button>
                    </div>
                  </>
                ) }
              </div>
            </div>
          </div>
        </div>
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
              { selectedOrg && (
                  <>
                    <div className="text-center mt-2 mb-3"><i className="las la-info-circle"></i></div>
                    <div>Are you sure you want to enabled this organization</div>
                    <div className="statusbtns">
                      <button onClick={() => dispatch(changeOrgStatus(selectedOrg.org_id, true))} className="btn btn-danger btn-sm" data-bs-dismiss="modal">Yes</button>
                      <button className="btn btn-warning btn-sm" data-bs-dismiss="modal">Cancel</button>
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

export default Organization;