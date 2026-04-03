package com.example.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.Model.Skills;

public interface SkillsRepository extends JpaRepository<Skills, Long>{
    
}
