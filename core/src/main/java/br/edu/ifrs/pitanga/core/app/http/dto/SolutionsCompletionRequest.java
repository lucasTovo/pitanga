package br.edu.ifrs.pitanga.core.app.http.dto;

import java.util.List;
import java.util.UUID;

public record SolutionsCompletionRequest(
    List<String> studentIds,
    List<UUID> challengeIds
) {}

