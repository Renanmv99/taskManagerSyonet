package br.com.syonet.dto.task;

import java.time.LocalDate;

public class TaskRequestDTO {
    public String title;
    public String description;
    public String status;
    public LocalDate endDate;
    public Long userId;
    public Boolean done;
}

