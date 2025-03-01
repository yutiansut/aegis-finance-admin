/**
 * Created by JinWYP on 8/11/16.
 */

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {GlobalPromiseHttpCatch, HttpResponse, API } from './http';


class RiskLine{
    id : number;            //序列id
    name : string;          //资金方公司名称
    type : number;          //类型
    remarks : string;       //备注
    createTime : string;    //备注
    personNum  : number;    //人数
    adminName : string;     //帐号
}

@Injectable()
class RiskService {

    constructor(
        private http: Http
    ) { }



    getRiskSelectList() {
        // let url = `${API.fund}/fund?page=${page||1}&name=${name||''}&account=${account||''}`;
        let url = `${API.risk}/risk/all`;
        return this.http.get(url).toPromise()
            .then(response => {
                var result = response.json() as HttpResponse;
                if (result.data ){
                    result.data = result.data.map( item => { return {name : item.name, id : item.id}})
                }
                return result;
            })
            .catch(GlobalPromiseHttpCatch);
    }

    getRiskLineList(name:string, adminName:string, page:number) {
        let url = `${API.risk}/risk?page=${page||1}&name=${name||''}&adminName=${adminName||''}`;
        // let url = `${API.risk}/risk`;
        return this.http.get(url).toPromise()
            .then(response => response.json() as HttpResponse)
            .catch(GlobalPromiseHttpCatch);
    }

    getRiskLineById(id: number) {
        return this.http.get(API.risk + '/' + id).toPromise()
            .then(response => response.json() as HttpResponse)
            .catch(GlobalPromiseHttpCatch);
    }

    del(id: number) {
        return this.http.delete(API.risk + '/' + id).toPromise()
            .then(response => response.json() as HttpResponse)
            .catch(GlobalPromiseHttpCatch);
    }

    add(riskLine: RiskLine) {
        let headers = new Headers({'Content-Type': 'application/json'});

        return this.http.post(API.risk, JSON.stringify(riskLine), {headers: headers}).toPromise()
            .then(res => res.json() as HttpResponse )
            .catch(GlobalPromiseHttpCatch);
    }

    update(riskLine: RiskLine) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${API.risk}/${riskLine.id}`;

        return this.http.put(url, JSON.stringify(riskLine), {headers: headers}).toPromise()
            .then(res => res.json() as HttpResponse )
            .catch(GlobalPromiseHttpCatch);
    }

    save(riskLine: RiskLine)  {
        if (riskLine.id) {
            return this.update(riskLine);
        }
        return this.add(riskLine);
    }

}



export { RiskService, RiskLine }