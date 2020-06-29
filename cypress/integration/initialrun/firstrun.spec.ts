/// <reference types="cypress" />

context('First Run', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/')
    });


    describe('Should have rendered the initial screen', () => {
        it('should have header', () => {
            cy.get('.App-header')
                .find('h1')
                .should('have.text', 'Leccie Monitor');
            cy.get('.App-header')
                .find('h1')
                .next()
                .should('have.text', 'Don’t be left in the dark…');
        });

        it('should have login form set to login', () => {
            // login is the active action
            cy.get('.login-options')
                .find('li')
                .first()
                .find('button')
                .should('have.class', 'active');

            // submit 'sign in' confirms the right form
            cy.get('button[type=submit]')
                .invoke('text')
                .should('match', /sign in/i);
        });

        it('should not show the reading input, last reading, and readings table', () => {
            // no enter reading form
            cy.get('#reading')
                .should('not.exist')

            // no last reading entry
            cy.get('.last-reading-price')
                .should('not.exist')
            cy.get('.last-reading-date')
                .should('not.exist')

            //no last readings table
            cy.get('#last-readings')
                .should('not.exist')
        });
    });
});