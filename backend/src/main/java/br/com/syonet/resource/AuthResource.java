package br.com.syonet.resource;

import br.com.syonet.dto.user.UserLoginDTO;
import br.com.syonet.model.UserModel;
import br.com.syonet.repository.UserRepository;
import br.com.syonet.service.AuthService;
import io.smallrye.jwt.auth.principal.JWTParser;
import io.smallrye.jwt.auth.principal.ParseException;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.Map;

@Path("/auth")
public class AuthResource {

    @Inject
    AuthService authService;

    @Inject
    UserRepository userRepository;

    @Inject
    JWTParser jwtParser;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response register(UserModel user){
        boolean created = authService.register(user);
        if(created){
            return Response.status(Response.Status.CREATED).build();
        }else{
            return Response.status(Response.Status.CONFLICT).entity("Email já cadastrado").build();
        }
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(UserLoginDTO loginRequest){
        AuthService.TokenResponse tokens = authService.generateTokens(loginRequest.email, loginRequest.password);
        if(tokens == null){
            return Response.status(Response.Status.UNAUTHORIZED).entity("Credenciais inválidas").build();
        }
        return Response.ok(Map.of(
                "token", tokens.accessToken,
                "refreshToken", tokens.refreshToken)).build();
    }

    @POST
    @Path("/refresh")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response refreshToken(Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Refresh token é obrigatório").build();
        }

        try {
            JsonWebToken jwt = jwtParser.parse(refreshToken);

            if (!"refresh".equals(jwt.getClaim("type"))) {
                return Response.status(Response.Status.UNAUTHORIZED).entity("Token inválido").build();
            }

            Object idClaim = jwt.getClaim("id");
            Long userId = Long.valueOf(idClaim.toString());
            String newAccessToken = authService.refreshToken(userId);

            if (newAccessToken == null) {
                return Response.status(Response.Status.UNAUTHORIZED).entity("Usuário não encontrado").build();
            }

            return Response.ok(Map.of("token", newAccessToken)).build();

        } catch (ParseException e) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Refresh token inválido").build();
        }
    }
}