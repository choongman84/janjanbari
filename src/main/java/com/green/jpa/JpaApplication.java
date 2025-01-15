package com.green.jpa;

import com.fasterxml.jackson.datatype.hibernate5.jakarta.Hibernate5JakartaModule;
import jakarta.persistence.EntityListeners;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

@SpringBootApplication
@EnableJpaAuditing
public class JpaApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(JpaApplication.class, args);
        System.out.println("Beans: " + Arrays.toString(context.getBeanDefinitionNames()));

        SecureRandom secureRandom = new SecureRandom();
        byte[] key = new byte[64];
        secureRandom.nextBytes(key);
        String secretKey = Base64.getEncoder().encodeToString(key);
        System.out.println("Generated Secret Key: " + secretKey);
    }
}
