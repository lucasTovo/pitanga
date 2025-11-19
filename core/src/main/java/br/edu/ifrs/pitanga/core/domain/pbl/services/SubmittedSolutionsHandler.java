package br.edu.ifrs.pitanga.core.domain.pbl.services;

import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.edu.ifrs.pitanga.core.app.http.dto.SolutionResponse;
import br.edu.ifrs.pitanga.core.app.http.dto.vo.ValidationResult;
import br.edu.ifrs.pitanga.core.app.http.errors.ChallengeNotFoundException;
import br.edu.ifrs.pitanga.core.domain.pbl.Challenge;
import br.edu.ifrs.pitanga.core.domain.pbl.Solution;
import br.edu.ifrs.pitanga.core.infra.MD5HashCalculator;
import br.edu.ifrs.pitanga.core.infra.runners.CommandRunner;
import lombok.AllArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import br.edu.ifrs.pitanga.core.domain.repositories.ChallengesRepository;
import br.edu.ifrs.pitanga.core.domain.repositories.SolutionsRepository;
import br.edu.ifrs.pitanga.core.domain.pbl.services.commands.SaveSolutionCommand;

@Service
@AllArgsConstructor
public class SubmittedSolutionsHandler {
    private final CommandRunner runner;
    private final SolutionsRepository solutionsRepository;
    private final ChallengesRepository challengesRepository;
    private final MD5HashCalculator hashCalculator;

    public Mono<SolutionResponse> viewLast(String userId, UUID challengeId) {
        Solution solution = solutionsRepository.findByLastVersion(userId, challengeId);
        if(solution == null) {
            return Mono.empty();
        }

        Challenge challenge = solution.getChallenge();
        Boolean isUpToDate = calculateIsUpToDate(solution, challenge);

        SolutionResponse.SolutionResponseBuilder builder = SolutionResponse.builder()
            .solutionId(solution.getId())
            .code(solution.getCode())
            .isUpToDate(isUpToDate);

        return getResults(solution, builder);
    }

    private Mono<SolutionResponse> getResults(Solution solution, SolutionResponse.SolutionResponseBuilder builder) {
        Flux<ValidationResult> results = Flux.concat(
            solution.validations().map(input -> runner.execute(solution, input)
                    .map(out -> ValidationResult.fromString(input, out))
            ).toList()
        );

        return results.collectList().map(validations -> {
            SolutionResponse response = builder.validationResults(validations)
                .build();
            solution.setPassAllValidations(response.getPassValidations());
            solutionsRepository.save(solution);
            return response;
        });
    }

    public Mono<SolutionResponse> handle(SaveSolutionCommand submission) {
        UUID challengeId = submission.challengeId();
        Solution solution = solutionsRepository.findByLastVersion(
            submission.submitterId(),
            challengeId
        );

        Solution entity = submission.toEntity();
        entity.setHash(hashCalculator.calculate(entity.getCode()));
        entity.setVersion(solution);

        Challenge challenge = challengesRepository.findById(challengeId)
            .orElseThrow(() -> new ChallengeNotFoundException());

        entity.setChallenge(challenge);

        if(!entity.compareHash(solution)) {
            solution = solutionsRepository.save(entity);
        }

        Boolean isUpToDate = calculateIsUpToDate(entity, challenge);

        SolutionResponse.SolutionResponseBuilder builder = SolutionResponse.builder()
            .solutionId(entity.getId())
            .code(entity.getCode())
            .isUpToDate(isUpToDate);

        return getResults(entity, builder);
    }

    /**
     * Calcula se a solução está atualizada em relação ao desafio.
     * Uma solução é considerada atualizada se seu createdAt é posterior ou igual
     * ao updatedAt do desafio, considerando uma tolerância de 1 hora para diferenças
     * de timestamp devido a possíveis pequenas variações de sincronização.
     * 
     * @param solution A solução a ser verificada
     * @param challenge O desafio relacionado
     * @return true se a solução está atualizada, false caso contrário
     */
    private Boolean calculateIsUpToDate(Solution solution, Challenge challenge) {
        if(solution == null || challenge == null) {
            return false;
        }

        Date solutionCreatedAt = solution.getCreatedAt();
        Date challengeUpdatedAt = challenge.getUpdatedAt();

        if(solutionCreatedAt == null || challengeUpdatedAt == null) {
            return false;
        }

        // Tolerância de 1 hora (3600000 milissegundos) para diferenças de timestamp
        long toleranceMillis = 3600000L; // 1 hora em milissegundos
        long challengeUpdatedAtWithTolerance = challengeUpdatedAt.getTime() - toleranceMillis;
        Date challengeUpdatedAtAdjusted = new Date(challengeUpdatedAtWithTolerance);

        // A solução está atualizada se foi criada após o updatedAt do desafio (considerando a tolerância)
        return solutionCreatedAt.compareTo(challengeUpdatedAtAdjusted) >= 0;
    }
}
