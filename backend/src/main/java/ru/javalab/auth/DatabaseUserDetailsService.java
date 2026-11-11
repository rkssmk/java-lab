package ru.javalab.auth;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {
    private final UserRepository users;

    public DatabaseUserDetailsService(UserRepository users) {
        this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount account = users.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found"));
        return User.withUsername(account.getUsername())
                .password(account.getPasswordHash())
                .roles("USER")
                .disabled(!account.isEnabled())
                .build();
    }
}
