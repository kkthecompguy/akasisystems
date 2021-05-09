import * as actionTypes from './types';
import axios from 'axios';
import { saveAs } from 'file-saver';

export const getProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.USER_PROFILE_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`/api/v1/users/profile`, config);
    dispatch({
      type: actionTypes.USER_PROFILE_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.USER_PROFILE_FAIL });
  }
}

export const getOrgInfo = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.USER_ORGINFO_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`/api/v1/users/organization`, config);
    dispatch({
      type: actionTypes.USER_ORGINFO_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.USER_ORGINFO_FAIL });
  }
}

export const changeAvatar = (base64EncodedImage) => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.USER_AVATAR_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const data = JSON.stringify({base64EncodedImage});
    await axios.put(`/api/v1/users/avatar`, data, config);
    dispatch({ type: actionTypes.USER_AVATAR_SUCCESS });
    await dispatch(getProfile());
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.USER_AVATAR_FAIL });
  }
}

export const updateInfo = formData => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.USERINFO_UPD_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const data = JSON.stringify(formData);
    await axios.put(`/api/v1/users/update/info`, data, config);
    dispatch({ type: actionTypes.USERINFO_UPD_SUCCESS });
    await dispatch(getProfile());

    return true;
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.USERINFO_UPD_FAIL });
    return false;
  }
}

export const myIssues = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.USER_ISSUES_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`/api/v1/users/myissues`, config);
    dispatch({
      type: actionTypes.USER_ISSUES_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.USER_ISSUES_FAIL });
  }
}

export const raisedIssues = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.RAISED_ISSUES_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.get(`/api/v1/users/issuesraisedtome`, config);
    dispatch({
      type: actionTypes.RAISED_ISSUES_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.RAISED_ISSUES_FAIL });
  }
}

export const createIssue = issue => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.CREATE_ISSUE_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
    const data = JSON.stringify(issue);
    const res = await axios.post(`/api/v1/users/create/issue`, data ,config);
    dispatch({
      type: actionTypes.CREATE_ISSUE_SUCCESS,
      payload: res.data
    });
    await dispatch(myIssues());
    await dispatch(raisedIssues());

    return true;
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.CREATE_ISSUE_FAIL });
    return false;
  }
}

export const resolveIssue = (message, issue) => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.RESOLVE_ISSUES_REQUEST });
    const { auth: { token } } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    const data = JSON.stringify({message});
    const res = await axios.post(`/api/v1/users/resolve/issue/${issue.issue_id}`, data ,config);
    dispatch({
      type: actionTypes.RESOLVE_ISSUES_SUCCESS,
      payload: res.data
    });
    await dispatch(myIssues());
    await dispatch(raisedIssues());

    return true
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.RESOLVE_ISSUE_FAIL });
    return false;
  }
}

export const createAndGenerateMyReport = async issues => (dispatch, getState) => {
  try {
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    if (issues.length === 0) {
      return;
    } else {
      const data = JSON.stringify({issues})
      axios.post('/api/v1/users/reports', data, config)
      .then(() => axios.get('users/reports/get', { responseType: 'blob', headers: { Authorization: `Bearer ${token}` } }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        saveAs(pdfBlob, `report-${Date.now()}.pdf`);
      })
    }
  } catch (error) {
    console.log(error);
  }
}

export const createAndGenerateReport = async issues => (dispatch, getState) => {
  try {
    const { auth: { token } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    if (issues.length === 0) {
      return;
    } else {
      const data = JSON.stringify({issues})
      axios.post('/users/reports/generate', data, config)
      .then(() => axios.get('/api/v1/users/reports', { responseType: 'blob', headers: { Authorization: `Bearer ${token}` } }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        saveAs(pdfBlob, `report-${Date.now()}.pdf`);
      })
    }
  } catch (error) {
    console.log(error);
  }
}