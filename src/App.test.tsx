// End to end tests to test the app as a whole

import React from 'react';
import App from './App';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import TestReadingStore from './components/TestDataStore';
import { UserDatastore } from './components/Datastore';


const db:UserDatastore = new TestReadingStore();


/**
 * Main Tests
 */
test('it renders without crashing', async() => {
    render(<App dataStore={db} />);
    //stop react warning about state changes after render 
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
});
