package com.example.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.Model.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
}
