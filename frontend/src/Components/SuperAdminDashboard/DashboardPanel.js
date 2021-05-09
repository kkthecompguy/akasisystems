import React from 'react';

const DashboardPanel = ({ users, issues, orgs, admins }) => {
  const nonAdmins = users.filter(user => user.role !== 'orgadmin');

  return (
    <main>
      <div className="cards">
        <div className="card-single">
          <div>
            <h1>{orgs}</h1>
            <span>Organisations</span>
          </div>
          <div>
            <span className="las la-sitemap"></span>
          </div>
        </div>
        <div className="card-single">
          <div>
            <h1>{users.length}</h1>
            <span>Users</span>
          </div>
          <div>
            <span className="las la-users"></span>
          </div>
        </div>
        <div className="card-single">
          <div>
            <h1>{issues}</h1>
            <span>Issues</span>
          </div>
          <div>
            <span className="las la-clipboard-list"></span>
          </div>
        </div>
        <div className="card-single">
          <div>
            <h1>$6k</h1>
            <span>Income</span>
          </div>
          <div>
            <span className="lab la-google-wallet"></span>
          </div>
        </div>
      </div>

      <div className="recent-grid">
        <div className="projects">
          <div className="card-project">
            <div className="card-headers">
              <h3 className="title">Users</h3>
              <button>See all <span className="las la-arrow-right"></span></button>
            </div>
            <div className="card-bodys">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    { nonAdmins.map((user, index) => (
                      <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.department}</td>
                    </tr>
                    )) } 
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="customers">
          <div className="card-project">

            <div className="card-headers">
              <h3 className="title">Administrators</h3>
              <button>See all <span className="las la-arrow-right"></span></button>
            </div>

            <div className="card-bodys">
              { admins.map((admin, index) => (
                <div key={index} className="customer">
                <div className="info">
                  <img src={ admin.profile_photo ? admin.profile_photo : "https://images.unsplash.com/photo-1617722944387-5166b39cd735?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"} width="40px" height="40px" alt="" />
                  <div>
                    <h4>{admin.name}</h4>
                    <small>{admin.role}</small>
                  </div>
                </div>
                <div className="contact">
                  <span className="las la-user-circle"></span>
                  <span className="las la-comment"></span>
                  <span className="las la-phone"></span>
                </div>
              </div>
              )) } 

            </div>

          </div>
        </div>
      </div>
    </main>
  )
}

export default DashboardPanel;