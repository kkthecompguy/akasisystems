import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Home from './Home';
import Users from './Users';
import AddUser from './AddUser';
import Issues from './Issues';
import Accounts from './Accounts';
import { getProfile, getOrgProfile, allIssues, allUsers } from '../../actions/orgadmin';
import { logout } from '../../actions/auth';

const OrgAdminDashboard = () => {
  const [tabs, setTabs] = useState('Home');
  const { profile, organization, issues, users } = useSelector(state => state.orgadmin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getOrgProfile());
    dispatch(allIssues());
    dispatch(allUsers());
  }, [dispatch]);

  const addressIssues = issues.filter(issue => issue.recipient_id === profile.emp_id);
  const otherUsers = users.filter(user => user.emp_id !== profile.emp_id)

  const handleTabChange = tab => {
    setTabs(tab);
  }

  return (
    <React.Fragment>
      <input type="checkbox" id="nav-toggle" />
      <div className="sidebar">
        <div className="sidebar-brand">
          <h3><span className="lab la-accusoft"></span><span>Akasi Systems</span></h3>
        </div>

        <div className="sidebar-menu">
          <ul>
            <li onClick={() => handleTabChange('Home')}>
              <a href="#!" className={tabs === "Home" ? "active": ""}><span className="las la-igloo"></span><span>Home</span></a>
            </li>
            <li onClick={() => handleTabChange('Issues')}>
              <a href="#!" className={tabs === "Issues" ? "active": ""}><span className="las la-clipboard-list"></span><span>Issues</span></a>
            </li> 
            <li onClick={() => handleTabChange('Users')}>
              <a href="#!" className={tabs === "Users" ? "active": ""}><span className="las la-users"></span><span>Users</span></a>
            </li>
            <li onClick={() => handleTabChange('Add User')}>
              <a href="#!" className={tabs === "Add User" ? "active": ""}><span className="las la-user"></span><span>Add User</span></a>
            </li>
            <li onClick={() => handleTabChange('Accounts')}>
              <a href="#!" className={tabs === "Accounts" ? "active": ""}><span className="las la-user-circle"></span><span>Accounts</span></a>
            </li> 
          </ul>
        </div>
      </div>
      
      <div className="main-content">
        <header>
          <h2>
            <label htmlFor="nav-toggle">
              <span className="las la-bars"></span>
            </label>
            Organization: {organization && organization.org_name}
          </h2>

          <div className="search-wrapper">
            <span className="las la-search"></span>
            <input type="search" placeholder="Search here" />
          </div>

          <div className="user-wrapper">
            <img src={ profile && profile.profile_photo ? profile.profile_photo : "https://images.unsplash.com/photo-1617722944387-5166b39cd735?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"} alt="" height="40px" width="40px" />
            <div onClick={() => dispatch(logout())} className="logout">
              <h4>{profile && profile.name}</h4>
              <small>{profile && profile.role}</small>
            </div>
          </div>
        </header>

        { tabs === 'Home' && <Home organization={organization} profile={profile} />}
        { tabs === 'Issues' && <Issues issues={issues} addressIssues={addressIssues} />}
        { tabs === 'Users' && <Users users={otherUsers} />}
        { tabs === 'Add User' && <AddUser />}
        { tabs === 'Accounts' && <Accounts profile={profile} />}
      </div>
    </React.Fragment>
  ) 
}

export default OrgAdminDashboard;