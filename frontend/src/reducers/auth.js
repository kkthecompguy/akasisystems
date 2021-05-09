import * as actionTypes from '../actions/types';
import Cookie from 'js-cookie';

const token = Cookie.getJSON('token') || null;
const user = Cookie.getJSON('user') || null;

const initialState = {
  token: token,
  user: user,
  loading: false,
  isAuthenticated: token ? true : false
}

const authReducer = function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.AUTH_START_REQUEST:
    case actionTypes.FORGOT_PASSWORD_REQUEST:
    case actionTypes.PASSWORD_RESET_REQUEST:
      return {
        ...state,
        loading: true
      }
    case actionTypes.AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        loading: false,
        isAuthenticated: true
      }
    case actionTypes.AUTH_LOGIN_FAIL:
    case actionTypes.USER_LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
      }
    case actionTypes.FORGOT_PASSWORD_SUCCESS:
    case actionTypes.PASSWORD_RESET_SUCCESS:
    case actionTypes.FORGOT_PASSWORD_FAIL:
    case actionTypes.PASSWORD_RESET_FAIL:
      return {
        ...state,
        loading: false
      }
    default:
      return state;
  }
}

export default authReducer;