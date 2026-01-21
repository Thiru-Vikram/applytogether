package in.thiruvikram.applytogether.controller;

import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/search")
    public ResponseEntity<java.util.List<User>> searchUsers(@RequestParam String query) {
        java.util.List<User> users = userRepository
                .findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(query, query);
        return ResponseEntity.ok(users);
    }
}
