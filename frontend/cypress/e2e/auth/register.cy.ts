
describe('Registro de Usuário', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Deve tentar registrar um usuário já cadastrado', () => {
    cy.register();
    cy.get('.MuiSnackbar-root > .MuiPaper-root').should('have.text', 'Email já cadastrado!')
  });

  it.only('Deve realizar o cadastro com sucesso e verificar se ele está na lista', () => {
    const timestamp = Date.now()
    const userData = {
      name: 'Task Manager User',
      email: `task${timestamp}@gmail.com`,
      password: '12345'
    }
    cy.register(userData)
    cy.get('#loginButton').should('exist')
    cy.get('.MuiTypography-h5').should('have.text', 'Login')
    cy.adminLogin()
    cy.get('#usersButton').click()
    cy.contains('tr', `task${timestamp}@gmail.com`)
      .should('be.visible')
  })
});
