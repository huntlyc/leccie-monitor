import React from 'react';
import App from './App';
import { ReadingStorage } from './components/TestReadingStore';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'


// End to end tests to test the app as a whole

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

});

describe('on loading with previous saved values (seeded DB)', () => {

    beforeAll(() => { // Seed DB with dummy data
        db.readings.clear();
        db.readings.add({
            date: new Date(Date.parse('2019/10/26 19:41')).toISOString(),
            reading: '34.19'
        });

        db.readings.add({
            date: new Date(Date.parse('2019/10/27 10:21')).toISOString(),
            reading: '29.23'
        });

        db.readings.add({
            date: new Date(Date.parse('2019/10/27 11:20')).toISOString(),
            reading: '29.04'
        });
    });

    test('it should have last reading of: £29.04 - 27/10/2019 at 11:20', async () => {
        const renderedDOM = render(<App dataStore={db}/>);

        expect(await renderedDOM.findByTestId('last-reading')).toBeInTheDocument();
        expect(await renderedDOM.findByTestId('last-reading-price')).toBeInTheDocument();
        expect(await renderedDOM.findByTestId('last-reading-price')).toHaveTextContent('£29.04');

        expect(await renderedDOM.findByTestId('last-reading-date')).toBeInTheDocument();
        expect(await renderedDOM.findByTestId('last-reading-date')).toHaveTextContent('27/10/2019 at 11:20');
    });

    test('it should have readings table with correctly ordered output', async () => {
        const renderedDOM = render(<App dataStore={db}/>);
        const expectedTableOutput = "<thead><tr><th>Reading</th><th>+/- Diff</th><th>Date</th></tr></thead><tbody><tr class=\"\"><td>£29.04</td><td class=\"minus\">-0.19</td><td class=\"date\">27/10/2019 at 11:20</td></tr><tr class=\"\"><td>£29.23</td><td class=\"minus\">-4.96</td><td class=\"date\">27/10/2019 at 10:21</td></tr><tr class=\"\"><td>£34.19</td><td class=\"\"> — </td><td class=\"date\">26/10/2019 at 19:41</td></tr></tbody>";
    
        expect(await renderedDOM.findByRole('table')).toBeInTheDocument();
        expect(await renderedDOM.findByRole('table')).toContainHTML(expectedTableOutput);
        
    });

    afterAll(() => { // Clear out DB
        db.readings.clear();
    });
});


describe('On submitting a reading', () => {
    
    test('it should show the reading in the latest reading field ', async () => {
        const renderedDOM = render(<App dataStore={db} />);
        const inputValue = "33.04";
    
        fireEvent.change(screen.getByRole('textbox'), { target: { value: inputValue } });
        fireEvent.click(screen.getByRole('button'));
       
        expect(await renderedDOM.findByTestId('last-reading')).toBeInTheDocument();
        expect(await renderedDOM.findByTestId('last-reading-price')).toBeInTheDocument();
        expect(await renderedDOM.findByTestId('last-reading-price')).toHaveTextContent('£33.04');
    });

    test('it should show the reading in the latest reading table', async () => {
        const renderedDOM = render(<App dataStore={db} />);
        const inputValue = "33.04";
      
        fireEvent.change(screen.getByRole('textbox'), { target: { value: inputValue } });
        fireEvent.click(screen.getByRole('button'));
    
        expect(await renderedDOM.findByRole('table')).toBeInTheDocument();
        expect(await renderedDOM.findByRole('table')).toContainHTML("<td>£33.04</td>"); 
    });
});