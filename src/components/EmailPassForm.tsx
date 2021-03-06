import React, { FunctionComponent, useState, useEffect } from 'react';
import { RouteComponentProps, Link, navigate } from '@reach/router';
import { useFirebase } from '../hooks/useFirebase';
import { humanReadableFirebaseError, isValidEmail } from '../Utils';


export enum FormType{
    Login,
    Register
};


interface EmailPassFormProps extends RouteComponentProps{
    action: FormType
};


const EmailPassForm: FunctionComponent<EmailPassFormProps> = (props: EmailPassFormProps) => {
    const [formError,setFormError] = useState('');
    const firebase = useFirebase();
    const [email, setEmailTo] = useState('');
    const [password, setPasswordTo] = useState('');

    
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

    
    const register = (email:string, pass:string) => {
        return firebase?.signup(email, pass).catch((err) => {
            let errorMsg = '';

            if(typeof err == 'string'){
                errorMsg = err;
            }else if(err.code){
                errorMsg = err.code;
            }

            errorMsg = humanReadableFirebaseError(errorMsg);

            setFormError(errorMsg);
        });
    };

    
    const onSubmit = (e: React.FormEvent) =>{
        let formIsValid = true;

        e.preventDefault();

        if(email === "" || password === ""){
            setFormError('Please enter your login details');
            formIsValid = false;
        }else if(!isValidEmail(email)){
            setFormError('Please enter a valid email');
            formIsValid = false;
        }

        if(formIsValid){
            switch(props.action){
                case FormType.Login: login(email, password); break;
                case FormType.Register: register(email, password); break;
            }
        }
    };


    const displayErrorIfAny = (formError: string) => {
        if(formError === '') return null;

        return <p data-testid="login-errors" className="danger">{formError}</p>;
    };

    
    // User already authenticated, redirect to home
    useEffect(() => {
        let isActive = true;

        if (firebase && firebase.user !== false) {
            if (firebase.dataStore && isActive) {
               navigate('/');
            }
        }

        return () => { isActive = false };
    }, [firebase]);


    const buttonText = () => {
        switch(props.action){
            case FormType.Login: return 'Sign in'
            case FormType.Register: return 'Sign up'
        }
    };


    const emailChangeHandler = (e: React.FormEvent) => {
        setEmailTo((e.target as HTMLInputElement).value);
    };


    const passwordChangeHandler = (e: React.FormEvent) => {
        setPasswordTo((e.target as HTMLInputElement).value);
    };


    return (
        <>
            {displayErrorIfAny(formError)}
            <form data-testid="login" action="post" onSubmit={onSubmit}>
                <label htmlFor="email">Email</label><br/>
                <input onChange={emailChangeHandler} type="email" id="email" name="email"/><br/>
                <br/>
                <label htmlFor="password">Password</label><br/>
                <input onChange={passwordChangeHandler} type="password" id="password" name="password"/><br/>
                <br/>
                <button type="submit">{buttonText()}</button>
            </form>
            {props.action === FormType.Login && <p>Forgot your password? <Link to="/auth/reset-password">Reset your password</Link></p>}
        </>
    );
};


export default EmailPassForm;
