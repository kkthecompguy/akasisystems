import {combineReducers} from 'redux';
import AuthReducer from './auth';
import superAdminReducer from './superadmin';
import orgAdminReducer from './orgadmin';
import usersReducer from './users';

export default combineReducers({
    auth: AuthReducer,
    superadmin: superAdminReducer,
    orgadmin: orgAdminReducer,
    users: usersReducer
});