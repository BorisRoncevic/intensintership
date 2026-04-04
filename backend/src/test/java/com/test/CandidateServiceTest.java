package com.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;

import com.example.backend.Model.Candidate;
import com.example.backend.Model.CreateCandidateDto;
import com.example.backend.Model.Skills;
import com.example.backend.Repository.CandidateRepository;
import com.example.backend.Repository.SkillsRepository;
import com.example.backend.Service.CandidateService;

@ExtendWith(MockitoExtension.class)
class CandidateServiceTest {

    @Mock
    private CandidateRepository canRepo;

    @Mock
    private SkillsRepository skillsRepo;

    @InjectMocks
    private CandidateService candidateService;

    private Candidate candidate;
    private Skills javaSkill;

    @BeforeEach
    void setUp() {
        javaSkill = new Skills();
        javaSkill.setId(1L);
        javaSkill.setName("Java");

        candidate = new Candidate();
        candidate.setFullName("Boris Roncevic");
        candidate.setEmail("boris@gmail.com");
        candidate.setContactNumber("123456");
        candidate.setDateOfBirth(LocalDate.of(2000, 1, 1));
        candidate.setSkills(List.of(javaSkill));
    }

    @Test
    void findById_shouldReturnCandidate() {
        when(canRepo.findById(1L)).thenReturn(Optional.of(candidate));

        Candidate result = candidateService.findById(1L);

        assertNotNull(result);
        assertEquals("Boris Roncevic", result.getFullName());
        verify(canRepo).findById(1L);
    }

    @Test
    void findById_shouldThrowWhenNotFound() {
        when(canRepo.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> candidateService.findById(1L));

        assertTrue(ex.getMessage().contains("Not found"));
    }

    @Test
    void searchByName_shouldReturnAllWhenNameBlank() {
        when(canRepo.findAll()).thenReturn(List.of(candidate));

        List<Candidate> result = candidateService.searchByName("");

        assertEquals(1, result.size());
        verify(canRepo).findAll();
    }

    @Test
    void searchByName_shouldSearchContainingIgnoreCase() {
        when(canRepo.findByFullNameContainingIgnoreCase("bor"))
                .thenReturn(List.of(candidate));

        List<Candidate> result = candidateService.searchByName("bor");

        assertEquals(1, result.size());
        assertEquals("Boris Roncevic", result.get(0).getFullName());
        verify(canRepo).findByFullNameContainingIgnoreCase("bor");
    }

    @Test
    void searchBySkill_shouldReturnAllWhenSkillBlank() {
        when(canRepo.findAll()).thenReturn(List.of(candidate));

        List<Candidate> result = candidateService.searchBySkill("");

        assertEquals(1, result.size());
        verify(canRepo).findAll();
    }

    @Test
    void searchBySkill_shouldReturnMatchingCandidates() {
        when(canRepo.findBySkillName("Java")).thenReturn(List.of(candidate));

        List<Candidate> result = candidateService.searchBySkill("Java");

        assertEquals(1, result.size());
        verify(canRepo).findBySkillName("Java");
    }

    @Test
    void create_shouldCreateCandidateWithSkills() {
        CreateCandidateDto dto = new CreateCandidateDto();
        dto.setFullName("Petar Petrovic");
        dto.setEmail("petar@gmail.com");
        dto.setContactNumber("999999");
        dto.setDateOfBirth(LocalDate.of(1999, 5, 10));
        dto.setSkillIds(List.of(1L));

        when(skillsRepo.findById(1L)).thenReturn(Optional.of(javaSkill));
        when(canRepo.save(any(Candidate.class))).thenAnswer(inv -> inv.getArgument(0));

        Candidate result = candidateService.create(dto);

        assertEquals("Petar Petrovic", result.getFullName());
        assertEquals(1, result.getSkills().size());
        assertEquals("Java", result.getSkills().get(0).getName());
        verify(skillsRepo).findById(1L);
        verify(canRepo).save(any(Candidate.class));
    }

    @Test
    void create_shouldThrowWhenSkillNotFound() {
        CreateCandidateDto dto = new CreateCandidateDto();
        dto.setFullName("Petar");
        dto.setSkillIds(List.of(99L));

        when(skillsRepo.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> candidateService.create(dto));

        assertTrue(ex.getMessage().contains("Skill not found"));
    }

    @Test
    void update_shouldUpdateExistingCandidate() {
        Candidate updated = new Candidate();
        updated.setFullName("Novo Ime");
        updated.setEmail("novo@gmail.com");
        updated.setContactNumber("777");
        updated.setDateOfBirth(LocalDate.of(2001, 2, 2));
        updated.setSkills(List.of(javaSkill));

        when(canRepo.findById(1L)).thenReturn(Optional.of(candidate));
        when(canRepo.save(any(Candidate.class))).thenAnswer(inv -> inv.getArgument(0));

        Candidate result = candidateService.update(1L, updated);

        assertEquals("Novo Ime", result.getFullName());
        assertEquals("novo@gmail.com", result.getEmail());
        verify(canRepo).findById(1L);
        verify(canRepo).save(candidate);
    }

    @Test
    void delete_shouldCallDeleteById() {
        candidateService.delete(1L);

        verify(canRepo).deleteById(1L);
    }

    @Test
    void search_shouldFilterByNameAndSkill() {
        Skills reactSkill = new Skills();
        reactSkill.setId(2L);
        reactSkill.setName("React");

        Candidate c1 = new Candidate();
        c1.setFullName("Boris Roncevic");
        c1.setSkills(List.of(javaSkill));

        Candidate c2 = new Candidate();
        c2.setFullName("Petar Markovic");
        c2.setSkills(List.of(reactSkill));

        when(canRepo.findAll()).thenReturn(List.of(c1, c2));

        Page<Candidate> result = candidateService.search("boris", List.of(1L), 0, 10);

        assertEquals(1, result.getTotalElements());
        assertEquals("Boris Roncevic", result.getContent().get(0).getFullName());
    }
}
