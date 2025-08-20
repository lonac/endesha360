package com.endesha360.questions_service.service;

import com.endesha360.questions_service.model.Question;
import com.endesha360.questions_service.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final Random random = new Random();

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Optional<Object> getQuestionById(Long id) {
        return Optional.of(questionRepository.findById(id));
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public List<Question> getQuestionsByCategory(String category) {
        return questionRepository.findByCategory(category);
    }

    public List<Question> getRandomQuestions(int count) {
        List<Question> all = questionRepository.findAll();
        Collections.shuffle(all, random);
        return all.subList(0, Math.min(count, all.size()));
    }
}
