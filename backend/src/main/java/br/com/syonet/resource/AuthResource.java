package br.com.syonet.resource;

import br.com.syonet.dto.user.UserLoginDTO;
import br.com.syonet.model.UserModel;
import br.com.syonet.repository.UserRepository;
import br.com.syonet.service.AuthService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

@Path("/auth")
public class AuthResource {
    
    @Inject
    AuthService authService;

    @Inject
    UserRepository userRepository;

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
        String token = authService.login(loginRequest.email, loginRequest.password);

        if(token == null){
            return Response.status(Response.Status.UNAUTHORIZED).entity("Credenciais inválidas").build();
        }

        return Response.ok(Map.of("token", token)).build();
    }
}
