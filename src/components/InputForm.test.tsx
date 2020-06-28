import React from 'react';
import ReadingForm from './InputForm';
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';


test('it renders without crashing', () => {
    const mockSuccessFN = jest.fn((reading: string) => {});
    const mockClearFN = jest.fn();
    render(<ReadingForm onSuccess={mockSuccessFN} onClear={mockClearFN} />);
});


test('it calls success prop fn after valid value', () =>{
    const mockSuccessFN = jest.fn((reading: string) => {});
    const mockClearFN = jest.fn();

    const inputReadingValue = "5.04";

    render(<ReadingForm onSuccess={mockSuccessFN} onClear={mockClearFN} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: inputReadingValue } });
    fireEvent.click(screen.getByRole('button'));

    expect(mockSuccessFN).toBeCalledTimes(1);
    expect(mockSuccessFN).toBeCalledWith(inputReadingValue);
});


test('it calls clear prop fn after "clear"', () =>{
    const mockSuccessFN = jest.fn((reading: string) => {});
    const mockClearFN = jest.fn();

    const inputReadingValue = "clear";

    render(<ReadingForm onSuccess={mockSuccessFN} onClear={mockClearFN} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: inputReadingValue } });
    fireEvent.click(screen.getByRole('button'));

    expect(mockClearFN).toBeCalledTimes(1);
});


test('it handles invalid submission helpfully', () =>{
    const mockSuccessFN = jest.fn((reading: string) => {});
    const mockClearFN = jest.fn();

    render(<ReadingForm onSuccess={mockSuccessFN} onClear={mockClearFN} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    //Submit invalid entry
    fireEvent.change(input, { target: { value: 'bob' } });
    fireEvent.click(button);

    expect(mockSuccessFN).toBeCalledTimes(0);
    expect(mockClearFN).toBeCalledTimes(0);

    expect(input.classList.contains('error')).toBeTruthy();
    expect(screen.getByText('Please enter number or "Clear"'));
});


test('it recovers from an invalid state on next good value', () =>{
    const mockSuccessFN = jest.fn((reading: string) => {});
    const mockClearFN = jest.fn();

    render(<ReadingForm onSuccess={mockSuccessFN} onClear={mockClearFN} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    //Submit invalid entry
    fireEvent.change(input, { target: { value: 'bob' } });
    fireEvent.click(button);

    expect(mockSuccessFN).toBeCalledTimes(0);
    expect(mockClearFN).toBeCalledTimes(0);

    expect(input.classList.contains('error')).toBeTruthy();
    expect(screen.getByText('Please enter number or "Clear"'));

    //Send valid entry
    fireEvent.change(input, { target: { value: '1.04' } });
    fireEvent.click(button);

    expect(input.classList.contains('error')).toBeFalsy();
    expect(screen.queryByText('Please enter number or "Clear"')).toBeNull();
});
