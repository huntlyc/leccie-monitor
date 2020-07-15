import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import EmailPassForm, { FormType } from './EmailPassForm';


const RegisterForm: FunctionComponent<RouteComponentProps> = () => {
    return <EmailPassForm action={FormType.Register} />
};


export default RegisterForm;
