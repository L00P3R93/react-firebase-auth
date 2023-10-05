import React from 'react';
import { useNavigate } from 'react-router-dom';


import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignoutButton = ({firebase}) => {
    let navigate = useNavigate();
    return (
        <button 
            type='button' 
            onClick={
                () => firebase.doSignOut()
                        .then(() => {
                            navigate(ROUTES.SIGN_IN);
                        }).catch(error => {
                            console.error(error);
                        })
            }
        >
            Sign Out
        </button>
    )
}

export default withFirebase(SignoutButton)