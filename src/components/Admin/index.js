import React, { useEffect } from "react";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";

const AdminPage = ({ firebase }) => {
    const [state, setState] = React.useState({
        loading: false,
        users: []
    })

    const { loading, users } = state;

    useEffect(() => {
        setState({ loading: true })

        firebase.readUsers()
            .then(usersList => {
                console.log('Users data: ', usersList)

                setState({
                    loading: false,
                    users: usersList
                })

            }).catch(error => {
                console.error('Error fetching users: ', error)
                setState({ loading: false, users: [] })
            })

        return () => {
            //unsubscribe()
        }
    }, [firebase])

    return (
        <div>
            <h1>Admin</h1>

            <p>
                Admin Page accessible by every signed in user.
            </p>

            { loading && <div>Loading...</div> }

            { users && <UserList users={users}/>}
        </div>
    );
}

const UserList = ({ users }) => (
    <ul>
        { users.map(user => (
            <li key={user.uid}>
                <span>
                    <strong>ID:</strong> {user.uid} &nbsp;&nbsp;
                </span>
                <span>
                    <strong>E-Mail:</strong> {user.email} &nbsp;&nbsp;
                </span>
                <span>
                    <strong>Username:</strong> {user.username} &nbsp;&nbsp;
                </span>
                <span>
                    <strong>Role:</strong> {Object.values(user.roles).join(', ')} &nbsp;&nbsp;
                </span>
            </li>
        )) }
    </ul>
)

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
    withAuthorization(condition),
    withFirebase
)(AdminPage);
