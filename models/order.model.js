// import Parse from 'parse';

import Client from './client.model';

export default class Order extends Parse.Object {

    constructor(data) {
        super('Order');

        if (data) {
            this.id = data.id;
            this.set('client', data.get('client'));
        }
    }

    get client() {
        return this.get('client');
    }

    set items(_items) {
        this._items = _items;
    }

    get items() {
        return this._items || [];
    }

    get subtotals() {
        let subtotals = 0;
        for (let i = 0; i < this.items.length; ++i) {
            console.log(this.items[i].subtotals);
            subtotals += this.items[i].subtotals;
        }
        return subtotals;
    }

    get discountTotals() {
        let discountTotals = 0;
        for (let i = 0; i < this.items.length; ++i) {
            discountTotals += this.items[i].discountValue;
        }
        return discountTotals;
    }

    get ivaTotals() {
        let ivaTotals = 0;
        for (let i = 0; i < this.items.length; ++i) {
            ivaTotals += this.items[i].iva;
        }
        return ivaTotals;
    }

    get totals() {
        return this.subtotals + this.discountTotals + this.ivaTotals;
    }
}

Parse.Object.registerSubclass('Order', Order);
