import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import EmailPassForm, { FormType } from './EmailPassForm';

interface RegisterFormProps extends RouteComponentProps{
};


const RegisterForm: FunctionComponent<RegisterFormProps> = (props: RegisterFormProps) => {
    return <EmailPassForm action={FormType.Register} />
};


export default RegisterForm;
