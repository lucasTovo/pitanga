package br.edu.ifrs.pitanga.core.domain.pbl.services;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import br.edu.ifrs.pitanga.core.app.http.dto.StudentChallengesSummaryResponse;
import br.edu.ifrs.pitanga.core.domain.repositories.SolutionsRepository;
import br.edu.ifrs.pitanga.core.domain.repositories.projections.CompletedChallengeProjection;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SolutionsSummaryService {

    private final SolutionsRepository solutionsRepository;

    public Map<String, StudentChallengesSummaryResponse> summarize(
        List<String> studentIds,
        List<UUID> challengeIds
    ) {
        if (studentIds == null || studentIds.isEmpty()) {
            return Map.of();
        }

        Map<String, List<UUID>> progress = studentIds.stream()
            .collect(Collectors.toMap(
                id -> id,
                id -> new ArrayList<>(),
                (left, right) -> left,
                LinkedHashMap::new
            ));

        List<UUID> targetChallenges = challengeIds == null ? List.of() : challengeIds;

        if (!targetChallenges.isEmpty()) {
            List<CompletedChallengeProjection> completed = solutionsRepository
                .findCompletedChallenges(studentIds, targetChallenges);

            for (CompletedChallengeProjection projection : completed) {
                progress.computeIfAbsent(projection.getStudentId(), key -> new ArrayList<>());
                List<UUID> studentChallenges = progress.get(projection.getStudentId());
                studentChallenges.add(projection.getChallengeId());
            }
        }

        return progress.entrySet().stream()
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                entry -> new StudentChallengesSummaryResponse(
                    entry.getValue().size(),
                    entry.getValue()
                ),
                (left, right) -> left,
                LinkedHashMap::new
            ));
    }
}

