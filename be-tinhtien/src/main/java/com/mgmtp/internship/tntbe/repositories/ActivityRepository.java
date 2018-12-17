package com.mgmtp.internship.tntbe.repositories;

import com.mgmtp.internship.tntbe.entities.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    Activity findByUrl(String url);

    List<Activity> getAllByOrderByIdDesc();
}
