package com.unisync.backend.features.authentication.filter;

import com.unisync.backend.features.authentication.model.User;
import com.unisync.backend.features.authentication.repository.BlackListedTokenRepository;
import com.unisync.backend.features.authentication.service.AuthenticationService;
import com.unisync.backend.features.authentication.utils.JsonWebToken;
import com.unisync.backend.features.authentication.utils.TokenBlacklistUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

@Component
public class AuthenticationFilter extends HttpFilter {
    private final List<String> unsecuredEndpoints = Arrays.asList(
            "/api/v1/authentication/login",
            "/api/v1/authentication/register",
            "/api/v1/authentication/send-password-reset-token",
            "/api/v1/authentication/reset-password",
            "/api/v1/authentication/refresh"
    );

    private final JsonWebToken jsonWebTokenService;
    private final AuthenticationService authenticationService;
    private final BlackListedTokenRepository blacklistedTokenRepository;
    private final TokenBlacklistUtil tokenBlacklistUtil;

    private static final Logger logger = Logger.getLogger(AuthenticationFilter.class.getName());

    public AuthenticationFilter(
            JsonWebToken jsonWebTokenService,
            AuthenticationService authenticationService,
            BlackListedTokenRepository blacklistedTokenRepository,
            TokenBlacklistUtil tokenBlacklistUtil) {
        this.jsonWebTokenService = jsonWebTokenService;
        this.authenticationService = authenticationService;
        this.blacklistedTokenRepository = blacklistedTokenRepository;
        this.tokenBlacklistUtil = tokenBlacklistUtil;
    }

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");


        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String path = request.getRequestURI();
        if (unsecuredEndpoints.contains(path) || path.startsWith("/api/v1/authentication/oauth") || path.startsWith("/api/v1/storage")) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, 1001,
                    "InvalidAuthorizationHeader", "Missing or invalid Authorization header.");
            return;
        }

        String token = authHeader.substring(7).trim();

        try {
            if (blacklistedTokenRepository.existsByToken(token)) {
                logger.warning("Blacklisted token used: " + token);
                writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, 1002,
                        "BlacklistedToken", "Token is blacklisted.");
                return;
            }

            if (jsonWebTokenService.isTokenExpired(token)) {
                tokenBlacklistUtil.blacklistToken(token);
                logger.info("Expired token blacklisted: " + token);
                writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, 1001,
                        "TokenExpired", "Your access token has expired. Please refresh.");
                return;
            }

            String email = jsonWebTokenService.getEmailFromToken(token);
            User user = authenticationService.getUser(email);
            request.setAttribute("authenticatedUser", user);

            chain.doFilter(request, response);
        } catch (Exception e) {
            logger.severe("Authentication failed: " + e.getMessage());
            writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, 4003,
                    "InvalidToken", "Your access token was invalid or tampered. Please login again.");
        }
    }

    private void writeErrorResponse(HttpServletResponse response, int statusCode, int errorCode, String errorType, String message)
            throws IOException {
        response.setStatus(statusCode);
        response.setContentType("application/json");
        response.getWriter().write(String.format(
                "{\"errorCode\": %d, \"errorType\": \"%s\", \"message\": \"%s\"}",
                errorCode, errorType, message
        ));
    }
}
