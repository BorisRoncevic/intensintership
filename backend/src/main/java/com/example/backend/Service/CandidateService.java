package com.example.backend.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.backend.Model.Candidate;
import com.example.backend.Model.CreateCandidateDto;
import com.example.backend.Model.Skills;
import com.example.backend.Repository.CandidateRepository;
import com.example.backend.Repository.SkillsRepository;


@Service
public class CandidateService {

    private final CandidateRepository canRepo;
    private final SkillsRepository skillsRepo;


    public CandidateService(CandidateRepository canRepo,SkillsRepository skillsRepo) {
        this.canRepo = canRepo;
        this.skillsRepo = skillsRepo;
    }

    public Candidate findById(Long id) {
        return canRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    public Candidate save(Candidate can){
       return canRepo.save(can);
    }

    public Page<Candidate> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return canRepo.findAll(pageable);
    }

    public void delete(Long id ) {
        canRepo.deleteById(id);
    }

    public Candidate update(Long id, Candidate updated) {
        Candidate existing = canRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    
        existing.setFullName(updated.getFullName());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setContactNumber(updated.getContactNumber());
        existing.setEmail(updated.getEmail());
        existing.setSkills(updated.getSkills());
    
        return canRepo.save(existing);
    }

    public List<Candidate> searchByName(String name) {
        if (name == null || name.isBlank()) {
            return canRepo.findAll();
        }
        return canRepo.findByFullNameContainingIgnoreCase(name);
    }

    public List<Candidate> searchBySkill(String skillName) {
        if (skillName == null || skillName.isBlank()) {
            return canRepo.findAll();
        }
        return canRepo.findBySkillName(skillName);
    }

    public Candidate create(CreateCandidateDto dto) {

        Candidate candidate = new Candidate();
        candidate.setFullName(dto.getFullName()); 
        candidate.setEmail(dto.getEmail());
        candidate.setContactNumber(dto.getContactNumber());
        candidate.setDateOfBirth(dto.getDateOfBirth());
    
        List<Skills> skills = new ArrayList<>();
    
        if (dto.getSkillIds() != null) {
            for (Long skillId : dto.getSkillIds()) {
                Skills skill = skillsRepo.findById(skillId) .orElseThrow(() -> new RuntimeException("Skill not found: " + skillId));
                skills.add(skill);
            }
        }
        candidate.setSkills(skills);
        return canRepo.save(candidate);
    }

    public Page<Candidate> search(String name, List<Long> skills, int page, int size) {
        List<Candidate> candidates = canRepo.findAll();
    
        if (name != null && !name.trim().isEmpty()) {
            String lowerName = name.trim().toLowerCase();
    
            candidates = candidates.stream()
                    .filter(c -> c.getFullName() != null &&
                            c.getFullName().toLowerCase().contains(lowerName))
                    .toList();
        }
    
        if (skills != null && !skills.isEmpty()) {
            candidates = candidates.stream().filter(c -> c.getSkills() != null &&c.getSkills().stream()
            .anyMatch(skill -> skill.getId() != null && skills.contains(skill.getId()))).toList();
        }
    
        int start = page * size;
        int end = Math.min(start + size, candidates.size());
    
        List<Candidate> pageContent = start >= candidates.size() ? List.of() : candidates.subList(start, end);
    
        return new PageImpl<>(pageContent, PageRequest.of(page, size), candidates.size());
    }
}
