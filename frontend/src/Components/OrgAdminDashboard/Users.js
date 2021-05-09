import React from 'react';

const Users = ({ users }) => {
  return (
    <main>
      <div className="text-center text-uppercase">Users</div>
      <div className="organizations">
        <div className="projects">
          <div className="card-project">
            <div className="card-bodys">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    { users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.emp_id}</td>
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


      </div>
    </main>
  );
}

export default Users;