package com.fatec.renegados.scrum.repository;

import com.fatec.renegados.scrum.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
}
