import React from 'react';
import App from './App';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';

/**
 * Main Tests
 */
test('it renders without crashing', () => {
    render(<App/>);
});
