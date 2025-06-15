describe('Usuário', () =>{
    beforeEach(() => {
    cy.visit('/');
  });

    it('Deve excluir usuário com sucesso', () =>{
          const timestamp = Date.now()
          const userData = {
          name: 'Usuário deletado',
          email: `deletado${timestamp}@gmail.com`,
          password: '12345'
  }
        cy.deleteUser(userData)
        cy.get('.MuiSnackbar-root > .MuiPaper-root').should('have.text', 'Usuário deletado com sucesso!')
    })
})