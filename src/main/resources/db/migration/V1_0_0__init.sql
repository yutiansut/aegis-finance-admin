
CREATE TABLE `t_finance_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `apply_company_name` varchar(60) NOT NULL COMMENT '申请人公司名称',
  `apply_type` varchar(20) NOT NULL COMMENT '申请类型',
  `apply_user_name` varchar(50) DEFAULT NULL COMMENT '申请人姓名',
  `apply_user_phone` varchar(50) NOT NULL COMMENT '申请人手机号',
  `approve_state` varchar(30) NOT NULL COMMENT '审核状态',
  `approve_state_id` int(11) NOT NULL COMMENT '审核状态id',
  `business_amount` decimal(20,2) DEFAULT NULL COMMENT '预期此笔业务量（单位：万吨）',
  `coal_quantity_index` text DEFAULT NULL COMMENT '主要煤质指标',
  `coal_source` varchar(120) DEFAULT NULL COMMENT '煤炭来源',
  `comments` text DEFAULT NULL COMMENT '备注说明',
  `downstream_contract_company` varchar(120) DEFAULT NULL COMMENT '下游签约单位',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `expect_date` int(11) NOT NULL COMMENT '拟使用资金时间（单位：天）',
  `financing_amount` decimal(20,2) DEFAULT NULL COMMENT '拟融资金额（单位：万元）',
  `market_price` decimal(10,2) DEFAULT NULL COMMENT '单吨市场报价（元／吨）',
  `our_contract_company` varchar(120) DEFAULT NULL COMMENT '我方签约单位',
  `procurement_price` decimal(10,2) DEFAULT NULL COMMENT '单吨采购价 (元/吨)',
  `selling_price` decimal(10,2) DEFAULT NULL COMMENT '预计单吨销售价 (元/吨)',
  `source_id` varchar(100) NOT NULL COMMENT '流水号，业务编号',
  `storage_location` varchar(120) DEFAULT NULL COMMENT '煤炭仓储地',
  `terminal_server` varchar(120) DEFAULT NULL COMMENT '用煤终端',
  `transfer_port` varchar(120) DEFAULT NULL COMMENT '中转港口(中转地)全称',
  `transport_mode` varchar(30) DEFAULT NULL COMMENT '运输方式：海运\汽运\火运\其他',
  `upstream_resource` varchar(120) DEFAULT NULL COMMENT '上游资源方全称',
  `user_id` int(11) NOT NULL COMMENT '申请人userId',
  `create_man_id` varchar(255) DEFAULT NULL COMMENT '创建人userId',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `last_update_man_id` varchar(255) DEFAULT NULL COMMENT '最后一次更新人userId',
  `last_update_time` datetime DEFAULT NULL COMMENT '最后一次更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `sourceCode` (`source_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='金融申请单表';


CREATE TABLE `t_finance_order_investigator_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `apply_company_name` varchar(120) DEFAULT NULL COMMENT '申请人公司名称',
  `approve_state` varchar(30) NOT NULL COMMENT '审核状态',
  `approve_state_id` int(11) NOT NULL COMMENT '审核状态id',
  `business_risk_point` text DEFAULT NULL COMMENT '业务风险点',
  `business_start_time` datetime DEFAULT NULL COMMENT '业务开始时间',
  `business_transfer_info` TEXT DEFAULT NULL COMMENT '业务流转信息',
  `downstream_contract_company` varchar(120) DEFAULT NULL COMMENT '下游签约单位',
  `final_conclusion` TEXT DEFAULT NULL COMMENT '综合意见,最终结论',
  `finance_id` bigint(20) NOT NULL COMMENT '金融申请单id',
  `financing_amount` decimal(20,2) DEFAULT NULL COMMENT '融资金额',
  `financing_period` int(11) DEFAULT NULL COMMENT '融资期限',
  `historical_cooperation_detail` TEXT DEFAULT NULL COMMENT '历史合作情况',
  `interest_rate` decimal(5,2) DEFAULT NULL COMMENT '利率',
  `main_business_information` TEXT DEFAULT NULL COMMENT '业务主要信息',
  `need_supply_material` int(11) NOT NULL COMMENT '是否需要补充材料',
  `our_contract_company` varchar(120) DEFAULT NULL COMMENT '我方签约单位',
  `performance_credit_ability_eval` text DEFAULT NULL COMMENT '履约信用及能力评估',
  `quality_inspection_unit` varchar(120) DEFAULT NULL COMMENT '质量检验单位',
  `quantity_inspection_unit` varchar(120) DEFAULT NULL COMMENT '数量检验单位',
  `supply_material_introduce` text DEFAULT NULL COMMENT '补充材料说明',
  `terminal_server` varchar(120) DEFAULT NULL COMMENT '用煤终端',
  `transit_port` varchar(120) DEFAULT NULL COMMENT '中转港口',
  `transport_party` varchar(120) DEFAULT NULL COMMENT '运输方',
  `upstream_contract_company` varchar(120) DEFAULT NULL COMMENT '上游签约单位',
  `create_man_id` varchar(255) DEFAULT NULL COMMENT '创建人userId',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `last_update_man_id` varchar(255) DEFAULT NULL COMMENT '最后一次更新人userId',
  `last_update_time` datetime DEFAULT NULL COMMENT '最后一次更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `financecode` (`finance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='金融单-监管员填写信息表';


CREATE TABLE `t_finance_order_riskmanager_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `approve_state` varchar(30) NOT NULL COMMENT '审核状态',
  `approve_state_id` int(11) NOT NULL COMMENT '审核状态id',
  `business_risk_point` text DEFAULT NULL COMMENT '业务风险点',
  `distribution_ability_eval` text DEFAULT NULL COMMENT '分销能力评估',
  `edit_contract` int(11) NOT NULL COMMENT '是否需要编辑合同',
  `final_conclusion` text DEFAULT NULL COMMENT '风控结论,最终结论,综合意见',
  `finance_id` bigint(20) NOT NULL COMMENT '金融申请单id',
  `need_supply_material` int(11) NOT NULL COMMENT '是否需要补充资料',
  `payment_situation_eval` text DEFAULT NULL COMMENT '预计回款情况',
  `risk_control_scheme` text DEFAULT NULL COMMENT '风险控制方案',
  `supply_material_introduce` text DEFAULT NULL COMMENT '补充材料说明',
  `create_man_id` varchar(255) DEFAULT NULL COMMENT '创建人userId',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `last_update_man_id` varchar(255) DEFAULT NULL COMMENT '最后一次更新人userId',
  `last_update_time` datetime DEFAULT NULL COMMENT '最后一次更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `financecode` (`finance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='金融单-风控人员填写信息表';


CREATE TABLE `t_finance_order_salesman_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `approve_state` varchar(30) NOT NULL COMMENT '审核状态',
  `approve_state_id` int(11) NOT NULL COMMENT '审核状态id',
  `business_model_introduce` text DEFAULT NULL COMMENT '业务操作模式介绍',
  `contract_companies_info_supply` text DEFAULT NULL COMMENT '上下游签约单位信息补充',
  `finance_id` bigint(20) NOT NULL COMMENT '金融申请单id',
  `logistics_storage_info_supply` text DEFAULT NULL COMMENT '物流仓储信息补充',
  `need_supply_material` int(11) NOT NULL COMMENT '是否需要补充材料',
  `other_info_supply` text DEFAULT NULL COMMENT '其它补充说明',
  `supply_material_introduce` text DEFAULT NULL COMMENT '补充材料说明',
  `create_man_id` varchar(255) DEFAULT NULL COMMENT '创建人userId',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `last_update_man_id` varchar(255) DEFAULT NULL COMMENT '最后一次更新人userId',
  `last_update_time` datetime DEFAULT NULL COMMENT '最后一次更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `financecode` (`finance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='金融单-业务员填写信息表';


CREATE TABLE `t_finance_order_supervisor_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `approve_state` varchar(30) NOT NULL COMMENT '审核状态',
  `approve_state_id` int(11) NOT NULL COMMENT '审核状态id',
  `final_conclusion` text DEFAULT NULL COMMENT '最终结论,综合意见',
  `finance_id` bigint(20) NOT NULL COMMENT '金融申请单id',
  `historical_cooperation_detail` varchar(1020) DEFAULT NULL COMMENT '历史合作情况',
  `need_supply_material` int(11) NOT NULL COMMENT '是否需要补充材料',
  `operating_storage_detail` text DEFAULT NULL COMMENT '经营及堆存情况',
  `port_standard_degree` text DEFAULT NULL COMMENT '保管及进出口流程规范程度',
  `storage_address` varchar(220) DEFAULT NULL COMMENT '仓储地地址',
  `storage_location` varchar(120) DEFAULT NULL COMMENT '仓储地名称',
  `storage_property` varchar(120) DEFAULT NULL COMMENT '仓储性质',
  `supervision_cooperate_detail` text DEFAULT NULL COMMENT '监管配合情况',
  `supervision_scheme` text DEFAULT NULL COMMENT '监管方案',
  `supply_material_introduce` text DEFAULT NULL COMMENT '补充材料说明',
  `create_man_id` varchar(255) DEFAULT NULL COMMENT '创建人userId',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `last_update_man_id` varchar(255) DEFAULT NULL COMMENT '最后一次更新人userId',
  `last_update_time` datetime DEFAULT NULL COMMENT '最后一次更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `financecode` (`finance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='金融单-监管员填写信息表';


CREATE TABLE `t_finance_userlogin_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `user_id` varchar(30) NOT NULL COMMENT '用户id',
  `username` varchar(30) NOT NULL COMMENT '用户登录名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户登陆日志表';


CREATE TABLE `t_finance_number` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_date` date DEFAULT NULL COMMENT '创建日期',
  `type` varchar(30) DEFAULT NULL COMMENT '类型',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='生成编号表';
