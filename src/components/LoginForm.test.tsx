import React from 'react';
import LoginForm from './LoginForm';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('it renders without crashing', () => {
    const mockLoginFN = jest.fn(() => {});
    render(<LoginForm onValidSubmit={mockLoginFN}/>);
});

describe('Login form error handling', () => {
    test('it should warn for empty email and password', () => {
        const mockLoginFN = jest.fn(() => {});
        render(<LoginForm onValidSubmit={mockLoginFN}/>);

        userEvent.click(screen.getByRole('button'));

        expect(mockLoginFN).toBeCalledTimes(0);
        expect(screen.getByTestId('login-errors')).toBeInTheDocument();
        expect(screen.getByTestId('login-errors')).toHaveTextContent('Please enter your login details');
    });


    test('it should warn for empty email', () => {
        const mockLoginFN = jest.fn(() => {});
        render(<LoginForm onValidSubmit={mockLoginFN}/>);

        userEvent.type(screen.getByLabelText('Password'), 'password!');
        userEvent.click(screen.getByRole('button'));

        expect(mockLoginFN).toBeCalledTimes(0);
        expect(screen.getByTestId('login-errors')).toBeInTheDocument();
        expect(screen.getByTestId('login-errors')).toHaveTextContent('Please enter your login details');
    });
    

    test('it should warn for empty password', () => {
        const mockLoginFN = jest.fn(() => {});
        render(<LoginForm onValidSubmit={mockLoginFN}/>);

        userEvent.type(screen.getByLabelText('Email'), 'bob@bobsworld.com');
        userEvent.click(screen.getByRole('button'));

        expect(mockLoginFN).toBeCalledTimes(0);
        expect(screen.getByTestId('login-errors')).toBeInTheDocument();
        expect(screen.getByTestId('login-errors')).toHaveTextContent('Please enter your login details');
    });


    test('it should check for a valid email', () => {
        const mockLoginFN = jest.fn(() => {});
        render(<LoginForm onValidSubmit={mockLoginFN}/>);

        userEvent.type(screen.getByLabelText('Email'), 'bob');
        userEvent.type(screen.getByLabelText('Password'), 'bob');
        userEvent.click(screen.getByRole('button'));

        expect(mockLoginFN).toBeCalledTimes(0);
        expect(screen.getByTestId('login-errors')).toBeInTheDocument();
        expect(screen.getByTestId('login-errors')).toHaveTextContent('Please enter a valid email');
    });


    test('it should call login fn when filled with valid email and password', () => {
        const mockLoginFN = jest.fn(() => {});
        render(<LoginForm onValidSubmit={mockLoginFN}/>);

        userEvent.type(screen.getByLabelText('Email'), 'bob@bobsworld.com');
        userEvent.type(screen.getByLabelText('Password'), 'bob');
        userEvent.click(screen.getByRole('button'));

        expect(mockLoginFN).toBeCalledTimes(1);
        expect(screen.queryByTestId('login-errors')).not.toBeInTheDocument();
    });
})