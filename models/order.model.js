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

    get folio() {
        return this.get('folio');
    }

    get status() {
        return this.get('status');
    }

    set items(_items) {
        this._items = _items;
    }

    get items() {
        return this._items || [];
    }

    get notes() {
        return this.get('notes');
    }

    set notes(notes) {
        this.set('notes', notes);
    }

    get date() {
        return this.createdAt;
    }

    removeItem(item) {
        this.items.splice(item.$key, 1);
        if (item.id) { // Check if Item was already saved before:
            this.relation('items').remove(item); // remove from relation.
        }
    }

    get subtotals() {
        let subtotals = 0;
        for (let i = 0; i < this.items.length; ++i) {
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

    isEditable() {
        return this.status > 1;
    }
}

Parse.Object.registerSubclass('Order', Order);
