package br.com.syonet;

import static io.restassured.RestAssured.given;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;

import br.com.syonet.dto.task.TaskRequestDTO;
import br.com.syonet.dto.user.UserDTO;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;

@QuarkusTest
public class TaskResourceTest {
    
    @Test
    public void shouldCreateTask(){
        
        UserDTO userRegister = new UserDTO();
        userRegister.setName("Task Created");
        userRegister.setEmail("task.created@gmail.com");
        userRegister.setPassword("12345");
        given()
            .contentType(ContentType.JSON)
            .body(userRegister)
        .when()
            .post("/auth/register")
        .then()
            .statusCode(201)
            .extract()
            .response();

        TaskRequestDTO task = new TaskRequestDTO();
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
}
