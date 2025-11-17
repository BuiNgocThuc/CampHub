package org.camphub.be_camphub.mapper;

import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class Utils_Mapper {
    @Named("enumToString")
    public String enumToString(Enum<?> value) {
        return value != null ? value.name() : null;
    }

    @Named("localDateTimeToString")
    public String localDateTimeToString(LocalDateTime time) {
        return time != null ? time.toString() : null;
    }
}
