package br.edu.ifrs.pitanga.core.domain.repositories.projections;

import java.util.UUID;

public interface CompletedChallengeProjection {
    String getStudentId();
    UUID getChallengeId();
}

