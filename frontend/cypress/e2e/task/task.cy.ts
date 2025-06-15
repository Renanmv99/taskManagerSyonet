describe('Tasks', () => {
  beforeEach(() => {
    cy.visit('/');
    
  });

  it('Usuário comum deve criar task com sucesso', () => {
    cy.userLogin();
    cy.createTaskWithUser();
    cy.get('.MuiSnackbar-root > .MuiPaper-root').should('have.text', 'Tarefa criada com sucesso!')
  })

  it('Admin deve criar uma task com sucesso', () => {
    cy.adminLogin();
    cy.createTaskWithAdmin();
    cy.get('.MuiSnackbar-root > .MuiPaper-root').should('have.text', 'Tarefa criada com sucesso!')
  })
    
  it('Admin deve criar uma task e excluí-la com sucesso', () => {
    const timestamp = Date.now()
    const taskData = {
        title: `Tarefa ${timestamp} para excluir`,
        description: "Descrição tarefa para excluir",
        endDate: "25-06-2025"
    }
    cy.adminLogin();
    cy.createTaskWithAdmin(taskData);
    cy.get('.MuiSnackbar-root > .MuiPaper-root').should('have.text', 'Tarefa criada com sucesso!')
    cy.contains('tr', `Tarefa ${timestamp} para excluir`)
        .find('button')
        .eq(1)                               
        .click({force: true})
    cy.get('.MuiSnackbar-root > .MuiPaper-root').should('have.text', 'Tarefa deletada com sucesso!')
  })
})