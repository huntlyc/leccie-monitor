import React from 'react';
import RegisterForm from './RegisterForm';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


let authError = '';
test('it renders without crashing', () => {
    const mockLoginFN = jest.fn(() => {});
    const isRegistration = false;
    render(<RegisterForm onValidSubmit={mockLoginFN}  authError="" />);
});


test('it renders "sign up" when registration is set', () => {
    const mockLoginFN = jest.fn(() => {});
    const isRegistration = true;
    render(<RegisterForm onValidSubmit={mockLoginFN}  authError={authError} />);
    expect(screen.getByRole('button')).toHaveTextContent('Sign up');
});


describe('Login form error handling', () => {
    test('it should warn for empty email and password', () => {
        const mockLoginFN = jest.fn(() => {});
        const isRegistration = false;
        render(<RegisterForm onValidSubmit={mockLoginFN}  authError={authError}/>);

        userEvent.click(screen.getByRole('button'));

        expect(mockLoginFN).toBeCalledTimes(0);
        expect(screen.getByTestId('login-errors')).toBeInTheDocument();
        expect(screen.getByTestId('login-errors')).toHaveTextContent('Please enter your login details');
    });


    test('it should warn for empty email', () => {
        const mockLoginFN = jest.fn(() => {});
        const isRegistration = false;
        render(<RegisterForm onValidSubmit={mockLoginFN}  authError={authError}/>);

        userEvent.type(screen.getByLabelText('Password'), 'password!');
        userEvent.click(screen.getByRole('button'));

        expect(mockLoginFN).toBeCalledTimes(0);
        expect(screen.getByTestId('login-errors')).toBeInTheDocument();
        expect(screen.getByTestId('login-errors')).toHaveTextContent('Please enter your login details');
    });
    

    test('it should warn for empty password', () => {
        const mockLoginFN = jest.fn(() => {});
        const isRegistration = false;
        render(<RegisterForm onValidSubmit={mockLoginFN}  authError={authError}/>);

        userEvent.type(screen.getByLabelText('Email'), 'bob@bobsworld.com');
        userEvent.click(screen.getByRole('button'));

        expect(mockLoginFN).toBeCalledTimes(0);
        expect(screen.getByTestId('login-errors')).toBeInTheDocument();
        expect(screen.getByTestId('login-errors')).toHaveTextContent('Please enter your login details');
    });


    test('it should warn for an invalid email', () => {
        const mockLoginFN = jest.fn(() => {});
        const isRegistration = false;
        render(<RegisterForm onValidSubmit={mockLoginFN}  authError={authError}/>);

        userEvent.type(screen.getByLabelText('Email'), 'bob');
        userEvent.type(screen.getByLabelText('Password'), 'bob');
        userEvent.click(screen.getByRole('button'));

        expect(mockLoginFN).toBeCalledTimes(0);
        expect(screen.getByTestId('login-errors')).toBeInTheDocument();
        expect(screen.getByTestId('login-errors')).toHaveTextContent('Please enter a valid email');
    });


    test('it should call login fn when filled with valid email and password', () => {
        const mockLoginFN = jest.fn(() => {});
        const isRegistration = false;
        render(<RegisterForm onValidSubmit={mockLoginFN}  authError={authError}/>);

        userEvent.type(screen.getByLabelText('Email'), 'bob@bobsworld.com');
        userEvent.type(screen.getByLabelText('Password'), 'bob');
        userEvent.click(screen.getByRole('button'));

        expect(mockLoginFN).toBeCalledTimes(1);
        expect(screen.queryByTestId('login-errors')).not.toBeInTheDocument();
    });

    test('it should show auth error if one has been passed down', () => {
        const mockLoginFN = jest.fn(() => {});
        const isRegistration = false;
        authError = 'auth error'
        render(<RegisterForm onValidSubmit={mockLoginFN}  authError={authError}/>);


        expect(screen.getByTestId('login-errors')).toBeInTheDocument();
        expect(screen.getByTestId('login-errors')).toHaveTextContent('auth error');
    });
})