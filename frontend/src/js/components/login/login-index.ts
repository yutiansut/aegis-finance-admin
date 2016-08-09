import { Component } from '@angular/core';
import { Order } from '../../model/order';
import { OrderDetailComponent } from '../../components/order/order-detail';
import { OrderService } from '../../service/order';

declare var __moduleName: string;


@Component({
    selector    : 'page-login',
    moduleId    : __moduleName || module.id,
    templateUrl : 'login-index.html',
    directives  : [OrderDetailComponent],
    providers   : [OrderService]
})



export class LoginComponent {

    constructor(
        private orderService: OrderService
    ) {}


    title = 'Tour of Heroes';
    heroes: Order[];
    selectedHero: Order;

    ngOnInit() {
        this.getHeroes();
    }

    onSelect(hero: Order) {
        this.selectedHero = hero;
    }

    getHeroes() {
        this.orderService.getOrderList().then(heroes => this.heroes = heroes);
    }
}
