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
PojosMetadataMap.create<Dispute>('Dispute', {});
PojosMetadataMap.create<DisputeResponse>('DisputeResponse', {});
PojosMetadataMap.create<DisputeCreationRequest>('DisputeCreationRequest', {});
PojosMetadataMap.create<AdminReviewDisputeRequest>('AdminReviewDisputeRequest', {});


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
        return disputeMapper.map(dto, 'Dispute', 'DisputeResponse');
    },

    /** FE model → Create Dispute Request */
    toCreationRequest(model: Dispute): DisputeCreationRequest {
        return disputeMapper.map(model, 'DisputeCreationRequest', 'Dispute');
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
