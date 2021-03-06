import React from 'react';
import ReadingForm from './ReadingForm';
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';

const numErrMsg = "Please enter a numeric value";

test('it renders without crashing', () => {
    const mockSuccessFN = jest.fn((reading: string) => {});
    render(<ReadingForm onSuccess={mockSuccessFN}  />);
});


test('it calls success prop fn after valid value', () =>{
    const mockSuccessFN = jest.fn((reading: string) => {});

    const inputReadingValue = "5.04";

    render(<ReadingForm onSuccess={mockSuccessFN}  />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: inputReadingValue } });
    fireEvent.click(screen.getByRole('button'));


    expect(mockSuccessFN).toBeCalledTimes(1);
    expect(mockSuccessFN).toBeCalledWith(inputReadingValue);
    expect(screen.queryByText(numErrMsg)).not.toBeInTheDocument();
});


test('it calls clear prop fn after "clear"', () =>{
    const mockSuccessFN = jest.fn((reading: string) => {});

    const inputReadingValue = "clear";

    render(<ReadingForm onSuccess={mockSuccessFN}  />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: inputReadingValue } });
    fireEvent.click(screen.getByRole('button'));

});


test('it handles invalid submission helpfully', () =>{
    const mockSuccessFN = jest.fn((reading: string) => {});

    render(<ReadingForm onSuccess={mockSuccessFN}  />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    //Submit invalid entry
    fireEvent.change(input, { target: { value: 'bob' } });
    fireEvent.click(button);

    expect(mockSuccessFN).toBeCalledTimes(0);

    expect(input.classList.contains('error')).toBeTruthy();
    expect(screen.getByText(numErrMsg));
});


test('it recovers from an invalid state on next good value', () =>{
    const mockSuccessFN = jest.fn((reading: string) => {});

    render(<ReadingForm onSuccess={mockSuccessFN}  />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    //Submit invalid entry
    fireEvent.change(input, { target: { value: 'bob' } });
    fireEvent.click(button);

    expect(mockSuccessFN).toBeCalledTimes(0);
    expect(input.classList.contains('error')).toBeTruthy();
    expect(screen.getByText(numErrMsg));

    //Send valid entry
    fireEvent.change(input, { target: { value: '1.04' } });
    fireEvent.click(button);

    expect(input.classList.contains('error')).toBeFalsy();
    expect(screen.queryByText(numErrMsg)).toBeNull();
});
