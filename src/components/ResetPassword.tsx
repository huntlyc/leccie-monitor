import React, { FunctionComponent, FormEvent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useFirebase } from '../hooks/useFirebase';

interface ResetPasswordProps extends RouteComponentProps{
    // no extra props
}
const ResetPassword:FunctionComponent<ResetPasswordProps> = (props: ResetPasswordProps) => {
    const firebase = useFirebase();
    const [formError, setFormError] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);


    const displayErrorIfAny = (formError: string) => {
        let err = '';

        if(formError){
            err = formError;
        }

        if(err === '') return null;

        return (
            <ul data-testid="login-errors">
                <li>{err}</li>
            </ul>
        );
    }

    const onSubmit = (e: React.FormEvent) =>{
        let formIsValid = true;
        const email = (document.querySelector('input[name=email]') as HTMLInputElement).value;
        const validateEmail = (email: string) => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };


        e.preventDefault();


        if(email === ""){
            setFormError('Please enter your email');
            formIsValid = false;
        }else if(!validateEmail(email)){
            setFormError('Please enter a valid email');
            formIsValid = false;
        }



        if(formIsValid){
            setHasSubmitted(true);
            return firebase?.sendPasswordResetEmail(email);
        }
    };


    return (
        <>
            {displayErrorIfAny(formError)}
            {hasSubmitted && <p>Check your email for a reset link</p>}
            {!hasSubmitted && 
                <form action="post" onSubmit={onSubmit}>
                    <label htmlFor="email">Email</label><br/>
                    <input type="email" id="email" name="email"/><br/>
                    <br/>
                    <button type="submit">Reset</button>
                </form>
            }
        </>
    );
}

export default ResetPassword;