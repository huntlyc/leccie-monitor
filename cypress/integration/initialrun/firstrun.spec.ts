/// <reference types="cypress" />

import { afterEach } from "mocha";

const email = "bob@bob.com";
const password = "bob1234!2@A";

context('App Flow', () => {

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('http://localhost:3000/')
    });


    describe('Should have rendered the initial screen', () => {
        it('should have header', () => {
            cy.get('.App-header')
                .find('h1')
                .should('have.text', 'Leccie Monitor');
        });

        it('should have login form set to login', () => {
            // login is the active action
            cy.get('nav a[aria-current="page"]')
                .should('have.text', 'Login');

            // submit 'sign in' confirms the right form
            cy.get('button[type=submit]')
                .invoke('text')
                .should('match', /sign in/i);
        });
    });


    describe('It should allow a user to register', () => {
        beforeEach(() => {
            cy.get('nav a[href="/auth/register"]').click();
        })
        it('Should show registration from when registration is selected', () => {
            cy.get('nav a[aria-current="page"]')
                .should('have.text', 'Register');
            cy.get('button[type=submit]')
                .invoke('text')
                .should('match', /sign up/i);
        });

        it('Should warn about filling in empty fields', () => {
            cy.get('button[type=submit]').click();
            cy.get('[data-testid="login-errors"]')
                .invoke('text')
                .should('match', /please enter your login details/i);
        });

        it('Should warn about filling in email without password', () => {
            cy.get('#email').type(email);
            cy.get('button[type=submit]').click();
            cy.get('[data-testid="login-errors"]')
                .invoke('text')
                .should('match', /please enter your login details/i);
        });

        it('Should warn about filling in email without password', () => {
            cy.get('#password').type(email);
            cy.get('button[type=submit]').click();
            cy.get('[data-testid="login-errors"]')
                .invoke('text')
                .should('match', /please enter your login details/i);
        });

        it('Should register a new user', () => {
            cy.get('#email').type(email);
            cy.get('#password').type(password);
            cy.get('button[type=submit]').click();
            cy.get('[data-testid="no-reading-message"]')
                .invoke('text')
                .should('match', /enter your first reading to get started/i);

            cy.get('button[name="menu"]').click();
            cy.get('#root > div > div.popup.active > button').click();
            // login is the active action
            cy.get('nav a[aria-current="page"]')
                .should('have.text', 'Login');

            // submit 'sign in' confirms the right form
            cy.get('button[type=submit]')
                .invoke('text')
                .should('match', /sign in/i);
        });

    });

    describe('It should allow a user to login', () => {
        beforeEach(() => {
            cy.get('nav a[href="/auth/login"]').click();
        })
        it('Should show registration from when registration is selected', () => {
            cy.get('nav a[aria-current="page"]')
                .should('have.text', 'Login');
            cy.get('button[type=submit]')
                .invoke('text')
                .should('match', /sign in/i);
        });

        it('Should warn about filling in empty fields', () => {
            cy.get('button[type=submit]').click();
            cy.get('[data-testid="login-errors"]')
                .invoke('text')
                .should('match', /please enter your login details/i);
        });

        it('Should warn about filling in email without password', () => {
            cy.get('#email').type(email);
            cy.get('button[type=submit]').click();
            cy.get('[data-testid="login-errors"]')
                .invoke('text')
                .should('match', /please enter your login details/i);
        });

        it('Should warn about filling in email without password', () => {
            cy.get('#password').type(email);
            cy.get('button[type=submit]').click();
            cy.get('[data-testid="login-errors"]')
                .invoke('text')
                .should('match', /please enter your login details/i);
        });

        it('Should login an existing user', () => {
            cy.get('#email').type(email);
            cy.get('#password').type(password);
            cy.get('button[type=submit]').click();
            cy.get('[data-testid="no-reading-message"]')
                .invoke('text')
                .should('match', /enter your first reading to get started/i);
        });
    });

    describe('It should accept readings', () => {
        it('Should accept a valid reading', () => {
            cy.get('#reading').type('22.22');
            //reading submit
            cy.get('#root > div > div:nth-child(4) > form > div > button').click();
            // latest reading row (first row)
            cy.get('#last-readings > table > tbody > tr:nth-child(1) > td:nth-child(1)')
                .invoke('text')
                .should('match', /£22.22/);
        });

        it('Should not accept an invalid reading', () => {
            cy.get('#reading').type('bob!');
            //reading submit
            cy.get('#root > div > div:nth-child(4) > form > div > button').click();
            cy.get('p.error-message').invoke('text').should('match', /please enter a numeric value/i);
        });
    });

    describe('Clear readings', () => {
        it('It should clear readings', () => {
            cy.get('button[name="menu"]').click();
            //your account
            cy.get('#root > div > div.popup.active > div > ul > li:nth-child(2) > a').click();
            //clear readings
            cy.get('#root > div > div:nth-child(4) > ul > li:nth-child(1) > button').click();
            //Action complete msg
            cy.get('#root > div > div:nth-child(4) > p').invoke('text').should('match', /cleared!/i);

            //go back to front and check
            cy.get('button[name="menu"]').click();
            // readings
            cy.get('#root > div > div.popup.active > div > ul > li:nth-child(1) > a').click();
            // first run msg
            cy.get('[data-testid="no-reading-message"]')
                .invoke('text')
                .should('match', /enter your first reading to get started/i);
        });
    });

    describe('Account Deletion', () => {
        
        it('should delete the account', () => {
            cy.get('button[name="menu"]').click();
            //your account
            cy.get('#root > div > div.popup.active > div > ul > li:nth-child(2) > a').click();
            
            //delete account btn
            cy.get('#root > div > div:nth-child(4) > ul > li:nth-child(2) > button').click();

            cy.get('input[name="password"]').type(password);
            cy.get('#root > div > div:nth-child(4) > form > button').click();

            // login is the active action
            cy.get('nav a[aria-current="page"]')
                .should('have.text', 'Login');

            // submit 'sign in' confirms the right form
            cy.get('button[type=submit]')
                .invoke('text')
                .should('match', /sign in/i);
        });

        it('Should not login a deleted user', () => {
            cy.get('#email').type(email);
            cy.get('#password').type(password);
            cy.get('button[type=submit]').click();
            cy.get('[data-testid="login-errors"]')
                .invoke('text')
                .should('match', /Incorrect login details!/i);
        });
    })
});