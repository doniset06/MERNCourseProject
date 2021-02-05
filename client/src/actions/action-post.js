import {
  DELETE_POST,
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from '../actions/types';
import axios from 'axios';
import { setAlert } from '../actions/action-alert';

// GET POSTS
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/posts');

    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

//ADD LIKES
export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`api/posts/likes/${postId}`);
    console.log(res);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

//REMOVE LIKES
export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`api/posts/unlikes/${postId}`);
    console.log(res);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

//DELETE POST
export const deletePost = (postId) => async (dispatch) => {
  try {
    await axios.delete(`api/posts/${postId}`);
    dispatch({
      type: DELETE_POST,
      payload: postId
    });

    dispatch(setAlert('Post Removed', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

//ADD POST
export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Context-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/posts', formData, config);
    dispatch({
      type: ADD_POST,
      payload: res.data
    });

    dispatch(setAlert('Post Created', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// GET POST
export const getPost = (postId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${postId}`);

    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

//ADD COMMENT
export const addComment = (postId, formData) => async (dispatch) => {
  const config = {
    headers: {
      'Context-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post(
      `/api/posts/comments/${postId}`,
      formData,
      config
    );

    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    });

    dispatch(setAlert('Comment Added', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

//DELETE COMMENT
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/comments/${postId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId
    });

    dispatch(setAlert('Comment Removed', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};
