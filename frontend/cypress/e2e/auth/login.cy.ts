describe('Login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Usuário comum deve realizar login com sucesso', () => {
    cy.userLogin();
    cy.get('#headerTitle').should('have.text', 'Gerenciador de Tarefas')
  })

    
  it('Usuário admin deve realizar login com sucesso', () => {
   cy.adminLogin();
   cy.get('#headerTitle').should('have.text', 'Gerenciador de Tarefas')
   cy.get('#usersButton').should('be.visible')
  })
})