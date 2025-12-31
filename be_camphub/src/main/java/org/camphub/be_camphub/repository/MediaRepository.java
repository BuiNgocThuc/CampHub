package org.camphub.be_camphub.repository;

import java.util.UUID;

import org.camphub.be_camphub.entity.ItemLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MediaRepository extends JpaRepository<ItemLog, UUID> {

    @Query(
            value =
                    """
	SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END
	FROM (
	(SELECT 1 FROM item_log_media WHERE file_hash = :hash LIMIT 1)
	UNION ALL
	(SELECT 1 FROM return_request_evidences WHERE file_hash = :hash LIMIT 1)
	UNION ALL
	(SELECT 1 FROM dispute_media WHERE file_hash = :hash LIMIT 1)
	) AS check_table
""",
            nativeQuery = true)
    int checkHashGlobal(@Param("hash") String hash);
}
