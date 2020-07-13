import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import EmailPassForm, { FormType } from './EmailPassForm';

interface LoginFormProps extends RouteComponentProps{
};


const LoginForm: FunctionComponent<LoginFormProps> = () => {
    return <EmailPassForm action={FormType.Login} />;
};


export default LoginForm;
