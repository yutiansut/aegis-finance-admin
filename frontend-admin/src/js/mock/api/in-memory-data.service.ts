/**
 * Created by JinWYP on 8/8/16.
 */
export class InMemoryDataServiceOrder {
    createDb() {
        let heroes = [
            {id: 11, name: 'Mr. Nice'},
            {id: 12, name: 'Narco'},
            {id: 13, name: 'Bombasto'},
            {id: 14, name: 'Celeritas'},
            {id: 15, name: 'Magneta'},
            {id: 16, name: 'RubberMan'},
            {id: 17, name: 'Dynama'},
            {id: 18, name: 'Dr IQ'},
            {id: 19, name: 'Magma'},
            {id: 20, name: 'Tornado'},
            {id: 21, name: 'Tornado22'},
            {id: 22, name: 'Tornado33'}
        ];
        return {heroes};
    }
}


export class InMemoryDataServiceUser {
    createDb() {
        let users = [
            {id: 11, name: 'Mr. Nice'},
            {id: 12, name: 'Narco'},
            {id: 13, name: 'Bombasto'},
            {id: 14, name: 'Celeritas'},
            {id: 15, name: 'Magneta'},
            {id: 16, name: 'RubberMan'},
            {id: 17, name: 'Dynama'},
            {id: 18, name: 'Dr IQ'},
            {id: 19, name: 'Magma'},
            {id: 20, name: 'Tornado'},
            {id: 21, name: 'Tornado22'},
            {id: 22, name: 'Tornado33'}
        ];
        return {users};
    }
}