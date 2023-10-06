import React from 'react';
import { useNavigate } from 'react-router-dom';
import { compose } from 'recompose';
import { withRouter } from '../util';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const SignInPage = () => (
    <div>
        <h1>Sign In</h1>
        <SignInForm />
        <br />
        <SignInGoogle />
        <SignInFacebook />
        <SignInTwitter />
        <PasswordForgetLink />
        <SignUpLink />
    </div>
);

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
    An account with an E-Mail address to 
    this social account already exists. Try to login from
    this account instead and associate your social accounts on 
    your profile. 
`;

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};


const SignInFormBase = ({ firebase }) => {
    const navigate = useNavigate();
    const [state, setState] = React.useState(INITIAL_STATE)

    const {
        email,
        password,
        error
    } = state;

    const isInvalid = password === '' || email === '';

    const handleChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = event => {
        const { email, password } = state
        
        firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                setState({ ...INITIAL_STATE })
                navigate(ROUTES.HOME)
            }).catch(error => {
                setState({ error })
            })
        
        event.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                name='email'
                value={email}
                onChange={handleChange}
                type='text'
                placeholder='Email Address'
            />
            <input 
                name='password'
                value={password}
                onChange={handleChange}
                type='password'
                placeholder='Password'
            />
            <button disabled={isInvalid} type='submit'>
                Sign In
            </button>
            { error && <p>{error.message}</p> }
        </form>
    )
}

const SignInGoogleBase = ({ firebase }) => {
    const navigate = useNavigate();
    const [state, setState] = React.useState({ error: null })

    const { error } = state;

    const roles = {}

    const handleSubmit = event => {
        event.preventDefault();
        firebase.doSignInWithGoogle()
            .then(socialAuthUser => {
                if(socialAuthUser.user.email === 'vincentkioko51@gmail.com') {
                    roles[ROLES.ADMIN] = ROLES.ADMIN
                }
                

                return firebase.writeUserData(
                    socialAuthUser.user.uid, 
                    socialAuthUser.user.displayName, 
                    socialAuthUser.user.email, 
                    roles,
                )
            })
            .then(() => {
                setState({ error: null })
                navigate(ROUTES.HOME)
            }).catch(error => {
                if(error.code === ERROR_CODE_ACCOUNT_EXISTS){
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }
                setState({ error })
            })
    }

    return (
        <form onSubmit={handleSubmit}>
            <button type='submit'>Sign In With Google</button>
            {error && <p>{error.message}</p> }
        </form>
    )
}

const SignInFacebookBase = ({ firebase }) => {
    const navigate = useNavigate();
    const [state, setState] = React.useState({ error: null });

    const { error } = state;

    const roles = {};

    const handleSubmit = event => {
        event.preventDefault();
        firebase.doSignInWithFacebook()
            .then(socialAuthUser => {
                if(socialAuthUser.user.email === 'vincentkioko51@gmail.com') {
                    roles[ROLES.ADMIN] = ROLES.ADMIN
                }
                return firebase.writeUserData(
                    socialAuthUser.user.uid, 
                    socialAuthUser.user.displayName, 
                    socialAuthUser.user.email, 
                    roles,
                )
            }).then(() => {
                setState({ error: null });
                navigate(ROUTES.HOME)
            }).catch(error => {
                if(error.code === ERROR_CODE_ACCOUNT_EXISTS){
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }
                setState({ error });
            })
    }

    return (
        <form onSubmit={handleSubmit}>
            <button type='submit'>Sign In With Facebook</button>
            {error && <p>{error.message}</p> }
        </form>
    )
}

const SignInTwitterBase = ({ firebase }) => {
    const navigate = useNavigate();
    const [state, setState] = React.useState({ error: null });

    const { error } = state;

    const roles = {};

    const handleSubmit = event => {
        event.preventDefault();
        firebase.doSignInWithTwitter()
            .then(socialAuthUser => {
                if(socialAuthUser.user.email === 'vincentkioko51@gmail.com') {
                    roles[ROLES.ADMIN] = ROLES.ADMIN
                }
                return firebase.writeUserData(
                    socialAuthUser.user.uid, 
                    socialAuthUser.user.displayName, 
                    socialAuthUser.user.email, 
                    roles,
                )
            }).then(() => {
                setState({ error: null });
                navigate(ROUTES.HOME)
            }).catch(error => {
                if(error.code === ERROR_CODE_ACCOUNT_EXISTS){
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }
                setState({ error });
            })
    }

    return (
        <form onSubmit={handleSubmit}>
            <button type='submit'>Sign In With Twitter</button>
            {error && <p>{error.message}</p> }
        </form>
    )
}

const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase)

const SignInGoogle = compose(
    withRouter,
    withFirebase,
)(SignInGoogleBase)

const SignInFacebook = compose(
    withRouter,
    withFirebase,
)(SignInFacebookBase)

const SignInTwitter = compose(
    withRouter,
    withFirebase,
)(SignInTwitterBase)


export default SignInPage;

export { SignInForm, SignInGoogle };