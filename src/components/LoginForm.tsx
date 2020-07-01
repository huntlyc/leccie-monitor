import React, { FunctionComponent, useState, useEffect } from 'react';

type LoginFormProps = {
    isRegistration: boolean,
    onValidSubmit: (username: string, password: string) => void,
    authError: string
};


const LoginForm: FunctionComponent<LoginFormProps> = ({isRegistration, onValidSubmit, authError}) => {
    const [formErrors, setFormErrors] = useState<string[]>([]);

    const addToErrors = (error: string) => {
        let currentErrors = formErrors.slice(0);
        currentErrors.push(error);
        setFormErrors(currentErrors);
    };

    useEffect(() => {
        let isRunning = true;

        if(isRunning && authError){
            addToErrors(authError);
        }

        return () => { isRunning = false };

    }, [authError]);

    
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
            addToErrors('Please enter your login details');
            formIsValid = false;
        }else if(!validateEmail(email)){
            addToErrors('Please enter a valid email');
            formIsValid = false;
        }

        if(formIsValid){
            onValidSubmit(email, password);
        }
    };


    return (
        <>
            {formErrors && (formErrors.length > 0) &&
                <ul data-testid="login-errors">
                    {formErrors.map((v,i) => <li key={i}>{v}</li>)}
                </ul>
            }
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
