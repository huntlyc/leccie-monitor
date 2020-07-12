import React, { FunctionComponent, useState, useEffect } from 'react';
import { RouteComponentProps, Link, navigate } from '@reach/router';
import { useFirebase } from '../hooks/useFirebase';
import { humanReadableFirebaseError } from '../Utils';

interface LoginFormProps extends RouteComponentProps{
};


const LoginForm: FunctionComponent<LoginFormProps> = (props: LoginFormProps) => {
    const [formError,setFormError] = useState('');
    const firebase = useFirebase();

    const login = (email:string, pass:string) => {
        return firebase?.signin(email, pass).catch((err) => {
            let errorMsg = '';

            if(typeof err == 'string'){
                errorMsg = err;
            }else if(err.code){
                errorMsg = err.code;
            }

            errorMsg = humanReadableFirebaseError(errorMsg)

            setFormError(errorMsg);
        });
    };

    const onSubmit = (e: React.FormEvent) =>{
        let formIsValid = true;
        const email = (document.querySelector('input[name=email]') as HTMLInputElement).value;
        const password = (document.querySelector('input[name=password]') as HTMLInputElement).value;
        const validateEmail = (email: string) => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };


        e.preventDefault();


        if(email === "" || password === ""){
            setFormError('Please enter your login details');
            formIsValid = false;
        }else if(!validateEmail(email)){
            setFormError('Please enter a valid email');
            formIsValid = false;
        }

        if(formIsValid){
            login(email, password);
        }
    };



    const displayErrorIfAny = (formError: string) => {
        let err = '';

        if(formError){
            err = formError;
        }

        if(err === '') return null;

        return (
            <p className="danger">{err}</p>
        );
    };
    
    useEffect(() => {
        let isActive = true;

        if (firebase && firebase.user !== false) {
            if (firebase.dataStore && isActive) {
               navigate('/'); 
            }
        }


        return () => { isActive = false };
    }, [firebase]);

    return (
        <>
            {displayErrorIfAny(formError)}
            <form data-testid="login" action="post" onSubmit={onSubmit}>
                <label htmlFor="email">Email</label><br/>
                <input type="email" id="email" name="email"/><br/>
                <br/>
                <label htmlFor="password">Password</label><br/>
                <input type="password" id="password" name="password"/><br/>
                <br/>
                <button type="submit">Sign in</button>
            </form>
            <p>Forgot your password? <Link to="/user/resetpassword">Reset your password</Link></p>
        </>
    );
};


export default LoginForm;
