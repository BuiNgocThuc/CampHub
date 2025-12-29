package org.camphub.be_camphub.service;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.return_req.AdminDecisionRequest;
import org.camphub.be_camphub.dto.request.return_req.LesseeSubmitReturnRequest;
import org.camphub.be_camphub.dto.request.return_req.LessorConfirmReturnRequest;
import org.camphub.be_camphub.dto.request.return_req.ReturnReqCreationRequest;
import org.camphub.be_camphub.dto.response.return_req.ReturnReqResponse;

public interface ReturnRequestService {
    ReturnReqResponse createReturnRequest(UUID lesseeId, ReturnReqCreationRequest request);

    ReturnReqResponse lesseeSubmitReturn(UUID lesseeId, LesseeSubmitReturnRequest request);

    ReturnReqResponse lessorConfirmReturn(UUID lessorId, LessorConfirmReturnRequest request);

    ReturnReqResponse adminDecision(UUID adminId, AdminDecisionRequest request);

    List<ReturnReqResponse> getPendingRequests();

    List<ReturnReqResponse> getAllReturnRequests();

    ReturnReqResponse getReturnRequestById(UUID requestId);

    ReturnReqResponse getReturnRequestByBooking(UUID bookingId, UUID requesterId);
}
