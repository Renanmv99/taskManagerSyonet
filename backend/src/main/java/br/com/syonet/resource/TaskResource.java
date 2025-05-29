package br.com.syonet.resource;

import java.util.List;

import br.com.syonet.dto.task.TaskRequestDTO;
import br.com.syonet.dto.task.UpdateTaskDTO;
import br.com.syonet.model.TaskModel;
import br.com.syonet.service.TaskService;
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
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/task")
public class TaskResource {

    @Inject
    TaskService taskService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<TaskModel> listAll(
            @QueryParam("title") String title,
            @QueryParam("status") String status,
            @QueryParam("description") String description,
            @QueryParam("endDate") String enDate,
            @QueryParam("userId") Long userId) {
        return taskService.listAll(title, status, description ,enDate, userId);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(TaskRequestDTO request) {
        TaskModel created = taskService.create(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("admin")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = taskService.deleteById(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    @PATCH
    @Path("/{id}")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTask(@PathParam("id") Long id, UpdateTaskDTO request) {
        TaskModel updatedTask = taskService.updateTask(id, request);
        return updatedTask != null
                ? Response.ok(updatedTask).build()
                : Response.status(Response.Status.NOT_FOUND).build();
    }
    

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<TaskModel> list(
            @QueryParam("title") String title,
            @QueryParam("status") String status,
            @QueryParam("description") String description,
            @QueryParam("endDate") String enDate,
            @QueryParam("userId") Long userId) {
        return taskService.listAll(title, status, description ,enDate, userId);
    }
}
