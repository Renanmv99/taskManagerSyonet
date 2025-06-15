package br.com.syonet;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;

import org.junit.jupiter.api.Test;
import static org.hamcrest.Matchers.notNullValue;
import br.com.syonet.dto.user.UserDTO;
import br.com.syonet.dto.user.UserLoginDTO;

import static io.restassured.RestAssured.given;

@QuarkusTest
public class AuthResourceTest {

    @Test
    public void deveFalharLogin() {
        given()
                .contentType(ContentType.JSON)
                .body("{ \"email\": \"renan@gmail.com\", \"password\": \"12345\" }")
                .when()
                .post("/auth/login")
                .then()
                .statusCode(401);
    }

    @Test
    public void deveFazerRegistroComSucesso() {
        UserDTO userRegister = new UserDTO();
        userRegister.setName("Renan Vicente");
        userRegister.setEmail("renanteste@gmail.com");
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
    }

    @Test
    public void deveLogarComSucesso() {

        UserDTO userRegister = new UserDTO();
        userRegister.setName("Renan Vicente");
        userRegister.setEmail("renan@gmail.com");
        userRegister.setPassword("12345");
        given()
                .contentType(ContentType.JSON)
                .body(userRegister)
                .when()
                .post("/auth/register")
                .then()
                .statusCode(201);

        UserLoginDTO userLogin = new UserLoginDTO();
        userLogin.email = "renan@gmail.com";
        userLogin.password = "12345";
        given()
                .contentType(ContentType.JSON)
                .body(userLogin)
                .when()
                .post("/auth/login")
                .then()
                .statusCode(200)
                .body("token", notNullValue());
    }
}