package in.thiruvikram.applytogether.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.service.FollowService;
import in.thiruvikram.applytogether.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final FollowService followService;

    public UserController(UserService userService, FollowService followService) {
        this.userService = userService;
        this.followService = followService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.findByUsername(username);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = userService.searchUsers(query);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/{userId}/follow")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> followUser(@PathVariable Long userId, Principal principal) {
        followService.followUser(principal.getName(), userId);
        return ResponseEntity.ok("Followed successfully");
    }

    @PostMapping("/{userId}/unfollow")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> unfollowUser(@PathVariable Long userId, Principal principal) {
        followService.unfollowUser(principal.getName(), userId);
        return ResponseEntity.ok("Unfollowed successfully");
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<User>> getFollowing(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowing(userId));
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<User>> getFollowers(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowers(userId));
    }

    @GetMapping("/{userId}/following/count")
    public ResponseEntity<Long> getFollowingCount(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowingCount(userId));
    }

    @GetMapping("/{userId}/followers/count")
    public ResponseEntity<Long> getFollowersCount(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowersCount(userId));
    }

    @GetMapping("/{userId}/is-following")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isFollowing(@PathVariable Long userId, Principal principal) {
        return ResponseEntity.ok(followService.isFollowing(principal.getName(), userId));
    }

    @PostMapping("/followers/{followerId}/accept")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> acceptFollowRequest(@PathVariable Long followerId, Principal principal) {
        followService.acceptFollowRequest(principal.getName(), followerId);
        return ResponseEntity.ok("Follow request accepted");
    }

    @PostMapping("/followers/{followerId}/reject")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> rejectFollowRequest(@PathVariable Long followerId, Principal principal) {
        followService.deleteFollowRequest(principal.getName(), followerId);
        return ResponseEntity.ok("Follow request rejected");
    }
}
