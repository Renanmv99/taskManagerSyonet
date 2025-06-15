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
      .click({ force: true })
    cy.get('.MuiSnackbar-root > .MuiPaper-root').should('have.text', 'Tarefa deletada com sucesso!')
  })

  it.only('Admin deve criar task e editá-la', () => {
    const timestamp = Date.now()
    const taskData = {
      title: `Tarefa ${timestamp} para editar`,
      description: "Descrição tarefa para editar",
      endDate: "25-06-2025"
    }
    cy.adminLogin()
    cy.createTaskWithAdmin(taskData)
    cy.contains('tr', `Tarefa ${timestamp} para editar`)
      .find('button')
      .eq(0)
      .click()
    cy.get('#createTaskTitle')
      .should('have.value', `Tarefa ${timestamp} para editar`)
      .clear()
      .type(`${timestamp}TAREFA EDITADA COM SUCESSO`)
    cy.get('#createTaskDescription')
      .should('have.value', "Descrição tarefa para editar")
      .clear()
      .type("DESCRIÇÃO DA TAREFA EDITADA COM SUCESSO")
    cy.get('.MuiPickersSectionList-root')
      .type("25-08-2027")
    cy.get('#createTaskStatus').click()
    cy.get('#selectCompleto').click()
    cy.get('.css-sg6wi7 > .MuiBox-root > #createTaskButton').click()
    cy.get('.MuiSnackbar-root > .MuiPaper-root').should('have.text', 'Tarefa atualizada com sucesso!')
    cy.contains('tr', `${timestamp}TAREFA EDITADA COM SUCESSO`)
  })
})