
import React, { FunctionComponent, useState } from 'react';
import LoginForm from './LoginForm';
import {FirebaseAuthentication} from '../services/firebaseAuthentication';

type UserAuthenticationProps = {
    onAuthenticated: (firebaseUserID: string) => void,
};


const UserAuthentication: FunctionComponent<UserAuthenticationProps> = ({onAuthenticated}) => {
    const [isLogin, setFormToLogin] = useState(true);
    const [authError, setAuthError] = useState('');
    const authFirebase = async (email: string, pass: string) => {
        FirebaseAuthentication.login(email, pass).then((uid) => {
            if(uid){
                onAuthenticated(uid);
            }
        }).catch((err) => {
            console.log(err);
            setAuthError(err);
        });
        
    }

    return (
        <>
            <ul className="login-options">
                <li><button onClick={() => setFormToLogin(true)}  className={isLogin  ? 'active' :  '' }>Login</button></li>
                <li><button onClick={() => setFormToLogin(false)} className={!isLogin ? 'active' :  '' }>Register</button></li>
            </ul>
            <LoginForm isRegistration={!isLogin} onValidSubmit={authFirebase} authError={authError}/>
        </>
    );
}


export default UserAuthentication;