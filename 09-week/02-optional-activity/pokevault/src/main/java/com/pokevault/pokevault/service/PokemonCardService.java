package com.pokevault.pokevault.service;

import com.pokevault.pokevault.entity.PokemonCard;
import com.pokevault.pokevault.exception.NotFoundException;
import com.pokevault.pokevault.repository.PokemonCardRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PokemonCardService {

    private final PokemonCardRepository repository;

    public PokemonCardService(PokemonCardRepository repository) {
        this.repository = repository;
    }

    public List<PokemonCard> findAll() {
        return repository.findAll();
    }

    public PokemonCard findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Card not found with id " + id));
    }

    public PokemonCard create(PokemonCard card) {
        card.setId(null);
        return repository.save(card);
    }

    public PokemonCard update(Long id, PokemonCard data) {
        PokemonCard existing = findById(id);
        existing.setName(data.getName());
        existing.setType(data.getType());
        existing.setHp(data.getHp());
        existing.setRarity(data.getRarity());
        existing.setSetName(data.getSetName());
        existing.setEstimatedValue(data.getEstimatedValue());
        return repository.save(existing);
    }

    public void delete(Long id) {
        PokemonCard existing = findById(id);
        repository.delete(existing);
    }
}