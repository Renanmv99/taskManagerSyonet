describe('Usuário', () =>{
    beforeEach(() => {
    cy.visit('/');
  });

    it('Deve excluir usuário com sucesso', () =>{
        cy.deleteUser()
        cy.get('.MuiSnackbar-root > .MuiPaper-root').should('have.text', 'Usuário deletado com sucesso!')
        cy.clock(3000)
        cy.get('.MuiSnackbar-root > .MuiPaper-root').should('not.be.visible')
    })
})