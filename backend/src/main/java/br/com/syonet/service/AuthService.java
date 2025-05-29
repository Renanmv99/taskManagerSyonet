package br.com.syonet.service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import at.favre.lib.crypto.bcrypt.BCrypt;
import br.com.syonet.model.UserModel;
import br.com.syonet.repository.UserRepository;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AuthService {

    @Inject
    UserRepository userRepository;

    @Transactional
    public boolean register(UserModel user) {
        if (userRepository.findByEmail(user.email).isPresent()) {
            return false;
        }

        String hash = BCrypt.withDefaults().hashToString(12, user.password.toCharArray());
        user.password = hash;

        userRepository.persist(user);

        return true;
    }

    @Transactional
    public String login(String email, String password) {
        Optional<UserModel> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return null;
        }

        UserModel user = userOpt.get();

        BCrypt.Result result = BCrypt.verifyer().verify(password.toCharArray(), user.password);

        if (!result.verified) {
            return null;
        }

        Set<String> roles = new HashSet<>();
        roles.add(user.admin ? "admin" : "user");

        String token = Jwt.issuer("task-manager")
                .upn(user.email)
                .groups(roles)
                .claim("id", user.id)
                .expiresIn(3600)
                .sign();

        return token;
    }

}
