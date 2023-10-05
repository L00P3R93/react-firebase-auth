import React from "react";
import { Link } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const INITIAL_STATE = {
    email: '',
    error: null,
}

const PasswordForgetPage = () => (
    <div>
        <h1>PasswordForget</h1>
        <PasswordForgetForm />
        <p>
            <Link to={ROUTES.HOME}>Cancel</Link>
        </p>
    </div>
);

const PasswordForgetFormBase = ({ firebase }) => {
    const [state, setState] = React.useState(INITIAL_STATE);

    const {
        email,
        error
    } = state;

    const isInvalid = email === '';

    const handleChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = event => {
        event.preventDefault();
        const { email } = state

        firebase.doPasswordReset(email).then(() => {
            setState({ ...INITIAL_STATE })
        }).catch(error => {
            setState({ error })
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                name="email"
                value={email}
                onChange={handleChange}
                type="text"
                placeholder="Email Address"
            />

            <button 
                disabled={isInvalid}
                type="submit"
            >
                Reset My Password
            </button>

            {error && <p>{error.message}</p>}
        </form>
    )
}
const PasswordForgetLink = () => {
    return (
        <p>
            <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
        </p>
    )
}

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };