/**
 * Created by liushengbin on 16/8/15.
 */


import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Task, TaskService, TaskStatus } from '../../service/task';
import { User, UserService } from '../../service/user';

declare var __moduleName: string;


@Component({
    selector: 'pending-list',
    moduleId: __moduleName || module.id,
    templateUrl: 'task-list.html'
})
export class TaskListComponent {

    constructor(
        private activatedRoute: ActivatedRoute,
        private task: TaskService,
        private user: UserService
    ) {}

    routeData :any = {
        routetype : '',
        title : ''
    };

    taskAssignList : Task[] = [];
    taskPendingList : Task[] = [];
    taskStatusStep : any = TaskStatus;
    currentUserSession : User = new User();

    ngOnInit(){
        this.activatedRoute.data.subscribe( data => {
            this.routeData = data;
            if (this.routeData.routetype === 'pending'){
                this.getAssignTaskList();
                this.getAllTaskList();
            }else{
                this.getAllTaskList();
            }
        });

        this.getCurrentUser();
    }

    getCurrentUser() {
        this.user.getUserSessionObservable.subscribe(
            result => {
                if (result && result.success) {
                    this.currentUserSession = result.data;
                } else {

                }
            },
            error => console.error(error)
        )
    }

    getAssignTaskList () {
        this.task.getAdminTaskList().then((result)=>{
            if (result.success){
                this.taskAssignList = result.data;
                this.getPendingTaskList();
            }else{

            }
        });
    }

    getPendingTaskList () {
        this.task.getTaskList().then((result)=>{
            if (result.success){
                this.taskPendingList = result.data;
                this.task.setPendingTaskLengthObservable(result.data.length + this.taskAssignList.length);
            }else{

            }
        });
    }

    getAllTaskList () {
        this.task.getTaskHistoryList().then((result)=>{
            if (result.success){
                if (this.routeData.routetype === 'all'){
                    this.taskPendingList = result.data;
                }
                this.task.setAllTaskLengthObservable(result.data.length);
            }else{

            }
        });
    }

}

