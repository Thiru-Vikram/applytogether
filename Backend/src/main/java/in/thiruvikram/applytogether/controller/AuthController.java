package in.thiruvikram.applytogether.controller;

import in.thiruvikram.applytogether.dto.AuthResponse;
import in.thiruvikram.applytogether.dto.LoginRequest;
import in.thiruvikram.applytogether.dto.RegisterRequest;
import in.thiruvikram.applytogether.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
