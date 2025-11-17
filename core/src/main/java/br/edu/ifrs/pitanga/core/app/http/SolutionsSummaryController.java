package br.edu.ifrs.pitanga.core.app.http;

import java.util.Map;
import java.util.Objects;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifrs.pitanga.core.app.http.dto.SolutionsCompletionRequest;
import br.edu.ifrs.pitanga.core.app.http.dto.StudentChallengesSummaryResponse;
import br.edu.ifrs.pitanga.core.domain.pbl.services.SolutionsSummaryService;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/solutions")
public class SolutionsSummaryController {

    private final SolutionsSummaryService solutionsSummaryService;

    @PostMapping("/completion-summary")
    public Map<String, StudentChallengesSummaryResponse> summarize(
        @RequestBody SolutionsCompletionRequest request
    ) {
        return solutionsSummaryService.summarize(
            Objects.requireNonNullElse(request.studentIds(), java.util.List.of()),
            Objects.requireNonNullElse(request.challengeIds(), java.util.List.of())
        );
    }
}

