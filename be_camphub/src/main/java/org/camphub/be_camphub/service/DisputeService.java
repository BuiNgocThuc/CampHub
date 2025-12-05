package org.camphub.be_camphub.service;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.dispute.AdminReviewDisputeRequest;
import org.camphub.be_camphub.dto.request.dispute.DisputeCreationRequest;
import org.camphub.be_camphub.dto.response.dispute.DisputeResponse;

public interface DisputeService {
    DisputeResponse createDispute(UUID lessorId, DisputeCreationRequest request);

    DisputeResponse adminReviewDispute(UUID adminId, AdminReviewDisputeRequest request);

    List<DisputeResponse> getPendingDisputes();

    List<DisputeResponse> getAllDisputes();

    DisputeResponse getDisputeById(UUID disputeId);
}
