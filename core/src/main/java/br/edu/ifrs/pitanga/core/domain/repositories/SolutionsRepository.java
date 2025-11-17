package br.edu.ifrs.pitanga.core.domain.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.edu.ifrs.pitanga.core.domain.pbl.Solution;
import br.edu.ifrs.pitanga.core.domain.pbl.vo.SolutionId;
import br.edu.ifrs.pitanga.core.domain.repositories.projections.CompletedChallengeProjection;

@Repository
public interface SolutionsRepository extends JpaRepository<Solution, SolutionId> {
    @Query("FROM solutions s WHERE s.id.submitterId = :submitter AND s.id.challengeId = :challengeId ORDER BY s.id.version DESC LIMIT 1")
    Solution findByLastVersion(String submitter, UUID challengeId);

    @Query("select count(s.id) from solutions s where s.id.submitterId = :submitter AND s.id.challengeId = :challenge")
    Integer countSolutionsForChallenge(String submitter, UUID challenge);

    @Query("select count(s.id) > 0 from solutions s where s.id.submitterId = :submitter AND s.id.challengeId = :challenge and s.passAllValidations = true")
    Boolean solutionPassValidations(String submitter, UUID challenge);

    @Query("""
        select distinct s.id.submitterId as studentId,
                s.id.challengeId as challengeId
        from solutions s
        where s.passAllValidations = true
            and s.id.submitterId in :studentIds
            and s.id.challengeId in :challengeIds
    """)
    List<CompletedChallengeProjection> findCompletedChallenges(
        List<String> studentIds,
        List<UUID> challengeIds
    );
}
