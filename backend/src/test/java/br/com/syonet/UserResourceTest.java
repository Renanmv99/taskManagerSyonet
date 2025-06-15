package br.com.syonet;

import static io.restassured.RestAssured.given;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import br.com.syonet.dto.user.UserDTO;
import static org.hamcrest.Matchers.*;
import br.com.syonet.dto.user.UserLoginDTO;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;

@QuarkusTest
public class UserResourceTest {

    private static String token;
    UserDTO user = new UserDTO();

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
    public void shouldGetUsers(){
        given()
                .header("Authorization", "Bearer " + token)
                .when()
                .get("/user")
                .then()
                .statusCode(200)
                .body("$", is(not(empty())));
    }

    @Test
    public void shoulCreateUser() {
        user.name = "Novo usuário";
        user.email = "newuser@gmail.com";
        user.password = "12345";
        user.admin = true;

        given()
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + token)
                .body(user)
                .when()
                .post("/user")
                .then()
                .statusCode(201)
                .extract()
                .response();
    }

    @Test
    public void shouldUpdateUser(){
        user.name = "Usuário atualizado";
        user.password = "emailatualizado";
        user.password = "54321";
        user.admin = false;

        given()
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + token)
                .body(user)
                .when()
                .patch("/user/1")
                .then()
                .statusCode(204)
                .extract()
                .response();
    }


    @Test
    public void shouldDeleteUser() {
        given()
                .header("Authorization", "Bearer " + token)
                .when()
                .delete("/user/1")
                .then()
                .statusCode(204);
    }
}
