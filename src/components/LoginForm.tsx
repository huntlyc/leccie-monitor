import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import EmailPassForm, { FormType } from './EmailPassForm';


const LoginForm: FunctionComponent<RouteComponentProps> = () => {
    return <EmailPassForm action={FormType.Login} />;
};


export default LoginForm;
