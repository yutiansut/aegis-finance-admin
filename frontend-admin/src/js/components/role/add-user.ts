/**
 * Created by liushengbin on 16/8/15.
 */


import { Component } from '@angular/core';
import { Router, ActivatedRoute }      from '@angular/router';
import { User, UserService, UserGroup, UserGroupService } from '../../service/user';


declare var __moduleName: string;

@Component({
    selector: 'add-user',
    moduleId: __moduleName || module.id,
    templateUrl: 'add-user.html'
})



export class AddUserComponent {

    constructor(
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private groupService:UserGroupService
    ) {}

    css = {
        activeForRefresh : true,
        isSubmitted : false,
        ajaxErrorHidden : true
    };

    isAddStatus : boolean = false;

    currentUser = new User();

    groups = [];

    ngOnInit(){
        this.getGroupList();


        if (this.activatedRoute.routeConfig.path.indexOf('add') > -1) {
            this.isAddStatus = true;
        }
    }



    getGroupList() {

        this.groupService.getList().then((result)=>{
            if (result.success){
                this.groups = result.data;

                this.groups.forEach( (group)=> {
                    if (this.currentUser.groupIds.indexOf(group.id) > -1) {
                        group.selected = true;
                    }
                });

            }else{

            }
        });
    }

    selectGroup(group){
        if (this.currentUser.groupIds.indexOf(group.id) === -1 ){
            this.currentUser.groupIds.push(group.id);
        }else{
            this.currentUser.groupIds.splice(this.currentUser.groupIds.indexOf(group.id), 1);
        }

        console.log(this.currentUser.groupIds);
    }
    addUser(form) {
        this.css.ajaxErrorHidden = true;
        this.css.isSubmitted = true;
        this.userService.add(this.currentUser).then((result)=>{
            if (result.success){
                window.location.href = '/finance/admin/home';
            }else{
                this.css.ajaxErrorHidden = false;
            }
            console.log(result)
        });
    }

}

