/// <reference types="cypress" />

import { TaskData, UserData } from "./types";

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      userLogin(): Chainable<void>;
      adminLogin(): Chainable<void>;
      deleteUser(userDataDeleted: UserData): Chainable<void>;
      createTaskWithUser(): Chainable<void>;
      createTaskWithAdmin(taskData?: TaskData): Chainable<void>;
      register(userData?: UserData): Chainable<void>;
    }
  }
}
