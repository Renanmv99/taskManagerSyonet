/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      userLogin(): Chainable<void>
      adminLogin(): Chainable<void>
      deleteUser(userDataDeleted): Chainable<void>
      createTaskWithUser(): Chainable<void>
      createTaskWithAdmin(taskData?: TaskData): Chainable<void>
      register(userData?: UserData): Chainable<void>
    }
  }
}

interface UserData {
  name?: string
  email?: string
  password?: string
}  

interface TaskData {
  title?: string
  description?: string
  endDate?: string
}  

const defaultUserData = {
    name: 'User TaskManager',
    email: 'user.cypress@gmail.com',
    password: '12345'
  }

const defaultTaskData = {
    title: 'Titulo Tarefa Cypress',
    description: 'Descrição tarefa Cypress',
    endDate: '30-07-2025'
  }

  Cypress.Commands.add('register', (userData?: UserData) => {
      
    const finalUserData = { ...defaultUserData, ...userData }

    cy.get('#registerBtn').click()
    cy.get('#registerNameField').type(finalUserData.name)
    cy.get('#registerEmailField').type(finalUserData.email)
    cy.get('#registerPasswordField').type(finalUserData.password)
    cy.get('#registerConfirmPasswordField').type(finalUserData.password)
    cy.get('#registerButton').click()
})

Cypress.Commands.add('userLogin', () =>{
    cy.get('#loginEmail').type(defaultUserData.email)
    cy.get('#loginPassword').type(defaultUserData.password)
    cy.get('#loginButton').click()
})

Cypress.Commands.add('adminLogin', () =>{
    cy.get('#loginEmail').type("admin@gmail.com")
    cy.get('#loginPassword').type('12345')
    cy.get('#loginButton').click()
})

Cypress.Commands.add('createTaskWithUser', () => {
    cy.get('#addTaskButton').click()
    cy.get('#createTaskTitle').type('Task do teste Cypress')
    cy.get('#createTaskDescription').type('Descrição do teste Cypress')
    cy.get('.MuiPickersSectionList-root').type('22-08-2025')
    cy.get('#createTaskAssignee').should('not.exist')
    cy.get('#createTaskStatus').click()
    cy.get('#selectPendente').click()
    cy.get('.css-sg6wi7 > .MuiBox-root > #createTaskButton').click()
})

Cypress.Commands.add('createTaskWithAdmin', (taskData?: TaskData) => {
    const finalTaskData = { ...defaultTaskData, ...taskData }

    cy.get('#addTaskButton').click()
    cy.get('#createTaskTitle').type(finalTaskData.title)
    cy.get('#createTaskDescription').type(finalTaskData.description)
    cy.get('.MuiPickersSectionList-root').type(finalTaskData.endDate)
    cy.get('#createTaskAssignee').click()
    cy.contains('li', 'Renan Vicente teste').click();
    cy.get('#createTaskStatus').click()
    cy.get('#selectPendente').click()
    cy.get('.css-sg6wi7 > .MuiBox-root > #createTaskButton').click()
})

Cypress.Commands.add('deleteUser', (userDataDeleted) => {

    cy.register(userDataDeleted)
    cy.adminLogin()
    cy.get('#usersButton').click()
    cy.contains('tr', 'Usuário deletado')
    .find('button')
    .eq(1)                               
    .click();
})

export {}