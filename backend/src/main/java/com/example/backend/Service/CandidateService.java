package com.example.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Model.Candidate;
import com.example.backend.Repository.CandidateRepository;


@Service
public class CandidateService {

    private final CandidateRepository canRepo;

    public CandidateService(CandidateRepository canRepo) {
        this.canRepo = canRepo;
    }

    public Candidate findById(Long id) {
        return canRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    public void save(Candidate can){
        canRepo.save(can);
    }

    public List<Candidate> findAll() {
        return canRepo.findAll();
    }

    public void delete(Long id ) {
        canRepo.deleteById(id);
    }

    public Candidate update(Long id, Candidate updated) {
        Candidate existing = canRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    
        existing.setFullname(updated.getFullName());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setContactNumber(updated.getContactNumber());
        existing.setEmail(updated.getEmail());
        existing.setSkills(updated.getSkills());
    
        return canRepo.save(existing);
    }


}
