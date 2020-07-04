
import React, { FunctionComponent, useState } from 'react';
import LoginForm from './LoginForm';
import {FirebaseAuthentication} from '../services/firebaseAuthentication';


type UserAuthenticationProps = {
    onAuthenticated: (firebaseUserID: string) => void,
};


enum Form {
    login,
    register
}


const UserAuthentication: FunctionComponent<UserAuthenticationProps> = ({onAuthenticated}) => {
    const [isLogin, setFormToLogin] = useState(true);
    const [authError, setAuthError] = useState('');
    const authFirebase = (email: string, pass: string) => {
        return FirebaseAuthentication.login(email, pass).then((uid) => {
            if(uid){
                onAuthenticated(uid);
            }
        }).catch((err) => {
            let errorMsg = '';

            if(typeof err == 'string'){
                errorMsg = err;
            }else if(err.code){
                errorMsg = err.code;
            }

            setAuthError(errorMsg);
        });

    };


    const changeForm = (type: Form) => {
        if(isLogin && type === Form.register){
            setFormToLogin(false);
            setAuthError('');
        }else if(!isLogin && type === Form.login){
            setFormToLogin(true);
            setAuthError('');
        }

    };


    return (
        <>
            <ul className="login-options">
                <li><button onClick={() => changeForm(Form.login)}  className={isLogin  ? 'active' :  '' }>Login</button></li>
                <li><button onClick={() => changeForm(Form.register)} className={!isLogin ? 'active' :  '' }>Register</button></li>
            </ul>
            <LoginForm
                isRegistration={!isLogin}
                onValidSubmit={authFirebase}
                authError={authError}
            />
        </>
    );
}


export default UserAuthentication;