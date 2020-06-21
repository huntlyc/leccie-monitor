// End to end tests to test the app as a whole

import React from 'react';
import App from './App';
import { TestLocalStorageReadingStorage } from './components/TestReadingStore';
import { render, screen, fireEvent, waitFor, cleanup, RenderResult } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { IReadingStore } from './components/ReadingStore';

let seededAppDOM: RenderResult;

const fakeIndexDB: IReadingStore = new TestLocalStorageReadingStorage();

// Helper DB functions
const DB = {
    seed: async() => { 
        let p1 = fakeIndexDB.clearAllReadings();
        let p2 =  fakeIndexDB.addReading({
            date: new Date(Date.parse('2019/10/26 19:41')).toISOString(),
            reading: '34.19'
        });

        let p3 = fakeIndexDB.addReading({
            date: new Date(Date.parse('2019/10/27 10:21')).toISOString(),
            reading: '29.23'
        });

        let p4 = fakeIndexDB.addReading({
            date: new Date(Date.parse('2019/10/27 11:20')).toISOString(),
            reading: '1.04'
        });

        await Promise.all([p1,p2,p3,p4]);
    },
    clear: () => fakeIndexDB.clearAllReadings(),
};


/**
 * Seeds a datastore before rendering the app.
 * Waitins until the app is initialised by looking for 'last-reading'
 */
const renderAppWithSeededData = async() => {
    await DB.seed();
    seededAppDOM = render(<App dataStore={fakeIndexDB} />);
    expect(await seededAppDOM.findByTestId('last-reading')).toBeInTheDocument();
};


/**
 * Main Tests
 */
test('it renders without crashing', () => {
    render(<App dataStore={fakeIndexDB} />);
    expect(screen.queryAllByRole('heading')[0]).toHaveTextContent('Leccie Monitor');
});


describe('On first run', () => {

    test('it should not have a previous readings table', () => {
        render(<App dataStore={fakeIndexDB} />);
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    test('it should not show the alert bar',  () => {
        render(<App dataStore={fakeIndexDB} />);
        expect(screen.queryByTestId('alert-banner')).not.toBeInTheDocument();
    });

    test('it should show "enter first reading" message', () => {
        render(<App dataStore={fakeIndexDB} />);
        expect(screen.getByTestId('no-reading-message')).toBeInTheDocument();
    });

});


describe('On loading with previous saved values [from seeded DB]', () => {
    beforeEach(() => renderAppWithSeededData());

    test('it should show last reading of: £1.04 - 27/10/2019 at 11:20', async () => {
        expect(await seededAppDOM.findByTestId('last-reading')).toBeInTheDocument();
        expect(await seededAppDOM.findByTestId('last-reading-price')).toBeInTheDocument();
        expect(await seededAppDOM.findByTestId('last-reading-price')).toHaveTextContent('£1.04');

        expect(await seededAppDOM.findByTestId('last-reading-date')).toBeInTheDocument();
        expect(await seededAppDOM.findByTestId('last-reading-date')).toHaveTextContent('27/10/2019 at 11:20');
    });

    test('it should show readings table with correctly ordered output', async () => {
        const expectedTableOutput = "<thead><tr><th>Reading</th><th>+/- Diff</th><th>Date</th></tr></thead><tbody><tr class=\"\"><td>£1.04</td><td class=\"minus\">-28.19</td><td class=\"date\">27/10/2019 at 11:20</td></tr><tr class=\"\"><td>£29.23</td><td class=\"minus\">-4.96</td><td class=\"date\">27/10/2019 at 10:21</td></tr><tr class=\"\"><td>£34.19</td><td class=\"\"> — </td><td class=\"date\">26/10/2019 at 19:41</td></tr></tbody>";
    
        expect(await seededAppDOM.findByRole('table')).toBeInTheDocument();
        expect(await seededAppDOM.findByRole('table')).toContainHTML(expectedTableOutput);
    });

    afterEach(() => DB.clear());
});


describe('On submitting a reading on first run', () => {
    const inputReadingValue = "5.04";
    const submitValidReading = () => {
        fireEvent.change(screen.getByRole('textbox'), { target: { value: inputReadingValue } });
        fireEvent.click(screen.getByRole('button'));
    };
    let renderedDOM: RenderResult;

    beforeEach(async() => {
        renderedDOM = render(<App dataStore={fakeIndexDB} />);
        expect(await renderedDOM.findByTestId('no-reading-message')).toBeInTheDocument();
        submitValidReading();        
    });
    
    test('it should clear the input field', () => {
        expect(screen.getByRole('textbox')).toHaveValue('');
    });

    test('it should show the reading in the latest reading field ', async () => {
        expect(await renderedDOM.findByTestId('last-reading')).toBeInTheDocument();
        expect(await renderedDOM.findByTestId('last-reading-price')).toBeInTheDocument();
        expect(await renderedDOM.findByTestId('last-reading-price')).toHaveTextContent(`£${inputReadingValue}`);
    });

    test('it should show the reading in the latest reading table', async () => {    
        expect(await renderedDOM.findByRole('table')).toBeInTheDocument();
        expect(await renderedDOM.findByRole('table')).toContainHTML(`<td>£${inputReadingValue}</td>`); 
    });

    test('it should show the alert bar', () => {
        expect(renderedDOM.getByTestId('alert-banner')).toBeInTheDocument();
    });

    afterEach(() => DB.clear());
});


describe('On submitting "clear" [From seeded DB]',  () => {
    const submitClearCommand = () => {
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'clear' } });
        fireEvent.click(screen.getByRole('button'));
    };

    beforeEach(async() => {
        await renderAppWithSeededData();       
        submitClearCommand();
    });

    test('it should clear the input field', () => {
        expect(screen.getByRole('textbox')).toHaveValue('');
    });

    test('it should not have a previous readings table', () => {
        expect(seededAppDOM.queryByRole('table')).not.toBeInTheDocument();
    });

    test('it should show "enter first reading" message', () => {
        expect(seededAppDOM.getByTestId('no-reading-message')).toBeInTheDocument();
    });

    test('it should not show the alert bar', () => {
        expect(seededAppDOM.queryByTestId('alert-banner')).not.toBeInTheDocument();
    });

    afterEach(() => DB.clear());
});
