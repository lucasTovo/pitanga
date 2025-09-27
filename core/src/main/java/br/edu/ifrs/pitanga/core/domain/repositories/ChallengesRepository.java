package br.edu.ifrs.pitanga.core.domain.repositories;

import java.util.UUID;

import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import br.edu.ifrs.pitanga.core.domain.pbl.Challenge;

@Repository
public interface ChallengesRepository extends
    PagingAndSortingRepository<Challenge, UUID>,
    CrudRepository<Challenge, UUID>,
    JpaSpecificationExecutor<Challenge> {

    Page<Challenge> findByCreatorId(String creatorId, Pageable pageable);
}
