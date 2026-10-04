package com.pokevault.pokevault.repository;

import com.pokevault.pokevault.entity.PokemonCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PokemonCardRepository extends JpaRepository<PokemonCard, Long> {
}