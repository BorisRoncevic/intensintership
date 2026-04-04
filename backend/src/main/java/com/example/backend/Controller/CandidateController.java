package com.example.backend.Controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Model.Candidate;
import com.example.backend.Model.CreateCandidateDto;
import com.example.backend.Service.CandidateService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping
    public ResponseEntity<Page<Candidate>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return ResponseEntity.ok(candidateService.findAll(page, size));
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<Candidate>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) List<Long> skills,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return ResponseEntity.ok(candidateService.search(name, skills, page, size));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Candidate> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(candidateService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Candidate> create(@Valid@RequestBody CreateCandidateDto dto) {
        Candidate saved = candidateService.create(dto);
        return ResponseEntity.status(201).body(saved); 
    }
    @PutMapping("/{id}")
    public ResponseEntity<Candidate> update(@PathVariable Long id,@RequestBody Candidate updated) {
        try {
            return ResponseEntity.ok(candidateService.update(id, updated));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            candidateService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search/name")
    public ResponseEntity<List<Candidate>> searchByName(
            @RequestParam(name = "query", required = false, defaultValue = "") String name) {

        List<Candidate> results = candidateService.searchByName(name);
        return ResponseEntity.ok(results);
    }

 
   
}