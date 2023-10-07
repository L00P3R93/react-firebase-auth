import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'


import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignoutButton = ({firebase}) => {
    let navigate = useNavigate();
    const handleSignOut = () => {
        firebase.doSignOut()
            .then(() => navigate(ROUTES.SIGN_IN))
            .catch(error => console.error(error))
    }
    return (
        <Button variant="danger" size="sm" onClick={handleSignOut}>
            Sign Out
        </Button>
    )
}

export default withFirebase(SignoutButton)