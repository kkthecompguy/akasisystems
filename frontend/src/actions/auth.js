import * as actionTypes from './types';
import axios from 'axios';
import Cookie from 'js-cookie';

export const superadminlogin = formData => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.AUTH_START_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const data = JSON.stringify(formData);

    const res = await axios.post('/api/v1/superadmin/login', data, config);
    dispatch({
      type: actionTypes.AUTH_LOGIN_SUCCESS,
      payload: { token: res.data.token, user: { id: res.data.id, role: res.data.role, email: res.data.email, name: res.data.name }}
    });
    const { auth: { token, user } } = getState();
    Cookie.set('token', token);
    Cookie.set('user', JSON.stringify(user));

    return true
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.AUTH_LOGIN_FAIL });
    return false
  }
}

export const orgadminlogin = formData => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.AUTH_START_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const data = JSON.stringify(formData);

    const res = await axios.post('/api/v1/orgadmin/login', data, config);
    dispatch({
      type: actionTypes.AUTH_LOGIN_SUCCESS,
      payload: { token: res.data.token, user: { id: res.data.id, role: res.data.role, email: res.data.email, name: res.data.name, organizationId: res.data.organizationId }}
    });
    const { auth: { token, user } } = getState();
    Cookie.set('token', token);
    Cookie.set('user', JSON.stringify(user));

    return true
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.AUTH_LOGIN_FAIL });
    return false
  }
}

export const userslogin = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.AUTH_START_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const data = JSON.stringify(formData);

    const res = await axios.post(`/api/v1/users/${formData.role}/login`, data, config);
    dispatch({
      type: actionTypes.AUTH_LOGIN_SUCCESS,
      payload: { token: res.data.token, user: { id: res.data.id, role: res.data.role, email: res.data.email, name: res.data.name }}
    });
    const { auth: { token, user } } = getState();
    Cookie.set('token', token);
    Cookie.set('user', JSON.stringify(user));

    return true
  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.AUTH_LOGIN_FAIL });
    return false
  }
}

export const logout = () => dispatch => {
  dispatch({ type: actionTypes.USER_LOGOUT });
  Cookie.remove('token');
  Cookie.remove('user');
  window.location.href = "/";
}

export const checkValidToken = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.AUTH_START_REQUEST });

    const { auth: { token, role } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    if (role === "superadmin") {
      const res = await axios.get('/api/v1/superadmin/profile', config);
      dispatch({
        type: actionTypes.AUTH_LOGIN_SUCCESS,
        payload: { token: token, user: { id: res.data.id, role: res.data.role, email: res.data.email, name: res.data.name }}
      });
      const user = { id: res.data.id, role: res.data.role, email: res.data.email, name: res.data.name }
      Cookie.set('token', token);
      Cookie.set('user', JSON.stringify(user));

    } else {
      const res = await axios.get('/api/v1/users/profile', config);
      dispatch({
        type: actionTypes.AUTH_LOGIN_SUCCESS,
        payload: { token: token, user: { id: res.data.id, role: res.data.role, email: res.data.email, name: res.data.name, organizationId: res.data.organizationId }}
      });
      const user = { id: res.data.id, role: res.data.role, email: res.data.email, name: res.data.name, organizationId: res.data.organizationId }
      Cookie.set('token', token);
      Cookie.set('user', JSON.stringify(user)); 
    }

  } catch (error) {
    console.log(error);
    dispatch({ type: actionTypes.AUTH_LOGIN_FAIL }); 
    Cookie.remove('token');
    Cookie.remove('user');
  }
}

export const forgotPassword = formData => async dispatch => {
  try {
    dispatch({ type: actionTypes.FORGOT_PASSWORD_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const data = JSON.stringify(formData);

    if (formData.role === 'superadmin') {
      await axios.post('/api/v1/superadmin/forgotpassword', data, config);
      dispatch({ type: actionTypes.FORGOT_PASSWORD_SUCCESS });
      return true;
    } else {
      await axios.post('/api/v1/users/forgotpassword', data, config);
      dispatch({ type: actionTypes.FORGOT_PASSWORD_SUCCESS });
      return true;
    }
  } catch (error) {
    dispatch({ type: actionTypes.FORGOT_PASSWORD_FAIL });
    return false;
  }
}

export const resetPassword = formData => async dispatch => {
  try {
    dispatch({ type: actionTypes.PASSWORD_RESET_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const data = JSON.stringify(formData);

    if (formData.role === 'superadmin') {
      await axios.post('/api/v1/superadmin/resetpassword', data, config);
      dispatch({ type: actionTypes.PASSWORD_RESET_SUCCESS });
      return true;
    } else {
      await axios.post('/api/v1/users/resetpassword', data, config);
      dispatch({ type: actionTypes.PASSWORD_RESET_SUCCESS });
      return true;
    }
  } catch (error) {
    dispatch({ type: actionTypes.PASSWORD_RESET_FAIL });
    return false;
  }
}