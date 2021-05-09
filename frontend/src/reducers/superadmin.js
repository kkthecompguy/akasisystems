import * as actionTypes from '../actions/types';

const initialState = {
  users: [],
  orgs: [],
  issues: [],
  admins: [],
  profile: {},
  loading: false
}

const superAdminReducer = function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.PROFILE_GET_REQUEST:
    case actionTypes.ISSUES_GET_REQUEST:
    case actionTypes.USERS_GET_REQUEST:
    case actionTypes.ORGS_GET_REQUEST:
    case actionTypes.ORG_CREATE_REQUEST:
    case actionTypes.ADMINS_GET_REQUEST:
    case actionTypes.AVATAR_ULPOAD_REQUEST:
    case actionTypes.RESOLVE_ISSUE_REQUEST:
      return {
        ...state,
        loading: true
      }
    case actionTypes.PROFILE_GET_SUCCESS:
      return {
        ...state,
        profile: action.payload,
        loading: false
      }
    case actionTypes.ISSUES_GET_SUCCESS:
      return {
        ...state,
        issues: action.payload,
        loading: false
      }
    case actionTypes.ORGS_GET_SUCCESS:
      return {
        ...state,
        orgs: action.payload,
        loading: false
      }
    case actionTypes.USERS_GET_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loading: false
      }
    case actionTypes.ADMINS_GET_SUCCESS:
      return {
        ...state,
        admins: action.payload,
        loading: false
      }
    case actionTypes.ORG_CREATE_SUCCESS:
    case actionTypes.AVATAR_ULPOAD_SUCCESS:
    case actionTypes.RESOLVE_ISSUE_SUCCESS:
    case actionTypes.ORG_CREATE_FAIL:
    case actionTypes.AVATAR_ULPOAD_FAIL:
    case actionTypes.RESOLVE_ISSUE_FAIL:
      return {
        ...state,
        loading: false
      }
    case actionTypes.PROFILE_GET_FAIL:
      return {
        ...state,
        profile: {},
        loading: false
      }
    case actionTypes.USERS_GET_FAIL:
      return {
        ...state,
        users: [],
        loading: false
      }
    case actionTypes.ISSUES_GET_FAIL:
      return {
        ...state,
        issues: [],
        loading: false
      }
    case actionTypes.ORGS_GET_FAIL:
      return {
        ...state,
        orgs: [],
        loading: false
      }
    case actionTypes.ADMINS_GET_FAIL:
      return {
        ...state,
        admins: [],
        loading: false
      }
    default:
      return state;
  }
}

export default superAdminReducer;