package br.com.syonet.repository;

import java.util.Optional;

import br.com.syonet.model.UserModel;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserRepository implements PanacheRepository<UserModel> {

    public Optional<UserModel> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }
}
