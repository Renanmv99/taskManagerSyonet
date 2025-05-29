package br.com.syonet.service;

import java.util.List;

import org.mindrot.jbcrypt.BCrypt;

import br.com.syonet.dto.user.UpdateUserDTO;
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

    public List<UserModel> listAll() {
        return userRepository.listAll();
    }

    @Transactional
    public boolean deleteById(Long id) {
        UserModel user = userRepository.findById(id);
        if (user == null) {
            return false;
        }

        List<TaskModel> userTasks = TaskModel.find("assignee.id", id).list();
        if (!userTasks.isEmpty()) {
            throw new IllegalStateException(
                    String.format("Este usuário não pode ser deletado pois possui %d tarefa(s) atrelada(s).",
                            userTasks.size()));
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

        if (update.password != null) {
            String hashedPassword = BCrypt.hashpw(update.password, BCrypt.gensalt());
            user.setPassword(hashedPassword);
        }

        if (update.admin != null) {
            user.setAdmin(update.admin);
        }

        return true;
    }

    public UserModel findById(Long id) {
        return UserModel.findById(id);
    }
}