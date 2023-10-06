import React, { useEffect } from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
    const WithAuthentication = props => {
        const [state, setState] = React.useState({
            authUser: JSON.parse(localStorage.getItem('authUser'))
        })

        useEffect(() => {
            const listener = props.firebase.onAuthUserListener(
                authUser => {
                    localStorage.setItem('authUser', JSON.stringify(authUser))
                    setState({ authUser })
                },
                () => {
                    localStorage.removeItem('authUser')
                    setState({ authUser: null })
                },
            )
            
            return () => {
                listener();
            }
        }, [props.firebase])

        return (
            <AuthUserContext.Provider value={state.authUser}>
                <Component {...props} />
            </AuthUserContext.Provider>
        )
    }
    return withFirebase(WithAuthentication);
}

export default withAuthentication;