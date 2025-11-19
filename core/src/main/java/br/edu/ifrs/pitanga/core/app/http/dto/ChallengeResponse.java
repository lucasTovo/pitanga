package br.edu.ifrs.pitanga.core.app.http.dto;

import java.util.UUID;

import br.edu.ifrs.pitanga.core.domain.pbl.vo.ChallengeLevel;
import br.edu.ifrs.pitanga.core.domain.pbl.vo.SolutionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ChallengeResponse {
    private UUID id;
    private String title;
    private String description;
    private ChallengeLevel level;
    private SolutionStatus status;
    private boolean edited;
}
