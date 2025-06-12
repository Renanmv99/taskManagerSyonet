package br.com.syonet.dto.user;

public record UserResponseDTO(
    Long id,
    String name,
    String email,
    boolean admin
) {}
