package com.yimei.finance.entity.common;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "t_finance_databook")
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class DataBook implements Serializable {
    @Id
    @Column(name = "id")
    private int id;                    // id

    @Column(name = "sequence")
    @NonNull
    private int sequence;

    @Column(name = "name")
    @NonNull
    private String name;               // 名称

    @Column(name = "type")
    @NonNull
    private String type;               // 类型

}

