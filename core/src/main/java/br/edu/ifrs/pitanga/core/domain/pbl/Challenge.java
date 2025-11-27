package br.edu.ifrs.pitanga.core.domain.pbl;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import br.edu.ifrs.pitanga.core.domain.pbl.vo.ChallengeLevel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "challenges")
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String title;
    private String description;
    private String baseCode;

    @Enumerated(EnumType.STRING)
    private ChallengeLevel level;

    @OneToMany(mappedBy = "id.challengeId", fetch = FetchType.EAGER, cascade = { CascadeType.ALL })
    private List<Validation> validations;
    private String creatorId;

    @Builder.Default
    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = true;
    @Column(name = "origin_challenge_id")
    private UUID originChallengeId;

    @Column(name = "created_at", updatable = false, insertable = false)
    private Date createdAt;
    @Column(name = "updated_at")
    private Date updatedAt;

    public void setValidations(List<Validation> validations) {
        this.validations = validations;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setBaseCode(String baseCode) {
        this.baseCode = baseCode;
    }

    public void setLevel(ChallengeLevel level) {
        this.level = level;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public void setOriginChallengeId(UUID originChallengeId) {
        this.originChallengeId = originChallengeId;
    }

    @PrePersist
    public void prePersist() {
        Date now = new Date();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = new Date();
    }

    public void touch() {
        this.updatedAt = new Date();
    }
}
