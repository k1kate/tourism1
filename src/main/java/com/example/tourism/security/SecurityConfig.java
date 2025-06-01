package com.example.tourism.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;


@Slf4j
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/login", "/static/**") // Исключаем CSRF для этих путей
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login", "/register", "/static/**").permitAll()// доступ к странице входа и статическим ресурсам
                        .requestMatchers("/admin").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login") // настройка кастомной страницы входа
                        .permitAll()
                        .defaultSuccessUrl("/map", true) // перенаправление после успешного входа
                        .failureHandler(customAuthenticationFailureHandler()) // Указываем обработчик ошибок
                        .failureUrl("/login?error=true")
                        .successHandler((request, response, authentication) -> {

                                response.sendRedirect("/map");

                        })
                )
                .logout(logout -> logout.permitAll());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationFailureHandler customAuthenticationFailureHandler() {
        return new CustomAuthenticationFailureHandler();
    }
}
