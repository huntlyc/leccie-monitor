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
