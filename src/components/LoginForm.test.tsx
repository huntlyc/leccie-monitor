import React from 'react';
import LoginForm from './LoginForm';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


test('it renders without crashing', () => {
    render(<LoginForm />);
});

describe('Login form error handling', () => {
    test('it should warn for empty email and password', () => {
        render(<LoginForm />);

        userEvent.click(screen.getByRole('button'));

        expect(screen.getByTestId('login-errors')).toBeInTheDocument();
        expect(screen.getByTestId('login-errors')).toHaveTextContent('Please enter your login details');
    });


    test('it should warn for empty email', () => {
        render(<LoginForm />);

        userEvent.type(screen.getByLabelText('Password'), 'password!');
        userEvent.click(screen.getByRole('button'));

        expect(screen.getByTestId('login-errors')).toBeInTheDocument();
        expect(screen.getByTestId('login-errors')).toHaveTextContent('Please enter your login details');
    });


    test('it should warn for empty password', () => {
        render(<LoginForm />);

        userEvent.type(screen.getByLabelText('Email'), 'bob@bobsworld.com');
        userEvent.click(screen.getByRole('button'));

        expect(screen.getByTestId('login-errors')).toBeInTheDocument();
        expect(screen.getByTestId('login-errors')).toHaveTextContent('Please enter your login details');
    });


    test('it should warn for an invalid email', () => {
        render(<LoginForm />);

        userEvent.type(screen.getByLabelText('Email'), 'bob');
        userEvent.type(screen.getByLabelText('Password'), 'bob');
        userEvent.click(screen.getByRole('button'));

        expect(screen.getByTestId('login-errors')).toBeInTheDocument();
        expect(screen.getByTestId('login-errors')).toHaveTextContent('Please enter a valid email');
    });
})