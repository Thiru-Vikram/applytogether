package in.thiruvikram.applytogether.repository;

import in.thiruvikram.applytogether.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    // Search users by username or fullName
    List<User> findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(
            String username, String fullName);

    // Admin queries
    List<User> findByRole(String role);

    List<User> findByPassingYear(String passingYear);

    List<User> findByRoleAndPassingYear(String role, String passingYear);

    long countByCreatedAtAfter(LocalDateTime date);

    @Query("SELECT u.passingYear FROM User u WHERE u.passingYear IS NOT NULL GROUP BY u.passingYear ORDER BY COUNT(u) DESC")
    List<String> findMostActiveBatch();
}
