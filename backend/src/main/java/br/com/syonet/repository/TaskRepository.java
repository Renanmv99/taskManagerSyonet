package br.com.syonet.repository;

import br.com.syonet.model.TaskModel;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TaskRepository implements PanacheRepository <TaskModel>{
    
}
