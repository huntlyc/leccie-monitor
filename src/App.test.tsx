import React from 'react';
import App from './App';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';

/**
 * Main Tests
 */
test('it renders without crashing', async() => {
    render(<App/>);
    //stop react warning about state changes after render 
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
});
