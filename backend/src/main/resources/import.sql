
--Usuários necessários para os testes Cypress
INSERT INTO usermodel (id, admin, name, email, password) VALUES (99, true, 'Admin', 'admin@gmail.com', '$2a$12$bvA5hJxPcT/4PSMpt3Uu7uuSdwHmOjhOqSNzmnvpWbbkDyDSScFYG');
INSERT INTO usermodel (id, admin, name, email, password) VALUES (98, false, 'User TaskManager', 'user.cypress@gmail.com', '$2a$12$WE07XHzUnBvCcsQBghkduerXNFvSDErhhLs.MYM43sgKy3XUPZrqi');

--Tarefa exemplo:
INSERT INTO taskmodel (done, enddate, id, user_id, description, status, title) values (false, '2025-08-29', 99, 99, 'Atualizar para o Ubuntu 25 (tarefa exemplo)', 'Pendente', 'Atualizar computador');