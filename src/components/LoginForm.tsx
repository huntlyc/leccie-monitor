import React, { FunctionComponent, useState } from 'react';

type LoginFormProps = {
    isRegistration: boolean,
    onValidSubmit: (username: string, password: string) => void,
    authError: string
};


const LoginForm: FunctionComponent<LoginFormProps> = ({isRegistration, onValidSubmit, authError}) => {
    const [formError,setFormError] = useState('');

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
            onValidSubmit(email, password);
        }
    };



    const displayErrorIfAny = (formError: string, authError: string) => {
        let err = '';

        if(authError){
           err = authError;
        }else if(formError){
            err = formError;
        }

        if(err === '') return null;

        return (
            <ul data-testid="login-errors">
                <li>{err}</li>
            </ul>
        );
    }

    return (
        <>
            {displayErrorIfAny(formError, authError)}
            <form data-testid="login" action="post" onSubmit={onSubmit}>
                <label htmlFor="email">Email</label><br/>
                <input type="email" id="email" name="email"/><br/>
                <br/>
                <label htmlFor="password">Password</label><br/>
                <input type="password" id="password" name="password"/><br/>
                <br/>
                {isRegistration
                  ? <button type="submit">Sign up</button>
                  : <button type="submit">Sign in</button>
                }
            </form>
        </>
    );
};


export default LoginForm;
