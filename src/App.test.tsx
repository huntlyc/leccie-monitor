// End to end tests to test the app as a whole

import React from 'react';
import App from './App';
import { render, screen, fireEvent, RenderResult, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import TestReadingStore from './components/TestDataStore';
import { UserDatastore } from './components/Datastore';


const db:UserDatastore = new TestReadingStore();


/**
 * Main Tests
 */
test('it renders without crashing', () => {
    render(<App dataStore={db} />);
    expect(screen.queryAllByRole('heading')[0]).toHaveTextContent('Leccie Monitor');
});


describe('On first run', () => {
    test('it should not have a previous readings table', () => {
        render(<App dataStore={db} />);
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    test('it should not show the alert bar',  () => {
        render(<App dataStore={db} />);
        expect(screen.queryByTestId('alert-banner')).not.toBeInTheDocument();
    });

    test('it should show "enter first reading" message', () => {
        render(<App dataStore={db} />);
        expect(screen.getByTestId('no-reading-message')).toBeInTheDocument();
    });

    test('it should not have a menu button', () => {
        render(<App dataStore={db} />);
        expect(screen.queryByRole('button', {name: 'Menu'})).not.toBeInTheDocument();
    });

    test('it should not have a menu', () => {
        render(<App dataStore={db} />);
        expect(screen.getByTestId('menu')).not.toBeInTheDocument();
    });
});
