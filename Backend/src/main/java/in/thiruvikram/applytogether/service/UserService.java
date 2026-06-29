package in.thiruvikram.applytogether.service;

import java.util.List;

import in.thiruvikram.applytogether.entity.User;

public interface UserService {
    User findById(Long id);

    User findByUsername(String username);

    List<User> searchUsers(String query);
}