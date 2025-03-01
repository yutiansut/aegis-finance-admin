package com.yimei.finance.admin.representation.user.enums;

public enum EnumAdminUserError {
    此用户不存在,
    用户对象不能为空,
    用户id不能为空,
    该用户不存在或者已经被禁用,
    用户名或者密码错误,
    用户登录名不能为空,
    此登录名已经存在,
    只有系统管理员才能执行此操作,
    只有超级管理员才能执行此操作,
    用户名不能为空,
    密码不能为空,
    原密码不正确,
    此邮箱已经存在,
    此手机号已经存在,
    新密码和原密码一样,
    邮箱不能为空,
    您的企业信息未认证,
    你没有操作此用户的权限,
    此用户已删除,
    您的账号已被删除,
    此风控线已经存在系统管理员,
    用户角色不能为空,
    ;
    public static final String NewPasswordLengthError = "密码应该在6-16个字符之间";

}
