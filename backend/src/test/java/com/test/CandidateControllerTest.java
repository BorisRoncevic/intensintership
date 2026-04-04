package com.test;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.example.backend.BackendApplication;
import com.example.backend.Controller.CandidateController;
import com.example.backend.Model.Candidate;
import com.example.backend.Model.CreateCandidateDto;
import com.example.backend.Model.Skills;
import com.example.backend.Service.CandidateService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@WebMvcTest(controllers = CandidateController.class)
@ContextConfiguration(classes = BackendApplication.class)
class CandidateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CandidateService candidateService;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @Test
    void getAll_shouldReturnPage() throws Exception {
        Candidate candidate = new Candidate();
        candidate.setFullName("Boris Roncevic");
        candidate.setEmail("boris@gmail.com");

        given(candidateService.findAll(0, 10))
                .willReturn(new PageImpl<>(List.of(candidate)));

        mockMvc.perform(get("/api/candidates")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].fullName").value("Boris Roncevic"));
    }

    @Test
    void getById_shouldReturnCandidate() throws Exception {
        Candidate candidate = new Candidate();
        candidate.setFullName("Boris Roncevic");
        candidate.setEmail("boris@gmail.com");

        given(candidateService.findById(1L)).willReturn(candidate);

        mockMvc.perform(get("/api/candidates/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Boris Roncevic"));
    }

    @Test
    void create_shouldReturnCreatedCandidate() throws Exception {
        Skills skill = new Skills();
        skill.setId(1L);
        skill.setName("Java");

        Candidate created = new Candidate();
        created.setFullName("Petar Petrovic");
        created.setEmail("petar@gmail.com");
        created.setContactNumber("123123");
        created.setDateOfBirth(LocalDate.of(2000, 1, 1));
        created.setSkills(List.of(skill));

        CreateCandidateDto dto = new CreateCandidateDto();
        dto.setFullName("Petar Petrovic");
        dto.setEmail("petar@gmail.com");
        dto.setContactNumber("123123");
        dto.setDateOfBirth(LocalDate.of(2000, 1, 1));
        dto.setSkillIds(List.of(1L));

        given(candidateService.create(any(CreateCandidateDto.class))).willReturn(created);

        mockMvc.perform(post("/api/candidates")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.fullName").value("Petar Petrovic"));
    }

    @Test
    void update_shouldReturnUpdatedCandidate() throws Exception {
        Candidate updated = new Candidate();
        updated.setFullName("Novo Ime");
        updated.setEmail("novo@gmail.com");
        updated.setContactNumber("777");

        given(candidateService.update(eq(1L), any(Candidate.class))).willReturn(updated);

        mockMvc.perform(put("/api/candidates/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Novo Ime"))
                .andExpect(jsonPath("$.email").value("novo@gmail.com"));
    }

    @Test
    void delete_shouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/candidates/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void searchByName_shouldReturnMatchingCandidates() throws Exception {
        Candidate candidate = new Candidate();
        candidate.setFullName("Boris Roncevic");

        given(candidateService.searchByName("bor")).willReturn(List.of(candidate));

        mockMvc.perform(get("/api/candidates/search/name")
                .param("query", "bor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fullName").value("Boris Roncevic"));
    }
}
