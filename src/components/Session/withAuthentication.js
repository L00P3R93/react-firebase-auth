import React, { useEffect } from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
    const WithAuthentication = props => {
        const [state, setState] = React.useState({
            authUser: null
        })

        useEffect(() => {
            const listener = props.firebase.auth.onAuthStateChanged(
                authUser => {
                    authUser
                        ? setState({ authUser })
                        : setState({ authUser: null });
                },
            );

            return () => {
                listener();
            }
        }, [props.firebase.auth])

        return (
            <AuthUserContext.Provider value={state.authUser}>
                <Component {...props} />
            </AuthUserContext.Provider>
        )
    }
    return withFirebase(WithAuthentication);
}

export default withAuthentication;