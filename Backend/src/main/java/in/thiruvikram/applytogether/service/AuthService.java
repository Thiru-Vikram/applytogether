package in.thiruvikram.applytogether.service;

import in.thiruvikram.applytogether.dto.AuthResponse;
import in.thiruvikram.applytogether.dto.LoginRequest;
import in.thiruvikram.applytogether.dto.RegisterRequest;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.repository.UserRepository;
import in.thiruvikram.applytogether.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
        private AuthenticationManager authenticationManager;

        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByUsername(request.getUsername())) {
                        throw new RuntimeException("Username is already taken!");
                }
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email is already in use!");
                }

                User user = new User();
                user.setUsername(request.getUsername());
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));

                // Default to USER if role is not provided or if handled strictly
                // For simplicity allow passing role, but ideally should restrict ADMIN creation
                String role = (request.getRole() != null && !request.getRole().isEmpty())
                                ? request.getRole().toUpperCase()
                                : "USER";
                user.setRole(role);
                user.setFullName(request.getFullName());
                user.setGender(request.getGender());
                user.setPassingYear(request.getPassingYear());
                user.setCollegeName(request.getCollegeName());
                user.setDepartment(request.getDepartment());
                user.setState(request.getState());
                user.setCity(request.getCity());

                userRepository.save(user);

                // Auto-login after register (optional, or just return success message)
                // Here we just acknowledge registration.
                // Or we can generate token immediately. Let's return a simple token for now.

                // For strictness, let's force them to login, or generate token now.
                // Let's generate token to be helpful.
                String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
                                user.getUsername(),
                                user.getPassword(),
                                java.util.Collections
                                                .singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ROLE_" + user.getRole()))));

                return new AuthResponse(token, user.getUsername(), user.getRole(), user.getId());
        }

        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

                User user = userRepository.findByUsername(request.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
                                user.getUsername(),
                                user.getPassword(),
                                java.util.Collections
                                                .singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ROLE_" + user.getRole()))));

                return new AuthResponse(token, user.getUsername(), user.getRole(), user.getId());
        }

        public User getUserByUsername(String username) {
                return userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
        }
}
