package com.example.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Model.Skills;
import com.example.backend.Repository.SkillsRepository;


@Service
public class SkillsService {

    private final SkillsRepository skillRepo;

    public SkillsService(SkillsRepository skillRepo) {
        this.skillRepo = skillRepo;
    }

    public Skills findById(Long id) {
        return skillRepo.findById(id).orElseThrow(() -> new RuntimeException("Skill not found"));
    }

    public List<Skills> findAll() {
        return skillRepo.findAll();
    }

    public Skills save(Skills skill) {
        return skillRepo.save(skill);
    }

    public void delete(Long id) {
        Skills skill = findById(id);
        if (skill.getCandidates() != null) { skill.getCandidates().forEach(c -> c.getSkills().remove(skill));}
        skillRepo.delete(skill);
    }
}