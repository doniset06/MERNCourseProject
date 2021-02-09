import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGithubRepo } from '../../actions/action-profile';

const ProfileGithub = (props) => {
  useEffect(() => {
    props.getGithubRepo(props.username);
  }, [props.getGithubRepo]);
  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">Github Repos</h2>
      {props.repos.map((repo) => (
        <div key={repo.id} className="repo bg-white p-1 my-1">
          <div>
            <h4>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div>
            <ul>
              <li className="badge badge-primary">
                Stars : {repo.stargazers_count}
              </li>
              <li className="badge badge-dark">
                Watchers : {repo.watchers_count}
              </li>
              <li className="badge badge-light">Forks : {repo.forks_count}</li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGithubRepo: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  repos: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos
});

export default connect(mapStateToProps, { getGithubRepo })(ProfileGithub);
