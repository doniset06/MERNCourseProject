import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/action-profile';
import DashboardAction from './DashboardAction';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';

const Dashboard = (props) => {
  useEffect(() => {
    props.getCurrentProfile();
  }, []);
  return props.profile.loading && props.profile.profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome{' '}
        {props.auth.user && props.auth.user.name}
      </p>
      {props.profile.profile !== null ? (
        <Fragment>
          <DashboardAction />
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProp = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProp, { getCurrentProfile })(Dashboard);
