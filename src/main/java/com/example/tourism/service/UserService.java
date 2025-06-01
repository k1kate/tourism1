package com.example.tourism.service;


import com.example.tourism.models.RegistrationRequest;
import com.example.tourism.models.User;
import com.example.tourism.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static org.apache.logging.log4j.util.Strings.isBlank;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void register(RegistrationRequest request) {

        if (isBlank(request.getUsername()) ||
                isBlank(request.getPassword()) ||
                isBlank(request.getConfirmPassword()) ||
                isBlank(request.getFirstname()) ||
                isBlank(request.getLastname()) ||
                isBlank(request.getMiddlename())) {
            throw new RuntimeException("Все поля обязательны для заполнения");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Пользователь уже существует");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())){
            System.out.println(request.getPassword());
            System.out.println(request.getConfirmPassword());
            throw new RuntimeException("Пароли не совпадают");

        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setMiddlename(request.getMiddlename());

        userRepository.save(user);
    }
}
