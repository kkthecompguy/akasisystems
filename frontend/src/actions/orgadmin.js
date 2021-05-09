import * as actionTypes from './types';
import axios from 'axios';

export const allUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.ORG_USERS_GET_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`/api/v1/orgadmin/users`, config);
    dispatch({
      type: actionTypes.ORG_USERS_GET_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.ORG_USERS_GET_FAIL });
  }
}


export const allIssues = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.ORG_ISSUES_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`/api/v1/orgadmin/issues`, config);
    dispatch({
      type: actionTypes.ORG_ISSUES_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.ORG_ISSUES_FAIL });
  }
}

export const getProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.ORGADMIN_PROFILE_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`/api/v1/users/profile`, config);
    dispatch({
      type: actionTypes.ORGADMIN_PROFILE_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.ORGADMIN_PROFILE_FAIL });
  }
}

export const getOrgProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.ORG_PROFILE_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`/api/v1/orgadmin/organization`, config);
    dispatch({
      type: actionTypes.ORG_PROFILE_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.ORG_PROFILE_FAIL });
  }
}

export const updateAdminInfo = formData => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.ADMININFO_UPD_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const data = JSON.stringify(formData);
    await axios.put(`/api/v1/orgadmin/update/info`, data, config);
    dispatch({ type: actionTypes.ADMININFO_UPD_SUCCESS });
    await dispatch(getProfile());
    
    return true
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.ADMININFO_UPD_FAIL });
    return false
  }
}

export const updateOrgInfo = formData => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.UPDATE_ORG_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const data = JSON.stringify(formData);
    await axios.put(`/api/v1/orgadmin/update/org`,data, config);
    dispatch({ type: actionTypes.UPDATE_ORG_SUCCESS });
    await dispatch(getOrgProfile());
    
    return true
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.UPDATE_ORG_FAIL });
    return false
  }
}

export const createUser = formData => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.ADD_USER_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const data = JSON.stringify(formData);
    await axios.post(`/api/v1/orgadmin/adduser`,data, config);
    dispatch({ type: actionTypes.ADD_USER_SUCCESS });
    await dispatch(allUsers());
    
    return true
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.ADD_USER_FAIL });
    return false
  }
}

export const changeAvatar = (base64EncodedImage) => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.UPDATE_AVATAR_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const data = JSON.stringify({base64EncodedImage});
    await axios.put(`/api/v1/orgadmin/avatar`, data, config);
    dispatch({ type: actionTypes.UPDATE_AVATAR_SUCCESS });
    await dispatch(getProfile());
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.UPDATE_AVATAR_FAIL });
  }
}


export const resolveIssue = (message, issue) => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.ORGRESOLVE_ISSUE_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const data = JSON.stringify({message});
    await axios.put(`/api/v1/orgadmin/resolveissue/${issue.issue_id}`, data, config);
    dispatch({ type: actionTypes.ORGRESOLVE_ISSUE_SUCCESS });
    await dispatch(allIssues());

    return true;
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.ORGRESOLVE_ISSUE_FAIL });
    return false
  }
}