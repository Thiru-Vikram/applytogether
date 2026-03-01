package in.thiruvikram.applytogether.service;

import in.thiruvikram.applytogether.entity.Follow;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.entity.Notification;
import in.thiruvikram.applytogether.repository.FollowRepository;
import in.thiruvikram.applytogether.repository.NotificationRepository;
import in.thiruvikram.applytogether.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {

        private final FollowRepository followRepository;
        private final UserRepository userRepository;
        private final NotificationRepository notificationRepository;

        public FollowService(FollowRepository followRepository, UserRepository userRepository,
                        NotificationRepository notificationRepository) {
                this.followRepository = followRepository;
                this.userRepository = userRepository;
                this.notificationRepository = notificationRepository;
        }

        public void followUser(String followerUsername, Long followingId) {
                User follower = userRepository.findByUsername(followerUsername)
                                .orElseThrow(() -> new RuntimeException("Follower not found"));
                User following = userRepository.findById(followingId)
                                .orElseThrow(() -> new RuntimeException("User to follow not found"));

                if (follower.getId().equals(following.getId())) {
                        throw new RuntimeException("You cannot follow yourself");
                }

                if (followRepository.existsByFollowerAndFollowing(follower, following)) {
                        throw new RuntimeException("Already following/requested this user");
                }

                Follow follow = new Follow(follower, following, "PENDING");
                followRepository.save(follow);

                // Create Notification
                Notification notification = new Notification(
                                following,
                                follower,
                                "FOLLOW_REQUEST",
                                follower.getFullName() + " requested to follow you.",
                                follower.getId() // relatedEntity is the follower user ID for easy navigation
                );
                notificationRepository.save(notification);
        }

        public void acceptFollowRequest(String currentUsername, Long followerId) {
                User currentUser = userRepository.findByUsername(currentUsername)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                User follower = userRepository.findById(followerId)
                                .orElseThrow(() -> new RuntimeException("Follower not found"));

                Follow follow = followRepository.findByFollowerAndFollowing(follower, currentUser)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                follow.setStatus("ACCEPTED");
                followRepository.save(follow);

                // Auto-follow back (Create mutual friendship)
                Follow reverseFollow = followRepository.findByFollowerAndFollowing(currentUser, follower)
                                .orElse(new Follow(currentUser, follower, "ACCEPTED"));

                reverseFollow.setStatus("ACCEPTED");
                followRepository.save(reverseFollow);

                // Notify the follower that request was accepted
                Notification notification = new Notification(
                                follower,
                                currentUser,
                                "FOLLOW_ACCEPTED",
                                currentUser.getFullName() + " accepted your follow request and is now following you!",
                                currentUser.getId());
                notificationRepository.save(notification);
        }

        public void deleteFollowRequest(String currentUsername, Long followerId) {
                User currentUser = userRepository.findByUsername(currentUsername)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                User follower = userRepository.findById(followerId)
                                .orElseThrow(() -> new RuntimeException("Follower not found"));

                Follow follow = followRepository.findByFollowerAndFollowing(follower, currentUser)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                followRepository.delete(follow);
        }

        public void unfollowUser(String followerUsername, Long followingId) {
                User follower = userRepository.findByUsername(followerUsername)
                                .orElseThrow(() -> new RuntimeException("Follower not found"));
                User following = userRepository.findById(followingId)
                                .orElseThrow(() -> new RuntimeException("User to unfollow not found"));

                Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
                                .orElseThrow(() -> new RuntimeException("Not following this user"));

                followRepository.delete(follow);
        }

        public List<User> getFollowing(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return followRepository.findByFollower(user).stream()
                                .filter(f -> "ACCEPTED".equals(f.getStatus()))
                                .map(Follow::getFollowing)
                                .collect(Collectors.toList());
        }

        public List<User> getFollowers(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return followRepository.findByFollowing(user).stream()
                                .filter(f -> "ACCEPTED".equals(f.getStatus()))
                                .map(Follow::getFollower)
                                .collect(Collectors.toList());
        }

        public long getFollowingCount(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return followRepository.findByFollower(user).stream()
                                .filter(f -> "ACCEPTED".equals(f.getStatus()))
                                .count();
        }

        public long getFollowersCount(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return followRepository.findByFollowing(user).stream()
                                .filter(f -> "ACCEPTED".equals(f.getStatus()))
                                .count();
        }

        public boolean isFollowing(String followerUsername, Long targetUserId) {
                User follower = userRepository.findByUsername(followerUsername)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                User targetUser = userRepository.findById(targetUserId)
                                .orElseThrow(() -> new RuntimeException("Target user not found"));

                return followRepository.findByFollowerAndFollowing(follower, targetUser)
                                .map(f -> "ACCEPTED".equals(f.getStatus()))
                                .orElse(false);
        }
}
