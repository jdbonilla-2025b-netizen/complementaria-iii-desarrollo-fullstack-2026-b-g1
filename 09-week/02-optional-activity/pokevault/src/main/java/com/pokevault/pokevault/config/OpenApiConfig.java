package com.pokevault.pokevault.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI pokeVaultOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("PokeVault API")
                .version("1.0.0")
                .description("A minimal REST API to manage your Pokémon card collection."));
    }
}