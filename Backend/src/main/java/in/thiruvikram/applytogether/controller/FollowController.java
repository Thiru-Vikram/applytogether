package in.thiruvikram.applytogether.controller;

import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/{userId}/follow")
    public ResponseEntity<String> followUser(@PathVariable Long userId, Principal principal) {
        followService.followUser(principal.getName(), userId);
        return ResponseEntity.ok("Followed successfully");
    }

    @PostMapping("/{userId}/unfollow")
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
    public ResponseEntity<Boolean> isFollowing(@PathVariable Long userId, Principal principal) {
        return ResponseEntity.ok(followService.isFollowing(principal.getName(), userId));
    }

    @PostMapping("/followers/{followerId}/accept")
    public ResponseEntity<String> acceptFollowRequest(@PathVariable Long followerId, Principal principal) {
        followService.acceptFollowRequest(principal.getName(), followerId);
        return ResponseEntity.ok("Follow request accepted");
    }

    @PostMapping("/followers/{followerId}/reject")
    public ResponseEntity<String> rejectFollowRequest(@PathVariable Long followerId, Principal principal) {
        followService.deleteFollowRequest(principal.getName(), followerId);
        return ResponseEntity.ok("Follow request rejected");
    }
}
