/// <reference types="cypress" />


const testUser = {
    uid: null,
    email: 'bob@bobsworld.com',
    pass: 'bobiscoollol'
};

context('Login Tests', () => {


    beforeEach(() => {
        cy.visit('http://localhost:3000/')
    });

    it('it fails on invalid password', () =>{
        cy.get('#email').type(testUser.email);
        cy.get('#password').type(testUser.email);
        cy.get('form button').click();

        cy.get('[data-testid=login-errors]')
            .find('li')
            .first()
            .should('have.text', 'Please enter your login details');
    });

})