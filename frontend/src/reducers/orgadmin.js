import * as actionTypes from '../actions/types';

const initialState = {
  users: [],
  orgs: [],
  issues: [],
  profile: {},
  organization: {},
  loading: false
}

const orgAdminReducer = function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ORGADMIN_PROFILE_REQUEST:
    case actionTypes.ORG_PROFILE_REQUEST:
    case actionTypes.ORG_ISSUES_REQUEST:
    case actionTypes.ADMININFO_UPD_REQUEST:
    case actionTypes.ORG_USERS_GET_REQUEST:
    case actionTypes.ADD_USER_REQUEST:
    case actionTypes.UPDATE_AVATAR_REQUEST:
    case actionTypes.ORGRESOLVE_ISSUE_REQUEST:
      return {
        ...state,
        loading: true
      }
    case actionTypes.ORGADMIN_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.payload,
        loading: false
      }
    case actionTypes.ORG_PROFILE_SUCCESS:
      return {
        ...state,
        organization: action.payload,
        loading: false
      }
    case actionTypes.ORG_ISSUES_SUCCESS:
      return {
        ...state,
        issues: action.payload,
        loading: false
      }
    case actionTypes.ORG_USERS_GET_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loading: false
      }
    case actionTypes.ORG_USERS_GET_FAIL:
      return {
        ...state,
        users: [],
        loading: false
      }
    case actionTypes.ORGADMIN_PROFILE_FAIL:
      return {
        ...state,
        profile: {},
        loading: false
      }
    case actionTypes.ORG_PROFILE_FAIL:
      return {
        ...state,
        organization: {},
        loading: false
      }
    case actionTypes.ORG_ISSUES_FAIL:
      return {
        ...state,
        issues: [],
        loading: false
      }
    case actionTypes.ADMININFO_UPD_SUCCESS:
    case actionTypes.ADD_USER_SUCCESS:
    case actionTypes.UPDATE_ORG_SUCCESS:
    case actionTypes.ORGRESOLVE_ISSUE_SUCCESS:
    case actionTypes.ADMININFO_UPD_FAIL:
    case actionTypes.ADD_USER_FAIL:
    case actionTypes.UPDATE_AVATAR_FAIL:
    case actionTypes.ORGRESOLVE_ISSUE_FAIL:
      return {
        ...state,
        loading: false
      }
    default:
      return state;
  }
}

export default orgAdminReducer;