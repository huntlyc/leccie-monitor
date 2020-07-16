import React, { FunctionComponent, FormEvent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useFirebase } from '../hooks/useFirebase';


const ResetPassword:FunctionComponent<RouteComponentProps> = (props: RouteComponentProps) => {
    const firebase = useFirebase();
    const [formError, setFormError] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [email, setEmailTo] = useState('');


    const displayErrorIfAny = (formError: string) => {
        if(formError === '') return null;

        return <p data-testid="login-errors" className="danger">{formError}</p>;
    };


    const onSubmit = (e: React.FormEvent) =>{
        e.preventDefault();

        let formIsValid = true;
        const validateEmail = (email: string) => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };

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

    const emailChangeHandler = (e: React.FormEvent) => {
        setEmailTo((e.target as HTMLInputElement).value);
    }

    return (
        <>
            {displayErrorIfAny(formError)}
            {hasSubmitted && <p>Check your email for a reset link</p>}
            {!hasSubmitted && 
                <form action="post" onSubmit={onSubmit}>
                    <label htmlFor="email">Email</label><br/>
                    <input onChange={emailChangeHandler} type="email" id="email" name="email"/><br/>
                    <br/>
                    <button type="submit">Reset</button>
                </form>
            }
        </>
    );
};


export default ResetPassword;