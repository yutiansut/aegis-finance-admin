ALTER TABLE t_finance_order ADD `apply_company_id` BIGINT(20) DEFAULT NULL COMMENT '申请人公司id' AFTER last_update_time;