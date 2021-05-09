import * as actionTypes from './types';
import axios from 'axios';

export const allOrgs = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.ORGS_GET_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`/api/v1/superadmin/getorgs`, config);
    dispatch({
      type: actionTypes.ORGS_GET_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.ORGS_GET_FAIL });
  }
}

export const allUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.USERS_GET_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`/api/v1/superadmin/getusers`, config);
    dispatch({
      type: actionTypes.USERS_GET_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.USERS_GET_FAIL });
  }
}

export const allIssues = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.ISSUES_GET_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`/api/v1/superadmin/issues`, config);
    dispatch({
      type: actionTypes.ISSUES_GET_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.ISSUES_GET_FAIL });
  }
}

export const getProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.PROFILE_GET_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`/api/v1/superadmin/profile`, config);
    dispatch({
      type: actionTypes.PROFILE_GET_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.PROFILE_GET_FAIL });
  }
}

export const createOrg = formData => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.ORG_CREATE_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const data = JSON.stringify(formData);
    await axios.post(`/api/v1/superadmin/createorg`,data, config);
    dispatch({ type: actionTypes.ORG_CREATE_SUCCESS });
    await dispatch(allOrgs());
    await dispatch(orgadmins());
    
    return true
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.ORG_CREATE_FAIL });
    return false
  }
}

export const orgadmins = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.ADMINS_GET_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: { 
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`/api/v1/superadmin/orgadmins`, config);
    dispatch({ 
      type: actionTypes.ADMINS_GET_SUCCESS, 
      payload: res.data 
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.ADMINS_GET_FAIL });
  }
}

export const changeOrgStatus = (orgId, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.ORG_STATUS_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const data = JSON.stringify({status});
    await axios.put(`/api/v1/superadmin/org/status/update/${orgId}`, data, config);
    dispatch({ type: actionTypes.ORG_STATUS_SUCCESS });
    await dispatch(allOrgs());
    
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.ORG_STATUS_FAIL });
  }
}

export const changeAvatar = (base64EncodedImage) => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.AVATAR_ULPOAD_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const data = JSON.stringify({base64EncodedImage});
    await axios.put(`/api/v1/superadmin/avatar`, data, config);
    dispatch({ type: actionTypes.AVATAR_ULPOAD_SUCCESS });
    await dispatch(getProfile());
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.AVATAR_ULPOAD_FAIL });
  }
}

export const resolveIssue = (message, issue) => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.RESOLVE_ISSUE_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const data = JSON.stringify({message});
    await axios.put(`/api/v1/superadmin/resolveissue/${issue.issue_id}`, data, config);
    dispatch({ type: actionTypes.RESOLVE_ISSUE_SUCCESS });
    await dispatch(allIssues());
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.RESOLVE_ISSUE_FAIL });
  }
}