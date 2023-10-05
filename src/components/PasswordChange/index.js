import React from 'react';

import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

const PasswordChangeForm = ({ firebase }) => {
    const [state, setState] = React.useState(INITIAL_STATE);

    const {
        passwordOne,
        passwordTwo,
        error
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
        const { passwordOne } = state;
        firebase.doPasswordUpdate(passwordOne).then(() => {
            setState({ ...INITIAL_STATE })
        }).catch(error => {
            setState({ error })
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                name="passwordOne"
                value={passwordOne}
                onChange={handleChange}
                type="password"
                placeholder="New Password"
            />
            <input
                name="passwordTwo"
                value={passwordTwo}
                onChange={handleChange}
                type="password"
                placeholder="Confirm New Password"
            />
            <button disabled={isInvalid} type="submit">
                Reset My Password
            </button>

            {error && <p>{error.message}</p>}
        </form>
    )
}
export default withFirebase(PasswordChangeForm);
