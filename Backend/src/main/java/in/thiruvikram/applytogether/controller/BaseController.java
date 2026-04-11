package in.thiruvikram.applytogether.controller;

import org.springframework.beans.factory.annotation.Autowired;

import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.service.AuthService;

public abstract class BaseController {

    @Autowired
    private AuthService authService;

    protected User getCurrentUser(java.security.Principal principal) {
        return authService.getUserByUsername(principal.getName());
    }
}