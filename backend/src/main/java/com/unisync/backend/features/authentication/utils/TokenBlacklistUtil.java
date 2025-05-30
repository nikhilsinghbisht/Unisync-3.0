package com.unisync.backend.features.authentication.utils;


import com.unisync.backend.features.authentication.model.BlackListedToken;
import com.unisync.backend.features.authentication.repository.BlackListedTokenRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class TokenBlacklistUtil {


    private final BlackListedTokenRepository blackListedTokenRepository;
    public TokenBlacklistUtil(BlackListedTokenRepository blackListedTokenRepository) {
        this.blackListedTokenRepository = blackListedTokenRepository;
    }

    private  final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public void blacklistToken(String token) {
        if (!blackListedTokenRepository.existsByToken(token)) {
            BlackListedToken blackListedToken = BlackListedToken.builder()
                    .token(token)
                    .blacklistedAt(LocalDateTime.parse(LocalDateTime.now().format(formatter), formatter))
                    .tokenExpiry(LocalDateTime.parse(LocalDateTime.now().format(formatter), formatter))
                    .build();
            blackListedTokenRepository.save(blackListedToken);
        }
    }

}