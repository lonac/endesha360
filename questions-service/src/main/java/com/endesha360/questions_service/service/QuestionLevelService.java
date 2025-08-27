package com.endesha360.questions_service.service;

import com.endesha360.questions_service.dto.QuestionLevelDTO;
import com.endesha360.questions_service.model.QuestionLevel;
import com.endesha360.questions_service.repository.QuestionLevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionLevelService {
    @Autowired
    private QuestionLevelRepository questionLevelRepository;

    public List<QuestionLevelDTO> getAllLevels() {
        return questionLevelRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<QuestionLevelDTO> getLevelById(Long id) {
        return questionLevelRepository.findById(id).map(this::toDTO);
    }

    public QuestionLevelDTO createLevel(QuestionLevelDTO dto) {
        QuestionLevel level = new QuestionLevel();
        level.setName(dto.getName());
        QuestionLevel saved = questionLevelRepository.save(level);
        return toDTO(saved);
    }

    private QuestionLevelDTO toDTO(QuestionLevel level) {
        QuestionLevelDTO dto = new QuestionLevelDTO();
        dto.setId(level.getId());
        dto.setName(level.getName());
        return dto;
    }
}
