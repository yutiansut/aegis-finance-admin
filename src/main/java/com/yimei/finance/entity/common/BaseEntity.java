package com.yimei.finance.entity.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;
import java.util.Date;

@MappedSuperclass
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseEntity implements Serializable {
    @Column(name = "create_man_id", updatable = false)
    private String createManId;                                      //创建人id
    @Column(name = "create_time", updatable = false)
    private Date createTime;                                         //创建时间
    @Column(name = "last_update_man_id")
    private String lastUpdateManId;                                  //最后一次更新人id
    @Column(name = "last_update_time")
    private Date lastUpdateTime;                                     //最后一次更新时间
}
