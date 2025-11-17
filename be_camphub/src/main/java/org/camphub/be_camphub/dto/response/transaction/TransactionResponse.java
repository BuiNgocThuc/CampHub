package org.camphub.be_camphub.dto.response.transaction;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionResponse {
    UUID id;
    UUID fromAccountId;
    UUID toAccountId;
    Double amount;
    String type;
    String status;
    String createdAt;

    String senderName;
    String receiverName;

}
