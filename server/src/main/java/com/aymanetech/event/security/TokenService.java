package com.aymanetech.event.security;

import com.aymanetech.event.user.domain.entity.User;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final JwtConfigProperties jwtConfigProperties;

    public String generateToken(Authentication authentication) {
        var header = getHeader();
        var claims = getJwtClaimsSet(authentication);
        var key = jwtConfigProperties.getSecretKey();
        var token = new SignedJWT(header, claims);

        try {
            var signer = new MACSigner(key);
            token.sign(signer);
        } catch (JOSEException e) {
            throw new RuntimeException("Error generating JWT", e);
        }
        return token.serialize();
    }

    private JWSHeader getHeader() {
        return new JWSHeader.Builder(jwtConfigProperties.getAlgorithm())
                .type(JOSEObjectType.JWT)
                .build();
    }

    private JWTClaimsSet getJwtClaimsSet(Authentication authentication) {
        var now = Instant.now();
        var authorities = getAuthorities(authentication);

        var user = (User) authentication.getPrincipal();
        return new JWTClaimsSet.Builder()
                .issuer("Aymane El Maini")
                .issueTime(Date.from(now))
                .expirationTime(Date.from(now.plus(1, ChronoUnit.HOURS)))
                .claim("authorities", authorities)
                .claim("name", user.getName())
                .claim("email", user.getEmail())
                .claim("id", user.getId())
                .build();
    }

    private static List<String> getAuthorities(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
    }
}
