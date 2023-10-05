import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import { withRouter } from '../util';
import * as ROUTES from '../../constants/routes';

const withAuthorization = condition => Component => {
    const WithAuthorization = props => {
        const navigate = useNavigate();
        useEffect(() => {
            const listener = props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (!condition(authUser)) {
                        navigate(ROUTES.SIGN_IN);
                    }
                },
            );
            
            return () => {
                listener();
            }

        }, [props.firebase.auth, navigate]);

        return (
            <AuthUserContext.Consumer>
                { authUser => condition(authUser) ? <Component {...props} /> : null }
            </AuthUserContext.Consumer>
        )
    }

    return compose(
        withRouter,
        withFirebase,
    )(WithAuthorization);
}

export default withAuthorization;