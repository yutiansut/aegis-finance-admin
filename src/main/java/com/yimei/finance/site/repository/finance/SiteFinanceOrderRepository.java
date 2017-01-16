package com.yimei.finance.site.repository.finance;

import com.yimei.finance.entity.admin.finance.FinanceOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface SiteFinanceOrderRepository extends JpaRepository<FinanceOrder, Long> {

    List<FinanceOrder> findByUserIdOrApplyCompanyId(@Param("userId") Long userId,
                                                    @Param("applyCompanyId") Long applyCompanyId);

    @Query(" select f from FinanceOrder f where f.id = ?1 and (f.userId=?2 or f.applyCompanyId=?3) ")
    FinanceOrder findByIdAndUserIdOrCompanyId(@Param("id") Long id,
                                              @Param("userId") Long userId,
                                              @Param("applyCompanyId") Long applyCompanyId);

    FinanceOrder findBySourceId(@Param("sourceId") String sourceId);

    List<FinanceOrder> findByUserIdAndCreateTimeGreaterThan(@Param("id") Long id, @Param("createTime") Date createTime);


}
