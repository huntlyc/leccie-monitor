import React, { FunctionComponent } from 'react';
import LoginForm from './LoginForm';
import { RouteComponentProps, Router, Link } from '@reach/router';
import RegisterForm from './RegisterForm';
import ResetPassword from './ResetPassword';


const UserAuthentication: FunctionComponent<RouteComponentProps> = () => {
    return (
        <>
            <nav>
                <Link to="login">Login</Link>
                <Link to="register">Register</Link>
            </nav>
            <Router>
                <LoginForm
                    path="login"
                />
                <RegisterForm
                    path="register"
                />
                <ResetPassword
                    path="reset-password"
                />
            </Router>
        </>
    );
}


export default UserAuthentication;