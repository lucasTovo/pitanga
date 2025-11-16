package br.edu.ifrs.pitanga.core.app.http;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifrs.pitanga.core.app.http.dto.ChallengePageableFilter;
import br.edu.ifrs.pitanga.core.app.http.dto.ChallengeRequest;
import br.edu.ifrs.pitanga.core.app.http.dto.ChallengeResponse;
import br.edu.ifrs.pitanga.core.domain.pbl.Challenge;
import br.edu.ifrs.pitanga.core.domain.pbl.services.ChallengesService;
import br.edu.ifrs.pitanga.core.domain.pbl.services.commands.SaveChallengeCommand;
import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@AllArgsConstructor
@RequestMapping("/challenges")
public class ChallengesController {
    private final ChallengesService challengesService;

    @GetMapping()
    public Page<ChallengeResponse> list(Authentication user, ChallengePageableFilter pageable) {
        return challengesService.findAndFilter(user.getName(), pageable);
    }

    @GetMapping("/{challengeId}")
    public ResponseEntity<Challenge> getById(@PathVariable UUID challengeId) {
        return challengesService.findById(challengeId)
            .map(ResponseEntity.ok()::body)
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{challengeId}")
    public ResponseEntity<Challenge> updateById(Authentication user, 
        @PathVariable UUID challengeId,
        @RequestBody ChallengeRequest request) {
        return challengesService.update(challengeId, request, user.getName())
            .map(ResponseEntity.ok()::body)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{challengeId}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID challengeId) {
        if (challengesService.deleteById(challengeId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping()
    public Challenge createChallenge(Authentication user, @RequestBody ChallengeRequest request) {
        SaveChallengeCommand saveCommand = new SaveChallengeCommand(user, request);
        return challengesService.handle(saveCommand);
    }
}
