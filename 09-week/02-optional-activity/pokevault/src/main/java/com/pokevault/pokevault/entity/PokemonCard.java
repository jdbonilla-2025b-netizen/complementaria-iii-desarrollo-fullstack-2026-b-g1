package com.pokevault.pokevault.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "pokemon_cards")
public class PokemonCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "type is required")
    private String type;

    @NotNull(message = "hp is required")
    @Min(value = 10, message = "hp must be at least 10")
    @Max(value = 500, message = "hp must be at most 500")
    private Integer hp;

    @NotBlank(message = "rarity is required")
    private String rarity;

    @NotBlank(message = "setName is required")
    private String setName;

    @NotNull(message = "estimatedValue is required")
    @PositiveOrZero(message = "estimatedValue must be 0 or more")
    private Double estimatedValue;

    // Constructor vacío (JPA lo exige)
    public PokemonCard() {}


public Long getId() { return id; }
public void setId(Long id) { this.id = id; }

public String getName() { return name; }
public void setName(String name) { this.name = name; }

public String getType() { return type; }
public void setType(String type) { this.type = type; }

public Integer getHp() { return hp; }
public void setHp(Integer hp) { this.hp = hp; }

public String getRarity() { return rarity; }
public void setRarity(String rarity) { this.rarity = rarity; }

public String getSetName() { return setName; }
public void setSetName(String setName) { this.setName = setName; }

public Double getEstimatedValue() { return estimatedValue; }
public void setEstimatedValue(Double estimatedValue) { this.estimatedValue = estimatedValue; }
}