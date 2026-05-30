package com.vidor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class VidorApplication {

	public static void main(String[] args) {
		SpringApplication.run(VidorApplication.class, args);
	}
}

