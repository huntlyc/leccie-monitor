// End to end tests to test the app as a whole

import React from 'react';
import App from './App';
import { render, screen, fireEvent, RenderResult, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import TestReadingStore from './components/TestDataStore';
import { admin } from 'firebase-admin/lib/auth';
import userEvent from '@testing-library/user-event';
import FirebaseAdmin from './FirebaseAdmin';
import { UserDatastore } from './components/Datastore';

const firebaseTestTimelimit = 10000;

let seededAppDOM: RenderResult;
const db:UserDatastore = new TestReadingStore();

// Helper DB functions
const DB = {
    seed: async() => { 

        let clearDB = db.clearAllReadings();
        let addOldestReading =  db.addReading({
            date: new Date(Date.parse('2019/10/26 19:41')).toISOString(),
            reading: '34.19'
        });

        let addNewerReading = db.addReading({
            date: new Date(Date.parse('2019/10/27 10:21')).toISOString(),
            reading: '29.23'
        });

        let addLatestReading = db.addReading({
            date: new Date(Date.parse('2019/10/27 11:20')).toISOString(),
            reading: '1.04'
        });

        await Promise.all([clearDB,addOldestReading,addNewerReading,addLatestReading]);
    },
    clear: () => db.clearAllReadings()
};


/**
 * Seeds a datastore before rendering the app.
 * Waitins until the app is initialised by looking for 'last-reading'
 */
const renderAppWithSeededData = async() => {
    await DB.seed();
    seededAppDOM = render(<App dataStore={db} />);
    expect(await seededAppDOM.findByTestId('last-reading')).toBeInTheDocument();
};

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

    test('it should have a menu button', () => {
        render(<App dataStore={db} />);
        expect(screen.getByRole('button', {name: 'Menu'})).toBeInTheDocument();
    });

    test('it should have a menu', () => {
        render(<App dataStore={db} />);
        expect(screen.getByTestId('menu')).toBeInTheDocument();
    });
});


describe('menu operation', () => {
    test('it should toggle the menu when clicking on the menu button', async () =>{
        render(<App dataStore={db} />);
        
        expect(screen.getByTestId('menu').classList.contains('active')).toBeFalsy();

        fireEvent.click(screen.getByRole('button', {name: 'Menu'}));

        await waitFor(() => expect(screen.getByRole('button', {name: 'Close'})).toBeInTheDocument());
        expect(screen.getByTestId('menu').classList.contains('active')).toBeTruthy();
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
        fireEvent.change(screen.getByRole('textbox', {name: 'Latest Reading'}), { target: { value: inputReadingValue } });
        fireEvent.click(screen.getByRole('button', {name: 'Submit Reading +'}));
    };
    let renderedDOM: RenderResult;

    beforeEach(async() => {
        renderedDOM = render(<App dataStore={db} />);
        expect(await renderedDOM.findByTestId('no-reading-message')).toBeInTheDocument();
        submitValidReading();        
    });
    
    test('it should clear the input field', () => {
        expect(screen.getByRole('textbox', {name: 'Latest Reading'})).toHaveValue('');
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
        fireEvent.change(screen.getByRole('textbox', {name: 'Latest Reading'}), { target: { value: 'clear' } });
        fireEvent.click(screen.getByRole('button', {name: 'Submit Reading +'}));
    };

    beforeEach(async() => {
        await renderAppWithSeededData();       
        submitClearCommand();
    });

    test('it should clear the input field', () => {
        expect(screen.getByRole('textbox', {name: 'Latest Reading'})).toHaveValue('');
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

// This is slow, move out to firebase test suite that can be run every once in a while
xdescribe('app login', () => {
    const userCredentials = {
        email: 'bob@bobsworld.bob',
        password: 'supersecurepasswordLOL'
    };
    let fbUserRecord: admin.auth.UserRecord;

    beforeAll(async() => {
        fbUserRecord = await FirebaseAdmin.createUser(userCredentials.email, userCredentials.password);
    })

    test('it should have the login form on first run with no previous successful login', () => {
        render(<App dataStore={db} />);
        expect(screen.getByTestId('menu')).toBeInTheDocument();
        expect(screen.getByTestId('login')).toBeInTheDocument();
    });

    test('it should log in a valid user', async() => {
        render(<App dataStore={db} />);

        userEvent.click(screen.getByRole('button', {name: 'Menu'}));
        await waitFor(() => expect(screen.getByRole('button', {name: 'Close'})).toBeInTheDocument());

        userEvent.type(screen.getByLabelText('Email'), userCredentials.email);
        userEvent.type(screen.getByLabelText('Password'), userCredentials.password);
        userEvent.click(screen.getByRole('button', {
            name: 'Login'
        }));

        await waitFor(() => expect(screen.getByTestId('fb-user-id')).toBeInTheDocument());
    }, firebaseTestTimelimit);

    afterAll(() => FirebaseAdmin.deleteUser(fbUserRecord.uid));
});