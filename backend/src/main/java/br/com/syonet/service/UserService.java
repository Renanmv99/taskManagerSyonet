package br.com.syonet.service;

import java.util.List;
import org.mindrot.jbcrypt.BCrypt;
import br.com.syonet.dto.user.UpdateUserDTO;
import br.com.syonet.dto.user.UserResponseDTO;
import br.com.syonet.model.TaskModel;
import br.com.syonet.model.UserModel;
import br.com.syonet.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

    @Transactional
    public UserModel create(UserModel user) {
        userRepository.persist(user);
        return user;
    }

    public List<UserResponseDTO> listAll() {
        return userRepository.listAll().stream()
                .map(u -> new UserResponseDTO(u.getId(), u.getName(), u.getEmail(), u.isAdmin()))
                .toList();
    }

    @Transactional
    public boolean deleteById(Long id) {
        UserModel user = userRepository.findById(id);
        if (user == null) {
            return false;
        }

        List<TaskModel> userTasks = TaskModel.find("assignee.id", id).list();
        for (TaskModel task : userTasks) {
            task.setAssignee(null);
            task.persist();
        }

        userRepository.delete(user);
        return true;
    }

    @Transactional
    public boolean updateUser(Long id, UpdateUserDTO update) {
        UserModel user = userRepository.findById(id);
        if (user == null) {
            return false;
        }

        if (update.name != null) {
            user.setName(update.name);
        }

        if (update.email != null) {
            user.setEmail(update.email);
        }

        if (update.password != null && !update.password.trim().isEmpty()) {
            String hashedPassword = BCrypt.hashpw(update.password, BCrypt.gensalt());
            user.setPassword(hashedPassword);
        }

        if (update.admin != null) {
            user.setAdmin(update.admin);
        }

        return true;
    }

    public UserResponseDTO findById(Long id) {
        UserModel user = userRepository.findById(id);
        if (user == null) return null;
        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.isAdmin());
    }
}