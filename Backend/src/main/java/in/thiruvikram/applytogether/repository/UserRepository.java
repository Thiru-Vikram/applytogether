package in.thiruvikram.applytogether.repository;

import in.thiruvikram.applytogether.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    // Search users by username or fullName
    java.util.List<User> findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(String username,
            String fullName);

    // Admin queries
    java.util.List<User> findByRole(String role);

    java.util.List<User> findByPassingYear(String passingYear);

    java.util.List<User> findByRoleAndPassingYear(String role, String passingYear);

    long countByCreatedAtAfter(java.time.LocalDateTime date);

    @org.springframework.data.jpa.repository.Query("SELECT u.passingYear FROM User u WHERE u.passingYear IS NOT NULL GROUP BY u.passingYear ORDER BY COUNT(u) DESC")
    java.util.List<String> findMostActiveBatch();
}
