import React, { useCallback, useEffect } from "react";

import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";

const SIGN_IN_METHODS = [
    {
        id: 'password',
        provider: null,
    },
    {
        id: 'google.com',
        provider: 'googleProvider',
    },
    {
        id: 'facebook.com',
        provider: 'facebookProvider',
    },
    {
        id: 'twitter.com',
        provider: 'twitterProvider',
    }
]

const AccountPage = () => (
    <AuthUserContext.Consumer>
        { authUser => (
            <div>
                <h1>Account: {authUser.email}</h1>
                <PasswordForgetForm />
                <PasswordChangeForm />
                <br />
                <LoginManagement authUser={authUser} />
            </div>
        ) }
    </AuthUserContext.Consumer>
    
)


const LoginManagementBase = ({ authUser, firebase }) => {
    const [state, setState] = React.useState({
        activeSignInMethods: [],
        error: null,
    });

    const { activeSignInMethods, error } = state;

    const fetchSignInMethods = useCallback(() => {
        firebase.doFetchSignInMethodsForEmail(authUser.email)
            .then(activeSignInMethods => {
                console.log("Active SignIn Methods: ", authUser.email)
                setState({ activeSignInMethods, error: null })
            }).catch(error => {
                setState({ error })
            })
    }, [authUser.email, firebase]); // Dependency array specified for useCallback

    useEffect(() => {
        fetchSignInMethods()
    }, [fetchSignInMethods])

    
    
    const handleSocialLoginLink = provider => {
        firebase.doLinkWithPopup(firebase[provider])
            .then(fetchSignInMethods)
            .catch(error => setState({ error }))
    }

    const handleUnlink = providerId => {
        firebase.doUnlink(providerId)
            .then(fetchSignInMethods)
            .catch(error => setState({ error }))
    }

    const handleDefaultLoginLink = password => {
        const credential = firebase.getAuthCredential(authUser.email, password);

        firebase.doLinkWithCredential(credential)
            .then(fetchSignInMethods)
            .catch(error => setState({ error }))
    }

    return (
        <div>
            Sign In Methods
            <ul>
                {SIGN_IN_METHODS.map(signInMethod => {
                    const onlyOneLeft = activeSignInMethods.length === 1;
                    const isEnabled = activeSignInMethods.includes(signInMethod.id);

                    return (
                        <li key={signInMethod.id}>
                            {signInMethod.id === 'password' ? (
                                <DefaultLoginToggle 
                                    onlyOneLeft={onlyOneLeft}
                                    isEnabled={isEnabled}
                                    signInMethod={signInMethod}
                                    onLink={handleDefaultLoginLink}
                                    onUnlink={handleUnlink}
                                />
                            ): (
                                <SocialLoginToggle 
                                    onlyOneLeft={onlyOneLeft}
                                    isEnabled={isEnabled}
                                    signInMethod={signInMethod}
                                    onLink={handleSocialLoginLink}
                                    onUnlink={handleUnlink}
                                />
                            )}
                        </li>
                    )
                })}
            </ul>
            {error && <p>{error.message}</p>}
        </div>
    )
}

const DefaultLoginToggle = ({ onlyOneLeft, isEnabled, signInMethod, onLink, onUnlink }) => {
    const [state, setState] = React.useState({
       passwordOne: '',
       passwordTwo: '', 
    })

    const {
        passwordOne,
        passwordTwo,
    } = state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

    const handleChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = event => {
        event.preventDefault();
        onLink(signInMethod);
        setState({
            passwordOne: '',
            passwordTwo: '',
        })
    }

    return (
        isEnabled ? (
            <button 
                type="button" 
                onClick={onUnlink(signInMethod.id)} 
                disabled={onlyOneLeft}
            >
             Unlink {signInMethod.id}
            </button>    
        ) : (
            <form onSubmit={handleSubmit}>
                <input 
                    name="passwordOne" 
                    onChange={handleChange} 
                    value={passwordOne} 
                    type="password" 
                    placeholder="New Password" 
                />
                <input
                    name="passwordTwo"
                    onChange={handleChange}
                    value={passwordTwo}
                    type="password"
                    placeholder="Confirm New Password"
                />
                <button type="submit" disabled={isInvalid}>
                    Link {signInMethod.id}
                </button>
            </form>
        )
    )
}

const SocialLoginToggle = ({ onlyOneLeft, isEnabled, signInMethod, onLink, onUnlink }) => {
    return isEnabled ? (
        <button 
            type="button" 
            onClick={() => onUnlink(signInMethod.id)} 
            disabled={onlyOneLeft}
        >
            Unlink {signInMethod.id}
        </button>
    ) : (
        <button type="button" onClick={() => onLink(signInMethod)}>
            Link {signInMethod.id}
        </button>
    )
}

const condition = authUser => !!authUser;

const LoginManagement = withFirebase(LoginManagementBase);

export default withAuthorization(condition)(AccountPage);