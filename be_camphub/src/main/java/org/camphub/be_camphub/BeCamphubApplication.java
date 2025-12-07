package org.camphub.be_camphub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BeCamphubApplication {
    public static void main(String[] args) {
        SpringApplication.run(BeCamphubApplication.class, args);
    }
}
