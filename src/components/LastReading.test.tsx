import React from 'react';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import LastReading from './LastReading';
import IReading from './IReading';

test('it renders the last reading as expected', () =>{
    const lastReading: IReading = {
        reading: '12.34',
        date: '1999-12-01 10:00:00'
    }
    render(<LastReading reading={lastReading} isRunningLow={false}/>);

    expect(screen.getByTestId('last-reading-price')).toHaveTextContent(lastReading.reading);
    expect(screen.getByTestId('last-reading-date')).toHaveTextContent('01/12/1999 at 10:00');
});


test('it renders isRunningLow flag (TRUE) as expected', () =>{
    const lastReading: IReading = {
        reading: '2.34',
        date: '1999-12-01 10:00:00'
    }
    render(<LastReading reading={lastReading} isRunningLow={true}/>);

    expect(screen.getByTestId('last-reading-price')).toHaveClass('danger');
});

test('it renders isRunningLow flag (FALSE) as expected', () =>{
    const lastReading: IReading = {
        reading: '22.34',
        date: '1999-12-01 10:00:00'
    }
    render(<LastReading reading={lastReading} isRunningLow={false}/>);

    expect(screen.getByTestId('last-reading-price')).not.toHaveClass('danger');
});