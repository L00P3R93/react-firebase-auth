import React from "react";
import { Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";
import { AuthUserContext } from "../Session";

const Navigation = ({ authUser }) => (
    <div>
        <AuthUserContext.Consumer>
            {authUser => (
                <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
                    <Container>
                        <Navbar.Brand as={Link} to={ROUTES.LANDING}>SNTAKS</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ml-auto">
                                {authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            )}
        </AuthUserContext.Consumer>
    </div>
)

const NavigationAuth = ({ authUser }) => (
    <>
        <Nav.Link as={Link} to={ROUTES.LANDING}>Landing</Nav.Link>
        <Nav.Link as={Link} to={ROUTES.HOME}>Home</Nav.Link>
        <Nav.Link as={Link} to={ROUTES.ACCOUNT}>Account</Nav.Link>
        {!!authUser.roles[ROLES.ADMIN] && (
            <Nav.Link as={Link} to={ROUTES.ADMIN}>Admin</Nav.Link>
        )}
        <SignOutButton />
    </>
    
)

const NavigationNonAuth = () => (
    <>
        <Nav.Link as={Link} to={ROUTES.LANDING}>Landing</Nav.Link>
        <Nav.Link as={Link} to={ROUTES.SIGN_IN}>Sign In</Nav.Link>
    </>
)

export default Navigation;