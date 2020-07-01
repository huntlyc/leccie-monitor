
import React, { FunctionComponent, useState } from 'react';
import LoginForm from './LoginForm';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../firebaseConfig';


const envPersistenceStrategy = process.env.NODE_ENV === 'test' 
  ? firebase.auth.Auth.Persistence.NONE 
  : firebase.auth.Auth.Persistence.LOCAL;


type UserAuthenticationProps = {
    onAuthenticated: (firebaseUserID: string) => void,
};


const UserAuthentication: FunctionComponent<UserAuthenticationProps> = ({onAuthenticated}) => {
    const [isLogin, setFormToLogin] = useState(true);
    const [authError, setAuthEror] = useState('');
    const authFirebase = async (email: string, pass: string) => {

        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }

        firebase.auth().setPersistence(envPersistenceStrategy).then(() => {

            if(isLogin){
                firebase.auth().signInWithEmailAndPassword(email, pass).then((userCred) => {
                    if(userCred && userCred.user && userCred.user.uid){
                        onAuthenticated(userCred?.user?.uid);
                    }
                }).catch((err) => {
                    console.log(err.message);
                    setAuthEror(err.message);
                });
            }else{
                firebase.auth().createUserWithEmailAndPassword(email, pass).then((userCred) => {
                    if(userCred && userCred.user && userCred.user.uid){
                        onAuthenticated(userCred?.user?.uid);
                    }
                }).catch((err) => {
                    console.log(err);
                    console.log(err.message);
                    setAuthEror(err.message);
                });
            
            }
        }).catch((err) => { // Persistence not supported on browser
            console.log(err);
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