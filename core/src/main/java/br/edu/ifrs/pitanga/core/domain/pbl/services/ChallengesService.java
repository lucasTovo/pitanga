package br.edu.ifrs.pitanga.core.domain.pbl.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Objects;

import org.springframework.dao.EmptyResultDataAccessException;
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

    @SuppressWarnings("null")
    public Page<ChallengeResponse> findAndFilter(String userId, ChallengePageableFilter filter) {
        ChallengePageableFilter safeFilter = Objects.requireNonNull(filter, "filter must not be null");
        Pageable pageable = safeFilter.getPage();

        // Build spec: public challenges OR private challenges of the creator
        Specification<Challenge> spec = Specification
                .where(safeFilter.getSpec())
                .and((root, query, cb) -> {
                    if (userId != null) {
                        // Authenticated: show public challenges OR private challenges of the creator
                        return cb.or(
                            cb.equal(root.get("isPublic"), true),
                            cb.and(
                                cb.equal(root.get("isPublic"), false),
                                cb.equal(root.get("creatorId"), userId)
                            )
                        );
                    } else {
                        // Not authenticated: only public challenges
                        return cb.equal(root.get("isPublic"), true);
                    }
                });

        Page<Challenge> page = challengesRepository.findAll(spec, pageable);
        long total = page.getTotalElements();

        List<Challenge> challenges = Objects.requireNonNull(page.getContent(), "page content must not be null");
        List<ChallengeResponse> content = challenges.stream()
            .map(challenge -> buildChallengeResponse(userId, challenge))
            .toList();

        return new PageImpl<>(content, pageable, total);
    }

    @SuppressWarnings("null")
    private ChallengeResponse buildChallengeResponse(String userId, Challenge challenge) {
        Challenge safeChallenge = Objects.requireNonNull(challenge, "Challenge must not be null");
        UUID challengeId = Objects.requireNonNull(safeChallenge.getId(), "Challenge id must not be null");
        Integer solutions = solutionsRepository.countSolutionsForChallenge(userId, challengeId);
        Boolean check = solutionsRepository.solutionPassValidations(userId, challengeId);

        return ChallengeResponse.builder()
            .id(challengeId)
            .title(safeChallenge.getTitle())
            .description(safeChallenge.getDescription())
            .level(safeChallenge.getLevel())
            .status(SolutionStatus.getStatus(solutions, check))
            .build();
    }

    public Optional<Challenge> findById(UUID id) {
        UUID safeId = Objects.requireNonNull(id, "challenge id must not be null");
        return challengesRepository.findById(safeId);
    }

    public Optional<Challenge> findById(UUID id, String userId) {
        UUID safeId = Objects.requireNonNull(id, "challenge id must not be null");
        return challengesRepository.findById(safeId)
            .filter(challenge -> {
                // Public challenges are readable by anyone
                if (Boolean.TRUE.equals(challenge.getIsPublic())) {
                    return true;
                }
                // Private challenges are only readable by the creator
                return userId != null && Objects.equals(challenge.getCreatorId(), userId);
            });
    }

    @SuppressWarnings("null")
    public Challenge handle(SaveChallengeCommand command) {
        SaveChallengeCommand safeCommand = Objects.requireNonNull(command, "command must not be null");
        Challenge challenge = challengesRepository.save(safeCommand.toEntity());
        List<Validation> validations = command.request()
            .transformValidations(challenge.getId())
            .stream().map(validationsRepository::save)
            .collect(Collectors.toList());
        challenge.setValidations(validations);
        return challenge;
    }

    @SuppressWarnings("null")
    public Optional<Challenge> update(UUID id, ChallengeRequest request, String userId) {
        UUID safeId = Objects.requireNonNull(id, "challenge id must not be null");
        ChallengeRequest safeRequest = Objects.requireNonNull(request, "request must not be null");
        Objects.requireNonNull(userId, "userId must not be null");

        return challengesRepository.findById(safeId)
            .filter(existingChallenge -> Objects.equals(existingChallenge.getCreatorId(), userId))
            .map(existingChallenge -> {
                applyScalarUpdates(existingChallenge, safeRequest);
                applyValidations(existingChallenge, safeRequest);
                existingChallenge.touch();
                return challengesRepository.save(existingChallenge);
            });
    }

    public boolean deleteById(UUID id) {
        UUID safeId = Objects.requireNonNull(id, "challenge id must not be null");
        try {
            challengesRepository.deleteById(safeId);
            return true;
        } catch (EmptyResultDataAccessException ex) {
            return false;
        }
    }

    private void applyScalarUpdates(Challenge challenge, ChallengeRequest request) {
        if (request.title() != null) {
            challenge.setTitle(request.title());
        }
        if (request.description() != null) {
            challenge.setDescription(request.description());
        }
        if (request.baseCode() != null) {
            challenge.setBaseCode(request.baseCode());
        }
        if (request.level() != null) {
            challenge.setLevel(ChallengeLevel.valueOf(request.level()));
        }
        if (request.isPublic() != null) {
            challenge.setIsPublic(request.isPublic());
        }
    }

    @SuppressWarnings("null")
    private void applyValidations(Challenge challenge, ChallengeRequest request) {
        if (request.validations() == null || request.validations().isEmpty()) {
            return;
        }

        List<Validation> existingValidations = challenge.getValidations();
        if (existingValidations != null && !existingValidations.isEmpty()) {
            validationsRepository.deleteAll(existingValidations);
        }

        List<Validation> newValidations = request.transformValidations(challenge.getId()).stream()
            .map(validationsRepository::save)
            .collect(Collectors.toList());
        challenge.setValidations(newValidations);
    }
}
