package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.response.return_req.ReturnReqResponse;
import org.camphub.be_camphub.entity.ReturnRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReturnRequestMapper {

    ReturnReqResponse entityToResponse(ReturnRequest returnRequest);
}
