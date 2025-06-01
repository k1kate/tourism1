package com.example.tourism.models;

import lombok.Data;

@Data
public class RegistrationRequest {
    private String username;
    private String password;
    private String confirmPassword;
    private String firstname;
    private String lastname;
    private String middlename;
}
