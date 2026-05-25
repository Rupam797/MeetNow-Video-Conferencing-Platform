package com.meetnow.service;

import io.agora.media.RtcTokenBuilder2;
import io.agora.media.RtcTokenBuilder2.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AgoraTokenService {

    @Value("${agora.app.id}")
    private String appId;

    @Value("${agora.app.certificate}")
    private String appCertificate;

    /**
     * Generate an Agora RTC token for a given channel and numeric UID.
     * Token is valid for 1 hour (3600 seconds).
     */
    public String generateRtcToken(String channelName, int uid) {
        int tokenExpirationInSeconds = 3600;
        int privilegeExpirationInSeconds = 3600;

        RtcTokenBuilder2 tokenBuilder = new RtcTokenBuilder2();
        return tokenBuilder.buildTokenWithUid(
                appId,
                appCertificate,
                channelName,
                uid,
                Role.ROLE_PUBLISHER,
                tokenExpirationInSeconds,
                privilegeExpirationInSeconds
        );
    }
}
