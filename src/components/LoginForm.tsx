import React, { FunctionComponent, useState } from 'react';

type LoginFormProps = {
    onValidSubmit: (username: string, password: string) => void,
};


const LoginForm: FunctionComponent<LoginFormProps> = ({onValidSubmit}) => {
    const [formErrors, setFormErrors] = useState<string[]>([]);


    const addToErrors = (error: string) => {
        let currentErrors = formErrors.slice(0);
        currentErrors.push(error);
        setFormErrors(currentErrors);
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
                <button type="submit">Login</button>
            </form>
        </>
    );
};


export default LoginForm;
