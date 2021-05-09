import * as actionTypes from '../actions/types';

const initialState = {
  issues: [],
  myissues: [],
  profile: {},
  organization: {},
  loading: false
}

const userReducer = function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.USER_PROFILE_REQUEST:
    case actionTypes.USER_ORGINFO_REQUEST:
    case actionTypes.USER_AVATAR_REQUEST:
    case actionTypes.USERINFO_UPD_REQUEST:
    case actionTypes.USER_ISSUES_REQUEST:
    case actionTypes.RAISED_ISSUES_REQUEST:
    case actionTypes.CREATE_ISSUE_REQUEST:
    case actionTypes.RESOLVE_ISSUES_REQUEST:
      return {
        ...state,
        loading: true
      }
    case actionTypes.USER_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.payload,
        loading: false
      }
    case actionTypes.USER_PROFILE_FAIL:
      return {
        ...state,
        profile: {},
        loading: false
      }
    case actionTypes.USER_ORGINFO_SUCCESS:
      return {
        ...state,
        organization: action.payload,
        loading: false
      }
    case actionTypes.USER_ORGINFO_FAIL:
      return {
        ...state,
        organization: {},
        loading: false
      }
    case actionTypes.USER_ISSUES_SUCCESS:
      return {
        ...state,
        myissues: action.payload,
        loading: false
      }
    case actionTypes.USER_ISSUES_FAIL:
      return {
        ...state, 
        myissues: [],
        loading: false
      }
    case actionTypes.RAISED_ISSUES_SUCCESS:
      return {
        ...state,
        issues: action.payload,
        loading: false
      }
    case actionTypes.RAISED_ISSUES_FAIL:
      return {
        ...state,
        issues: [],
        loading: false
      }
    case actionTypes.USER_AVATAR_SUCCESS:
    case actionTypes.USERINFO_UPD_SUCCESS:
    case actionTypes.CREATE_ISSUE_SUCCESS:
    case actionTypes.RESOLVE_ISSUES_SUCCESS:
    case actionTypes.USER_AVATAR_FAIL:
    case actionTypes.USERINFO_UPD_FAIL:
    case actionTypes.CREATE_ISSUE_FAIL:
    case actionTypes.RESOLVE_ISSUE_FAIL:
      return {
        ...state,
        loading: false
      }
    default:
      return state;
  }
}

export default userReducer;