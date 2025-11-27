package br.edu.ifrs.pitanga.core.app.http.dto;

import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.RequestParam;

import br.edu.ifrs.pitanga.core.domain.pbl.Challenge;
import br.edu.ifrs.pitanga.core.domain.pbl.vo.ChallengeLevel;
import br.edu.ifrs.pitanga.core.domain.repositories.specifications.ChallengeSpecification;

public record ChallengePageableFilter(
    @RequestParam(required = false) Optional<Integer> page,
    @RequestParam(required = false) Optional<Integer> size,
    @RequestParam(required = false) ChallengeLevel level,
    @RequestParam(required = false) Optional<String> sort
) {
    public Specification<Challenge> getSpec() {
        return new ChallengeSpecification(level);
    }

    public Pageable getPage() {
        Integer pageSize = size.orElse(25);
        if(pageSize > 25) {
            pageSize = 25;
        }

        Sort finalSort = sort
            .map(s -> {
                String[] parts = s.split(",");

                String field = parts[0]; // Ex: createdAt
                Sort.Direction direction = parts.length > 1 &&
                        parts[1].equalsIgnoreCase("desc")
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;

                return Sort.by(direction, field);
            })
            .orElse(Sort.by("createdAt").descending());

        return PageRequest.of(
            page.orElse(0),
            pageSize,
            finalSort
        );
    }
}
