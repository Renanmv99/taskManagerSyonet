
describe('Registro de Usuário', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Deve registrar tentar registrar um usuário já cadastrado', () => { 
    cy.register();
    cy.get('.MuiSnackbar-root > .MuiPaper-root').should('have.text', 'Email já cadastrado!')
  });

  it('Deve realizar o cadastro com sucesso', () => {
    const timestamp = Date.now()
    const userData = {
    name: 'Renan Vicente',
    email: `task${timestamp}@gmail.com`,
    password: '12345'
  }
    cy.register(userData)
    cy.get('#loginButton').should('exist')
    cy.get('.MuiTypography-h5').should('have.text', 'Login')
  })


});
