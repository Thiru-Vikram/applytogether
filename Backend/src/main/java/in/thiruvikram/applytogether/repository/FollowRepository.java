package in.thiruvikram.applytogether.repository;

import in.thiruvikram.applytogether.entity.Follow;
import in.thiruvikram.applytogether.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerAndFollowing(User follower, User following);

    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    List<Follow> findByFollower(User follower); // Whome I am following

    List<Follow> findByFollowing(User following); // Who follows me

    long countByFollower(User follower); // My Following count

    long countByFollowing(User following); // My Followers count
}
