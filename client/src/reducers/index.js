import { combineReducers } from 'redux';
import alert from './reducers-alert';
import auth from './reducers-auth';
import profile from './reducers-profile';
import post from './reducers-post';

export default combineReducers({
  alert,
  auth,
  profile,
  post
});
