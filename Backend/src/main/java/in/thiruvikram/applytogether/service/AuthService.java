package in.thiruvikram.applytogether.service;

import in.thiruvikram.applytogether.dto.AuthResponse;
import in.thiruvikram.applytogether.dto.LoginRequest;
import in.thiruvikram.applytogether.dto.RegisterRequest;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.repository.UserRepository;
import in.thiruvikram.applytogether.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService {

        private static final String ROLE_USER = "USER";
        private static final String ROLE_STAFF = "STAFF";
        private static final String ROLE_ADMIN = "ADMIN";

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final AuthenticationManager authenticationManager;

        public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                        JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtUtil = jwtUtil;
                this.authenticationManager = authenticationManager;
        }

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
                user.setRole(resolveRoleForRegistration(request.getRole()));
                user.setFullName(request.getFullName());
                user.setGender(request.getGender());
                user.setPassingYear(request.getPassingYear());

                userRepository.save(user);

                // Auto-login after register (optional, or just return success message)
                // Here we just acknowledge registration.
                // Or we can generate token immediately. Let's return a simple token for now.

                // For strictness, let's force them to login, or generate token now.
                // Let's generate token to be helpful.
                UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                                user.getUsername(),
                                user.getPassword(),
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
                String token = jwtUtil.generateToken(userDetails);

                return new AuthResponse(token, user.getUsername(), user.getRole(), user.getId());
        }

        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

                User user = userRepository.findByUsername(request.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                                user.getUsername(),
                                user.getPassword(),
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
                String token = jwtUtil.generateToken(userDetails);

                return new AuthResponse(token, user.getUsername(), user.getRole(), user.getId());
        }

        public User getUserByUsername(String username) {
                return userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
        }

        private String resolveRoleForRegistration(String requestedRole) {
                if (requestedRole == null || requestedRole.isBlank()) {
                        return ROLE_USER;
                }

                String normalizedRole = requestedRole.trim().toUpperCase();
                if (!ROLE_USER.equals(normalizedRole) && !ROLE_STAFF.equals(normalizedRole)
                                && !ROLE_ADMIN.equals(normalizedRole)) {
                        throw new IllegalArgumentException("Invalid role provided");
                }

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                boolean isAdminRequest = authentication != null && authentication.isAuthenticated()
                                && authentication.getAuthorities().stream()
                                                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));

                if (!isAdminRequest) {
                        return ROLE_USER;
                }

                return normalizedRole;
        }
}
