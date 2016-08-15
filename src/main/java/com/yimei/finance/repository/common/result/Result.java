package com.yimei.finance.repository.common.result;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Created by liuxinjie on 16/8/9.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class Result implements Serializable {
    private boolean success;
    private Error error;
    private Page meta;
    private Object data;

    public Result setSuccess(boolean success) {
        this.success = success;
        return this;
    }

    public Result setError(Error error) {
        this.error = error;
        return this;
    }

    public Result setMeta(Page meta) {
        this.meta = meta;
        return this;
    }

    public Result setData(Object data) {
        this.data = data;
        return this;
    }

    public static Result success(){
        return new  Result().setSuccess(true);
    }

    public static Result error(String error){
        return new  Result().setSuccess(false).setError(new Error(1000, error, null));
    }

    public static Result error(Integer code, String error){
        return new  Result().setSuccess(false).setError(new Error(code, error, null));
    }

    public static Result error(Integer code, String error, String field) {
        return new Result().setSuccess(false).setError(new Error(code, error, field));
    }

    public static Result error(Error error){
        return new  Result().setSuccess(false).setError(error);
    }
}