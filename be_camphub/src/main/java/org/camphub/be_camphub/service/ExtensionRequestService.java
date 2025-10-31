package org.camphub.be_camphub.service;

import java.util.UUID;

import org.camphub.be_camphub.dto.request.extension_req.ExtensionReqCreationRequest;
import org.camphub.be_camphub.dto.request.extension_req.ExtensionResponseRequest;
import org.camphub.be_camphub.dto.response.extension_req.ExtensionReqResponse;

public interface ExtensionRequestService {
    ExtensionReqResponse createExtensionRequest(UUID lesseeId, ExtensionReqCreationRequest request);

    ExtensionReqResponse approveExtensionRequest(UUID lessorId, ExtensionResponseRequest request);

    ExtensionReqResponse rejectExtensionRequest(UUID lessorId, ExtensionResponseRequest request);

    ExtensionReqResponse cancelExtensionRequest(UUID lesseeId, UUID requestId);

    void autoExpirePendingRequests(); // cron job
}
