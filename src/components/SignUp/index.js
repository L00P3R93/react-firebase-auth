import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { compose } from 'recompose';
import { withRouter } from '../util'

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'
import * as ROLES from '../../constants/roles'

const SignUpPage = () => (
    <div>
        <h1>Sign Up</h1>
        <SignUpForm />
    </div>
)

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    isAdmin: false,
    error: null,
}

const SignUpFormBase = ({firebase}) => {
    const navigate = useNavigate();
    const [state, setState] = React.useState(INITIAL_STATE)

    const {
        username,
        email,
        passwordOne,
        passwordTwo,
        isAdmin,
        error,
    } = state;

    const isInvalid =
        passwordOne !== passwordTwo ||
        passwordOne === '' ||
        email === '' ||
        username === '';

    const handleChangeCheckbox = event => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        })
    }

    const handleChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = event => {
        event.preventDefault()

        const {
            username,
            email,
            passwordOne,
            isAdmin
        } = state

        const roles = {}

        if(isAdmin) {
            roles[ROLES.ADMIN] = ROLES.ADMIN
        }
        firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                return firebase.writeUserData(authUser.user.uid, username, email, roles)
            }).then(() => {
                setState({ ...INITIAL_STATE })
                navigate(ROUTES.HOME);
            })
            .catch(error => {
                setState({ error })
            })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                name='username'
                value={username}
                onChange={handleChange}
                type='text'
                placeholder='Full Name'
            />
            <input
                name='email'
                value={email}
                onChange={handleChange}
                type='text'
                placeholder='Email'
            />
            <input
                name='passwordOne'
                value={passwordOne}
                onChange={handleChange}
                type='password'
                placeholder='Password'
            />
            <input
                name='passwordTwo'
                value={passwordTwo}
                onChange={handleChange}
                type='password'
                placeholder='Confirm Password'
            />
            <label>
                Admin: 
                <input 
                    name='isAdmin'
                    type='checkbox'
                    checked={isAdmin}
                    onChange={handleChangeCheckbox}
                />
            </label>
            <button disabled={isInvalid} type='submit'>Sign Up</button>
            {error && <p>{error.message}</p>}
        </form>
    )
}

const SignUpLink = () => {
    return (
        <p>
            Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
        </p>
    )
}

const SignUpForm =  compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);


export default SignUpPage;

export {
    SignUpForm,
    SignUpLink
}