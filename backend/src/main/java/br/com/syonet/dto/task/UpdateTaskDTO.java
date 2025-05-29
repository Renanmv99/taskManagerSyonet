package br.com.syonet.dto.task;

import java.time.LocalDate;

public class UpdateTaskDTO {
    public String title;
    public String description;
    public String status;
    public Long userId;
    public LocalDate endDate;
    public Boolean done;
}


