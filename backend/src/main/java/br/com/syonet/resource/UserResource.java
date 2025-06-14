package br.com.syonet.resource;

import java.util.List;
import java.util.Map;

import br.com.syonet.dto.user.UserDTO;
import br.com.syonet.dto.user.UserResponseDTO;
import br.com.syonet.model.UserModel;
import br.com.syonet.repository.UserRepository;
import br.com.syonet.service.UserService;
import jakarta.ws.rs.Produces;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/user")
public class UserResource {

    @Inject
    UserService userService;

    @Inject
    UserRepository userRepository;

    @GET
    @RolesAllowed("admin")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserResponseDTO> listAll() {
        return userService.listAll();
    }

    @POST
    @RolesAllowed("admin")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(UserModel user) {
        UserModel created = userService.create(user);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("admin")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        try {
            boolean deleted = userService.deleteById(id);
            if (deleted) {
                return Response.noContent().build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Usuário não encontrado")
                        .build();
            }
        } catch (IllegalStateException e) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(e.getMessage())
                    .build();
        }
    }

    @PATCH
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateUser(@PathParam("id") Long id, UserDTO update) {
        boolean updated = userService.updateUser(id, update);
        return updated
                ? Response.noContent().build()
                : Response.status(Response.Status.NOT_FOUND).build();
    }

    @GET
    @Path("/exists")
    @Produces(MediaType.APPLICATION_JSON)
    public Response hasUsers() {
        boolean exists = userRepository.count() > 0;
        return Response.ok(Map.of("hasUsers", exists)).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed("admin")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findById(@PathParam("id") Long id) {
        UserResponseDTO user = userService.findById(id);
        return user != null
                ? Response.ok(user).build()
                : Response.status(Response.Status.NOT_FOUND).build();
    }

}
