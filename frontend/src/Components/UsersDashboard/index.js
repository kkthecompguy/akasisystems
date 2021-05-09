import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Home from './Home';
import Issues from './Issues';
import Accounts from './Accounts'
import CreateIssue from './CreateIssue';
import { getProfile, getOrgInfo, myIssues, raisedIssues } from '../../actions/users';
import { logout } from '../../actions/auth';

const UsersDashboard = () => {
  const [tabs, setTabs] = useState('Home');
  const { profile, organization, myissues, issues } = useSelector(state => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getOrgInfo());
    dispatch(myIssues());
    dispatch(raisedIssues());
  }, [dispatch]);

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
              <a href="#!" className={ tabs === "Home" ? "active" : ""}><span className="las la-igloo"></span><span>Home</span></a>
            </li>
            <li onClick={() => handleTabChange('Issues')}>
              <a href="#!" className={ tabs === "Issues" ? "active" : ""}><span className="las la-clipboard-list"></span><span>Issues</span></a>
            </li>
            <li onClick={() => handleTabChange('Create Issue')}>
              <a href="#!" className={ tabs === "Create Issue" ? "active" : ""}><span className="las la-clipboard"></span><span>Create Issue</span></a>
            </li>
            <li onClick={() => handleTabChange('Accounts')}>
              <a href="#!" className={ tabs === "Accounts" ? "active" : ""}><span className="las la-user-circle"></span><span>Accounts</span></a>
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

        { tabs === 'Home' && <Home profile={profile} />}
        { tabs === 'Issues' && <Issues myissues={myissues} issues={issues} />}  
        { tabs === 'Create Issue' && <CreateIssue profile={profile} /> }
        { tabs === 'Accounts' && <Accounts profile={profile} />}
      </div>
    </React.Fragment>
  ) 
}

export default UsersDashboard;