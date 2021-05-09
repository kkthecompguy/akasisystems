import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Accounts from './Account';
import CreateOrg from './CreateOrg';
import DashboardPanel from './DashboardPanel';
import Issues from './Issues';
import Organization from './Organization';
import { allIssues, allOrgs, getProfile, allUsers, orgadmins } from '../../actions/superadmin';
import { logout } from '../../actions/auth';


const SuperAdminDashboard = () => {
  const [tabs, setTabs] = useState('DashboardPanel');
  const { users, profile, issues, orgs, admins } = useSelector(state => state.superadmin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile());
    dispatch(allOrgs());
    dispatch(allUsers());
    dispatch(allIssues());
    dispatch(orgadmins());
  }, [dispatch]);

  const handleTabChange = tab => {
    setTabs(tab);
  }
  const addressIssues = issues.filter(issue => issue.recipient_id === profile.sadmin_id);

  return (
    <React.Fragment>
      <input type="checkbox" id="nav-toggle" />
      <div className="sidebar">
        <div className="sidebar-brand">
          <h3><span className="lab la-accusoft"></span><span>Akasi Systems</span></h3>
        </div>

        <div className="sidebar-menu">
          <ul>
            <li onClick={() => handleTabChange('DashboardPanel')}>
              <a href="#!"  className={tabs === "DashboardPanel" ? "active": ""}><span className="las la-igloo"></span><span>Dashboard</span></a>
            </li>
            <li onClick={() => handleTabChange('Issues')}>
              <a href="#!" className={tabs === "Issues" ? "active": ""}><span className="las la-clipboard-list"></span><span>Issues</span></a>
            </li>
            <li onClick={() => handleTabChange('Organisations')}>
              <a href="#!" className={tabs === "Organisations" ? "active": ""}><span className="las la-sitemap"></span><span>Organisations</span></a>
            </li>
            <li onClick={() => handleTabChange('Create Organization')}>
              <a href="#!" className={tabs === "Create Organization" ? "active": ""}><span className="las la-industry"></span><span>Create Organization</span></a>
            </li>
            <li onClick={() => handleTabChange('Accounts')}>
              <a href="#!" className={tabs === "Accounts" ? "active": ""}><span className="las la-user-circle"></span><span>Accounts</span></a>
            </li>
            <li onClick={() => handleTabChange('Tasks')}>
              <a href="#!" className={tabs === "Tasks" ? "active": ""}><span className="las la-clipboard-list"></span><span>Tasks</span></a>
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
            Dashboard
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
              <small>Logout</small>
            </div>
          </div>
        </header>

        { tabs === 'DashboardPanel' && <DashboardPanel users={users} issues={issues.length} orgs={orgs.length} admins={admins} />}
        { tabs === 'Issues' && <Issues issues={issues} addressIssues={addressIssues} />}
        { tabs === 'Organisations' && <Organization orgs={orgs} />}
        { tabs === 'Create Organization' && <CreateOrg />}
        { tabs === 'Accounts' && <Accounts profile={profile} />}
      </div>
    </React.Fragment>
  ) 
}

export default SuperAdminDashboard;