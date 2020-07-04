
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
    const [form, setFormTo] = useState<Form>(Form.login);
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


    const changeForm = (newForm: Form) => {
        if(form !== newForm){
            setFormTo(newForm);
            setAuthError('');
        }
    };


    return (
        <>
            <ul className="login-options">
                <li><button onClick={() => changeForm(Form.login)}  className={form === Form.login  ? 'active' :  '' }>Login</button></li>
                <li><button onClick={() => changeForm(Form.register)} className={form === Form.register ? 'active' :  '' }>Register</button></li>
            </ul>
            <LoginForm
                isRegistration={form === Form.register}
                onValidSubmit={authFirebase}
                authError={authError}
            />
        </>
    );
}


export default UserAuthentication;