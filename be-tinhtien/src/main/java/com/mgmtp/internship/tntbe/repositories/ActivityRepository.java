package com.mgmtp.internship.tntbe.repositories;

import com.mgmtp.internship.tntbe.entities.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    Activity findByUrl(String url);
}
