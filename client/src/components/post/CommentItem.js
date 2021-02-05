import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import { deleteComment } from '../../actions/action-post';

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, user, date },
  auth
}) => {
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img className="round-img" src={avatar} alt="Profile Image" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">Posted on {formatDate(date)}</p>
      </div>
      {!auth.loading && user === auth.user._id && (
        <button
          onClick={(e) => deleteComment(postId, _id)}
          type="button"
          class="btn btn-danger"
        >
          <i class="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
