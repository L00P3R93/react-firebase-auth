import React from 'react';
import { useNavigate } from 'react-router-dom';
import { compose } from 'recompose';
import { withRouter } from '../util';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
    <div>
        <h1>Sign In</h1>
        <SignInForm />
        <PasswordForgetLink />
        <SignUpLink />
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};


const SignInFormBase = ({firebase}) => {
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

const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase)

export default SignInPage;