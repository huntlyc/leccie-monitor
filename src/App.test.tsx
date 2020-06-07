import React from 'react';
import App from './App';
import { ReadingStorage } from './components/TestReadingStore';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

const db: ReadingStorage = new ReadingStorage();

test('renders without crashing', async () => {
    render(<App dataStore={db} />);
    //Check for main h1 to ensure page has rendered
    expect(screen.queryAllByRole('heading')[0]).toHaveTextContent('Leccie Monitor');
});

describe('on first run', () => {
    test('it should not have a previous readings table', () => {
        render(<App dataStore={db} />);
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    test('instead, it should show enter first reading message', () => {
        render(<App dataStore={db} />);
        expect(screen.getByText('Enter your first reading to get started!')).toBeInTheDocument();
    });

    test('it should now show the alert bar', () => {
        render(<App dataStore={db} />);
        expect(screen.queryByText('Running low, go top up!!!')).not.toBeInTheDocument();
    });
})