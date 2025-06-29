package br.com.syonet;

import static io.restassured.RestAssured.given;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.hamcrest.Matchers.*;

import br.com.syonet.dto.task.TaskRequestDTO;
import br.com.syonet.dto.user.UserDTO;
import br.com.syonet.dto.user.UserLoginDTO;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;

@QuarkusTest
public class TaskResourceTest {

    TaskRequestDTO task = new TaskRequestDTO();
    private static String token;

    private int createTask() {
        TaskRequestDTO task = new TaskRequestDTO();
        task.title = "Task de teste";
        task.description = "Criada on demand";
        task.endDate = LocalDate.now().plusDays(5);
        task.status = "Pendente";
        task.userId = 1L;

        return given()
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + token)
                .body(task)
                .when()
                .post("/task")
                .then()
                .statusCode(201)
                .extract()
                .path("id");
    }

    @BeforeEach
    public void shouldRegisterAndLogin() {
        UserDTO userRegister = new UserDTO();
        userRegister.setName("Renan Vicente");
        userRegister.setEmail("userresource@gmail.com");
        userRegister.setPassword("12345");
        userRegister.setAdmin(true);
        var registerResponse = given()
                .contentType(ContentType.JSON)
                .body(userRegister)
                .when()
                .post("/auth/register");
        if (registerResponse.getStatusCode() != 201 && registerResponse.getStatusCode() != 409) {
            throw new RuntimeException(
                    "Falha ao registrar o usuário de teste! Status: " + registerResponse.getStatusCode());
        }

        UserLoginDTO userLogin = new UserLoginDTO();
        userLogin.email = "userresource@gmail.com";
        userLogin.password = "12345";
        token = given()
                .contentType(ContentType.JSON)
                .body(userLogin)
                .when()
                .post("/auth/login")
                .then()
                .statusCode(200)
                .body("token", notNullValue())
                .extract()
                .path("token");
    }

    @Test
    public void shoulGetTasks(){
        createTask();
        given()
                .header("Authorization", "Bearer " + token)
                .get("task")
                .then()
                .statusCode(200)
                .body("$", is(not(empty())));
    }


    @Test
    public void shouldCreateTask() {
        task.title = "Título tarefa teste";
        task.description = "Descrição tarefa teste";
        task.endDate = LocalDate.parse("2025-06-25");
        task.status = "Pendente";
        task.userId = 1L;

        given()
                .contentType(ContentType.JSON)
                .body(task)
                .when()
                .post("/task")
                .then()
                .statusCode(201);
    }

    @Test
    public void shouldUpdateTask() {
        int taskId = createTask();
        task.title = "Tarefa atualizada";
        task.description = "Descrição atualizada";
        task.endDate = LocalDate.parse("2026-07-28");
        task.status = "Cancelado";

        given()
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + token)
                .body(task)
                .when()
                .patch("/task/" + taskId)
                .then()
                .statusCode(200);
    }

    @Test
    public void shouldDeleteTask(){
        int taskId = createTask();
        
        given()
                .header("Authorization", "Bearer " + token)
                .when()
                .delete("/task/" + taskId)
                .then()
                .statusCode(204);
    }
}
