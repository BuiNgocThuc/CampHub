// dispute.mapper.ts
import { createMapper, createMap } from '@automapper/core';
import { pojos, PojosMetadataMap } from '@automapper/pojos';

import { Dispute } from '../types';
import {
    DisputeCreationRequest,
    AdminReviewDisputeRequest
} from '../dto/request';
import { DisputeResponse } from '../dto/response';

// ========================================================
// Mapper
// ========================================================
export const disputeMapper = createMapper({
    strategyInitializer: pojos(),
});

// ========================================================
// Metadata
// ========================================================
PojosMetadataMap.create<Dispute>('Dispute', {
    id: String,
    bookingId: String,
    reporterId: String,
    defenderId: String,
    adminId: String,

    reporterName: String,
    defenderName: String,
    adminName: String,

    description: String,
    evidenceUrls: Array,
    damageTypeId: String,
    damageTypeName: String,
    compensationRate: Number,

    status: String,
    adminDecision: String,
    compensationAmount: Number,
    adminNote: String,

    createdAt: String,
    resolvedAt: String,
});

PojosMetadataMap.create<DisputeResponse>('DisputeResponse', {
    id: String,
    bookingId: String,
    reporterId: String,
    defenderId: String,
    adminId: String,

    reporterName: String,
    defenderName: String,
    adminName: String,

    description: String,
    evidenceUrls: Array,
    damageTypeId: String,
    damageTypeName: String,
    compensationRate: Number,

    status: String,
    adminDecision: String,
    compensationAmount: Number,
    adminNote: String,

    createdAt: String,
    resolvedAt: String,
});

PojosMetadataMap.create<DisputeCreationRequest>('DisputeCreationRequest', {
    bookingId: String,
    damageTypeId: String,
    note: String,
    evidenceUrls: Array,
});

PojosMetadataMap.create<AdminReviewDisputeRequest>('AdminReviewDisputeRequest', {
    disputeId: String,
    isApproved: Boolean,
    adminNote: String,
});


// ========================================================
// 1) ResponseDTO → Model
// ========================================================
createMap<DisputeResponse, Dispute>(
    disputeMapper,
    'DisputeResponse',
    'Dispute'
);


// ========================================================
// 2) Model → CreationRequest
// (FE tạo khiếu nại)
// ========================================================
createMap<Dispute, DisputeCreationRequest>(
    disputeMapper,
    'Dispute',
    'DisputeCreationRequest'
);


// ========================================================
// 3) Model → AdminReviewRequest
// (admin xử lý tranh chấp)
// ========================================================
createMap<Dispute, AdminReviewDisputeRequest>(
    disputeMapper,
    'Dispute',
    'AdminReviewDisputeRequest'
);


// ========================================================
// disputeMap API – simple to use
// ========================================================
export const disputeMap = {
    /** Backend → FE model */
    fromResponse(dto: DisputeResponse): Dispute {
        return disputeMapper.map(dto, 'DisputeResponse', 'Dispute');
    },

    /** FE model → Create Dispute Request */
    toCreationRequest(model: Dispute): DisputeCreationRequest {
        return disputeMapper.map(model, 'Dispute', 'DisputeCreationRequest');
    },

    /** FE model → Admin review request */
    toAdminReviewRequest(model: Partial<Dispute> & { id: string; isApproved: boolean }): AdminReviewDisputeRequest {
        return {
            disputeId: model.id,
            isApproved: model.isApproved,
            adminNote: model.adminNote ?? ''
        };
    }
};
