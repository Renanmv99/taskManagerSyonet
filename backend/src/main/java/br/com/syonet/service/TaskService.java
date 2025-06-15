package br.com.syonet.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import br.com.syonet.dto.task.TaskRequestDTO;
import br.com.syonet.model.TaskModel;
import br.com.syonet.model.UserModel;
import br.com.syonet.repository.TaskRepository;
import br.com.syonet.repository.UserRepository;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class TaskService {

    @Inject
    UserRepository userRepository;

    @Inject
    TaskRepository taskRepository;

    @Inject
    SecurityIdentity securityIdentity;

    @Transactional
    public TaskModel create(TaskRequestDTO request) {
        UserModel user = userRepository.findById(request.userId);

        if (user == null) {
            throw new NotFoundException("Usuário com ID " + request.userId + " não encontrado.");
        }

        TaskModel task = new TaskModel();
        task.title = request.title;
        task.description = request.description;
        task.status = request.status;
        task.endDate = request.endDate;
        task.assignee = user;
        task.done = request.done != null ? request.done : false;

        taskRepository.persist(task);
        return task;
    }

    public List<TaskModel> listAll(String title, String status, String description, String endDateStr, Long userId) {
        boolean isAdmin = securityIdentity.hasRole("admin");
        String email = securityIdentity.getPrincipal().getName();

        UserModel currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        Map<String, Object> params = new HashMap<>();
        StringBuilder query = new StringBuilder("1=1");

        if (status != null) {
            query.append(" and status = :status");
            params.put("status", status);
        }

        if (endDateStr != null) {
            LocalDate endDate = LocalDate.parse(endDateStr);
            query.append(" and endDate = :endDate");
            params.put("endDate", endDate);
        }

        if (isAdmin && userId != null) {
            UserModel user = userRepository.findById(userId);
            if (user == null)
                throw new NotFoundException("Usuário com ID " + userId + " não encontrado");
            query.append(" and assignee = :assignee");
            params.put("assignee", user);
        }

        if (!isAdmin) {
            query.append(" and assignee = :assignee");
            params.put("assignee", currentUser);
        }

        if (title != null && !title.trim().isEmpty()) {
            query.append(" and LOWER(title) LIKE LOWER(:title)");
            params.put("title", "%" + title.trim() + "%");
        }

        return taskRepository.find(query.toString(), params).list();
    }

    public boolean deleteById(Long id) {
        TaskModel task = taskRepository.findById(id);
        if (task == null) {
            return false;
        }
        taskRepository.delete(task);
        return true;
    }

    @Transactional
    public TaskModel updateTask(Long id, TaskRequestDTO request) {
        TaskModel task = TaskModel.findById(id);
        if (task == null)
            return null;

        if (request.title != null) {
            task.title = request.title;
        }
        if (request.description != null) {
            task.description = request.description;
        }
        if (request.status != null) {
            task.status = request.status;
        }
        if (request.userId != null) {
            UserModel user = UserModel.findById(request.userId);
            if (user != null) {
                task.assignee = user;
            }
        }
        if (request.endDate != null) {
            task.endDate = request.endDate;
        }
        if (request.done != null) {
            task.done = request.done;
        }
        return task;
    }
}