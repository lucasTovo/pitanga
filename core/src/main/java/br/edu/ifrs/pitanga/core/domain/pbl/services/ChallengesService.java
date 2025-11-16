package br.edu.ifrs.pitanga.core.domain.pbl.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import br.edu.ifrs.pitanga.core.domain.pbl.Challenge;
import br.edu.ifrs.pitanga.core.domain.pbl.Validation;
import br.edu.ifrs.pitanga.core.domain.pbl.services.commands.SaveChallengeCommand;
import br.edu.ifrs.pitanga.core.domain.pbl.vo.SolutionStatus;
import br.edu.ifrs.pitanga.core.domain.pbl.vo.ChallengeLevel;
import br.edu.ifrs.pitanga.core.app.http.dto.ChallengePageableFilter;
import br.edu.ifrs.pitanga.core.app.http.dto.ChallengeResponse;
import br.edu.ifrs.pitanga.core.app.http.dto.ChallengeRequest;
import br.edu.ifrs.pitanga.core.domain.repositories.ChallengesRepository;
import br.edu.ifrs.pitanga.core.domain.repositories.SolutionsRepository;
import br.edu.ifrs.pitanga.core.domain.repositories.ValidationsRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ChallengesService {
    private final ChallengesRepository challengesRepository;
    private final ValidationsRepository validationsRepository;
    private final SolutionsRepository solutionsRepository;

    public Page<ChallengeResponse> findAndFilter(String userId, ChallengePageableFilter filter) {
        Pageable pageable = filter.getPage();

        // Combina o spec do filtro com o filtro pelo creatorId
        Specification<Challenge> spec = Specification
                .where(filter.getSpec())
                .and((root, query, cb) -> cb.equal(root.get("creatorId"), userId));

        Page<Challenge> page = challengesRepository.findAll(spec, pageable);
        long total = page.getTotalElements();

        List<ChallengeResponse> content = page.getContent().stream().map(challenge -> {
            Integer solutions = solutionsRepository.countSolutionsForChallenge(userId, challenge.getId());
            Boolean check = solutionsRepository.solutionPassValidations(userId, challenge.getId());

            return ChallengeResponse.builder()
                .id(challenge.getId())
                .title(challenge.getTitle())
                .description(challenge.getDescription())
                .level(challenge.getLevel())
                .status(SolutionStatus.getStatus(solutions, check))
                .build();
        }).toList();

        return new PageImpl<>(content, pageable, total);
    }

    public Optional<Challenge> findById(UUID id) {
        return challengesRepository.findById(id);
    }

    public Challenge handle(SaveChallengeCommand command) {
        Challenge challenge = challengesRepository.save(command.toEntity());
        List<Validation> validations = command.request()
            .transformValidations(challenge.getId())
            .stream().map(validationsRepository::save)
            .collect(Collectors.toList());
        challenge.setValidations(validations);
        return challenge;
    }

    public Optional<Challenge> update(UUID id, ChallengeRequest request, String userId) {
        return challengesRepository.findById(id).map(existingChallenge -> {
            // Verifica se o usuário é o criador do challenge
            if (!existingChallenge.getCreatorId().equals(userId)) {
                return null;
            }

            // Atualiza os campos do challenge (partial update - apenas campos fornecidos)
            Challenge updatedChallenge = Challenge.builder()
                .id(existingChallenge.getId())
                .title(request.title() != null ? request.title() : existingChallenge.getTitle())
                .description(request.description() != null ? request.description() : existingChallenge.getDescription())
                .baseCode(request.baseCode() != null ? request.baseCode() : existingChallenge.getBaseCode())
                .level(request.level() != null ? ChallengeLevel.valueOf(request.level()) : existingChallenge.getLevel())
                .creatorId(existingChallenge.getCreatorId())
                .build();

            // Atualiza validações se fornecidas
            if (request.validations() != null && !request.validations().isEmpty()) {
                // Remove validações antigas
                if (existingChallenge.getValidations() != null) {
                    validationsRepository.deleteAll(existingChallenge.getValidations());
                }
                // Cria novas validações
                List<Validation> newValidations = request.transformValidations(updatedChallenge.getId())
                    .stream()
                    .map(validationsRepository::save)
                    .collect(Collectors.toList());
                updatedChallenge.setValidations(newValidations);
            } else {
                // Mantém as validações existentes se não foram fornecidas
                updatedChallenge.setValidations(existingChallenge.getValidations());
            }

            return challengesRepository.save(updatedChallenge);
        });
    }

    public boolean deleteById(UUID id) {
        if (challengesRepository.existsById(id)) {
            challengesRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
