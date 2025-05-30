package com.unisync.backend.features.authentication.dto;

public record AuthenticationResponseBody(String token,String refreshToken, String message) {
}
