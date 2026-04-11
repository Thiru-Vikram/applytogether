package in.thiruvikram.applytogether.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.exception.ResourceNotFoundException;
import in.thiruvikram.applytogether.repository.UserRepository;
import in.thiruvikram.applytogether.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    @Override
    public List<User> searchUsers(String query) {
        return userRepository
                .findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(
                        query, query);
    }
}