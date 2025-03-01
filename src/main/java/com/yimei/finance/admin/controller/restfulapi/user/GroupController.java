package com.yimei.finance.admin.controller.restfulapi.user;

import com.yimei.finance.config.session.AdminSession;
import com.yimei.finance.admin.representation.group.GroupObject;
import com.yimei.finance.admin.representation.user.object.UserObject;
import com.yimei.finance.common.representation.result.Page;
import com.yimei.finance.common.representation.result.Result;
import com.yimei.finance.admin.service.user.AdminGroupServiceImpl;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Api(tags = {"admin-api-group"})
@RequestMapping("/api/financing/admin/groups")
@RestController("adminGroupController")
public class GroupController {
    @Autowired
    private AdminSession adminSession;
    @Autowired
    private AdminGroupServiceImpl groupService;

    @ApiOperation(value = "查询所有的用户组", notes = "查询所有用户组列表", response = GroupObject.class, responseContainer = "List")
    @ApiImplicitParam(name = "page", value = "当前页数", required = false, dataType = "int", paramType = "query")
    @RequestMapping(method = RequestMethod.GET)
    public Result getGroupListMethod(@ApiParam(name = "page", value = "分页参数", required = false) Page page) {
        return groupService.findAllGroupList(adminSession.getUser().getId(), page);
    }

    @ApiOperation(value = "通过 groupId 查询用户组", notes = "通过 groupId 查询该用户组信息", response = GroupObject.class)
    @ApiImplicitParam(name = "groupId", value = "用户组 Id", required = true, dataType = "string", paramType = "path")
    @RequestMapping(value = "/{groupId}", method = RequestMethod.GET)
    public Result getGroupByIdMethod(@PathVariable("groupId") String groupId) {
        return groupService.findById(groupId);
    }

    @ApiOperation(value = "通过 groupId 查询用户组下,本公司的用户", notes = "通过 groupId 查询该用户组下,本公司的用户", response = UserObject.class, responseContainer = "List")
    @ApiImplicitParam(name = "groupId", value = "用户组 Id", required = true, dataType = "string", paramType = "path")
    @RequestMapping(value = "/{groupId}/users", method = RequestMethod.GET)
    public Result getCompanyUserListByGroupIdMethod(@PathVariable(value = "groupId") String groupId) {
        return groupService.findCompanyUserListByGroupId(groupId, adminSession.getUser());
    }

    @ApiOperation(value = "创建用户组", notes = "根据Group对象创建用户组", response = GroupObject.class)
    @RequestMapping(method = RequestMethod.POST)
    public Result addGroupMethod(@ApiParam(name = "group", value = "用户组对象", required = true) @Validated @RequestBody GroupObject groupObject) {
        return groupService.addGroup(groupObject, adminSession.getUser().getId());
    }

    @ApiOperation(value = "将一个用户添加到指定的组", notes = "将一个用户添加到指定的组", response = UserObject.class)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "groupId", value = "Group 用户组Id", required = true, dataType = "string", paramType = "path"),
            @ApiImplicitParam(name = "userId", value = "User 用户Id", required = true, dataType = "string", paramType = "path")
    })
    @RequestMapping(value = "/{groupId}/users/{userId}", method = RequestMethod.POST)
    public Result addUserToGroupMethod(@PathVariable("groupId") String groupId,
                                       @PathVariable("userId") String userId) {
        return groupService.addUserToGroup(userId, groupId, adminSession.getUser());
    }

    @ApiOperation(value = "将一个用户从指定的组移出", notes = "将一个用户从指定的组移出", response = GroupObject.class)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "groupId", value = "Group 用户组Id", required = true, dataType = "string", paramType = "path"),
            @ApiImplicitParam(name = "userId", value = "User 用户Id", required = true, dataType = "string", paramType = "path")
    })
    @RequestMapping(value = "/{groupId}/users/{userId}", method = RequestMethod.DELETE)
    public Result deleteUserFromGroupMethod(@PathVariable("groupId") String groupId,
                                            @PathVariable("userId") String userId) {
        return groupService.deleteUserFromGroup(userId, groupId, adminSession.getUser());
    }

    @ApiOperation(value = "修改用户组", notes = "根据Group Id 修改用户组", response = GroupObject.class)
    @ApiImplicitParam(name = "id", value = "用户组 id", required = true, dataType = "string", paramType = "path")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public Result updateGroupMethod(@PathVariable("id") String id,
                                    @ApiParam(name = "group", value = "用户组对象", required = true) @Validated @RequestBody GroupObject groupObject) {
        return groupService.updateGroup(adminSession.getUser().getId(), id, groupObject);
    }

    @ApiOperation(value = "删除用户组", notes = "根据Group Id 删除用户组", response = GroupObject.class)
    @ApiImplicitParam(name = "id", value = "用户组 id", required = true, dataType = "string", paramType = "path")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public Result deleteGroupMethod(@PathVariable("id") String id) {
        return groupService.deleteGroup(adminSession.getUser().getId(), id);
    }


}
