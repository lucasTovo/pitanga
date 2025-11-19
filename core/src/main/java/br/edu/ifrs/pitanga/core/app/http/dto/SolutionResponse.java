package br.edu.ifrs.pitanga.core.app.http.dto;

import java.util.List;

import br.edu.ifrs.pitanga.core.app.http.dto.vo.ValidationResult;
import br.edu.ifrs.pitanga.core.app.http.dto.vo.ValidationResultStatus;
import br.edu.ifrs.pitanga.core.domain.pbl.vo.SolutionId;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder @Data
@AllArgsConstructor
public class SolutionResponse {
    private SolutionId solutionId;
    private String code;
    private List<ValidationResult> validationResults;
    private Boolean isUpToDate;

    public Boolean getPassValidations() {
        Boolean pass = validationResults.size() != 0;
        for (ValidationResult validationResult : validationResults) {
            if(validationResult.status() == ValidationResultStatus.FAIL) {
                pass = false;
            }
        }
        return pass;
    }
}
