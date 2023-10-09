import React from 'react';
import { useNavigate } from 'react-router-dom';
import { compose } from 'recompose';
import { withRouter } from '../util';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import ErrorMessage from '../Error';

const SignInPage = () => (
    <div>
        <h1>Sign In</h1>
        <SignInForm />
        <br />
        <div className="d-flex flex-row bd-highlight mb-3">
            <div className="p-2 bd-highlight">
                <SignInGoogle />
            </div>
            <div className="p-2 bd-highlight">
                <SignInFacebook />
            </div>
            <div className="p-2 bd-highlight">
                <SignInTwitter />
            </div>
        </div>
        
        
        
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
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type='email' placeholder='Email Address' value={email} onChange={handleChange} name='email' />
                    <Form.Text className='text-muted'>We'll never share your email with anyone else.</Form.Text>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Password' value={password} onChange={handleChange} name='password' />
                </Form.Group>
                <Button variant='primary' type='submit' disabled={isInvalid}>Sign In</Button>
                { error && <ErrorMessage error={error} /> }
            </Form>
        </>
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
            <Button variant='primary' type='submit'>
                <FontAwesomeIcon icon={faGoogle} />&nbsp;
            </Button>
            {error && <ErrorMessage error={error} />}
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
            <Button variant='primary' type='submit'>
                <FontAwesomeIcon icon={faFacebook} />&nbsp;
            </Button>
            {error && <ErrorMessage error={error} /> }
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
            <Button variant='primary' type='submit'>
                <FontAwesomeIcon icon={faTwitter} />&nbsp;
            </Button>
            {error && <ErrorMessage error={error} /> }
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